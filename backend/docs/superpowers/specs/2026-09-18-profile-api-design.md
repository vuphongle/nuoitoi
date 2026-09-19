# Profile API Design

## Goal

Add authenticated APIs that let the current user read and update their own profile without accepting a user ID from the client.

## API Contract

### Get Profile

- Method and path: `GET /api/users/profile`
- Authentication: bearer access token through the existing global `ProtectGuard`
- User identity: `request.user.id`, populated by `ProtectStrategy`
- Success response: the existing `responseSuccess` envelope containing `id`, `name`, `email`, `phone`, `birth_day`, `gender`, `role`, `avatar`, `created_at`, and `updated_at`
- Excluded data: `password` and deletion metadata
- Missing user: `404 Not Found`

### Update Profile

- Method and path: `PATCH /api/users/profile`
- Authentication and identity: same as Get Profile
- Accepted fields: `name`, `email`, `phone`, `birth_day`, `gender`, and `avatar`
- Rejected with `400 Bad Request` by a route-level validation whitelist: `password`, `role`, `id`, deletion fields, audit timestamps, and any other undeclared property
- Email behavior: unchanged email is accepted; a new email already owned by another user returns `400 Bad Request`
- Value behavior: `name` and `email` must be non-empty strings when supplied; `phone`, `birth_day`, `gender`, and `avatar` accept a non-empty string or `null`, where `null` clears the field
- Existing storage conventions remain in place: `birth_day` and `gender` remain strings without introducing new format or enum constraints
- An empty payload is a successful no-op that returns the existing profile without changing `updated_at`
- Success response: the existing `responseSuccess` envelope containing the updated safe profile
- Missing user: `404 Not Found`

## Architecture

### Controller

Add static `profile` routes to `UserController` before the dynamic `:id` routes. Read the authenticated user through a small typed current-user decorator and pass only its numeric ID to the service. The controller remains responsible for HTTP routing, route-level validation, Swagger metadata, and the standard success envelope.

### DTO

Add a dedicated `UpdateProfileDto`. It explicitly declares only the six editable profile fields rather than inheriting from `CreateUserDto`. The PATCH route applies `ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true })`, so password, role, and other unknown properties are rejected instead of silently reaching the service.

### Service

Add `getProfile(id)` and `updateProfile(id, dto)` methods to `UserService`. Both target only accounts where `is_deleted` is false, and Prisma selections explicitly omit sensitive and deletion-related fields. `updateProfile` checks email uniqueness when the email changes, updates `updated_at` only when at least one editable property is supplied, and returns a safe selected result.

Because the database email constraint applies to all rows, including soft-deleted rows, their email addresses remain reserved. The service handles both the friendly pre-check and Prisma `P2002` unique-constraint errors, translating conflicts to `400 Bad Request` so concurrent updates preserve the documented contract.

The existing ID-based user APIs remain unchanged.

## Validation And Errors

- Class-validator rules enforce the specified email, non-empty, string, and nullable-field behavior.
- The profile update method also constructs Prisma update data only from explicitly allowed DTO properties, providing a second boundary behind route-level validation.
- Enabling a global whitelist is outside this change because it could affect existing endpoints.
- Prisma `P2002` email conflicts become `400 Bad Request`; unexpected database errors follow the existing user service convention and become `500 Internal Server Error`.
- Authentication failures continue to be handled by the global guard.
- A token belonging to a soft-deleted account can currently pass `ProtectStrategy`, but profile service methods return `404` and never expose or mutate that account. Changing global authentication behavior is outside this focused change.

## Testing

Use test-driven development with focused unit tests:

- Controller GET uses `request.user.id` and wraps the service result.
- Controller PATCH uses `request.user.id`, passes the DTO, and wraps the result.
- Service GET selects and returns only safe profile fields and returns 404 for a missing account.
- Service GET returns 404 for a soft-deleted account.
- Service PATCH updates allowed fields, permits an unchanged email, rejects an email owned by another user, returns 404 for a missing account, and does not forward undeclared sensitive fields to Prisma.
- Service PATCH translates Prisma `P2002` conflicts, treats empty input as a no-op, supports clearing nullable fields with `null`, and excludes soft-deleted accounts.
- DTO validation tests cover blank `name` and `email`, invalid email, empty strings on nullable fields, accepted `null` clearing values, and rejected unknown properties.
- A focused HTTP integration test bootstraps the controller with the same `api` global prefix and profile route validation used by the application. Test middleware supplies an authenticated `request.user`, while separate guard tests retain responsibility for JWT authentication behavior. Requests to the public path `/api/users/profile` verify that the static route wins over `/:id`, the authenticated user ID reaches the service, and unknown fields such as `password` and `role` return `400`.

After focused tests pass, run the complete test suite and production build.
