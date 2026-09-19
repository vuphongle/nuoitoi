# Profile API Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add authenticated GET and PATCH profile APIs that identify the current user from JWT and never expose or update passwords or roles.

**Architecture:** Static `/users/profile` routes use a typed current-user decorator and delegate to focused `UserService` methods. A dedicated DTO plus a route-level whitelist enforces the PATCH contract, while Prisma queries explicitly select safe fields and exclude soft-deleted accounts.

**Tech Stack:** NestJS 11, TypeScript, Prisma 6, class-validator, Jest, Supertest

---

## Chunk 1: Profile API

### Task 1: Define And Verify PATCH Validation

**Files:**
- Create: `src/modules/modules-api/user/dto/update-profile.dto.ts`
- Create: `src/modules/modules-api/user/dto/update-profile.dto.spec.ts`

- [ ] **Step 1: Add the complete failing DTO test matrix**

  In one test file, use `plainToInstance` plus `validate` for separate cases covering: valid partial values; invalid email; blank `name`; blank `email`; nullable fields accepting `null`; nullable fields rejecting empty strings. Also transform payloads through `new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true })` with metatype `UpdateProfileDto` and verify `password` and `role` each reject with `BadRequestException`.

- [ ] **Step 2: Run the DTO test and verify RED**

  Run: `npm test -- --runInBand modules/modules-api/user/dto/update-profile.dto.spec.ts`

  Expected: FAIL because `UpdateProfileDto` does not exist.

- [ ] **Step 3: Implement the six DTO properties**

  Use `ApiPropertyOptional` on all properties. For `name`, use `ValidateIf(value !== undefined)`, `IsString`, and `IsNotEmpty`. For `email`, use the same decorators plus `IsEmail`. For `phone`, `birth_day`, `gender`, and `avatar`, use `IsOptional`, `IsString`, and `IsNotEmpty`; this permits `undefined` and `null` but rejects empty strings.

- [ ] **Step 4: Run the complete DTO matrix and verify GREEN**

  Run the command from Step 2. Expected: PASS.

### Task 2: Implement Profile Service With TDD

**Files:**
- Create: `src/modules/modules-api/user/user.service.spec.ts`
- Modify: `src/modules/modules-api/user/user.service.ts`

- [ ] **Step 1: Add a failing safe GET test**

  Stub `prisma.users.findFirst` with a safe profile. Expect `getProfile(id)` to call `findFirst` with `where: { id, is_deleted: false }` and an explicit select containing only `id`, `name`, `email`, `phone`, `birth_day`, `gender`, `role`, `avatar`, `created_at`, and `updated_at`.

- [ ] **Step 2: Run the service test and verify RED**

  Run: `npm test -- --runInBand modules/modules-api/user/user.service.spec.ts`

  Expected: FAIL because `getProfile` does not exist.

- [ ] **Step 3: Implement safe GET**

  Add a file-level `profileSelect satisfies Prisma.usersSelect` and implement `getProfile(id)` with `findFirst`. Throw `NotFoundException` when no active account exists.

- [ ] **Step 4: Add missing and soft-deleted GET cases**

  Make `findFirst` return `null` and verify 404. The `is_deleted: false` expectation proves soft-deleted rows are excluded.

- [ ] **Step 5: Run GET service tests and verify GREEN**

  Run the command from Step 2. Expected: GET cases pass.

- [ ] **Step 6: Add a failing empty PATCH test**

  Expect `updateProfile(id, {})` to call `getProfile(id)` behavior and never call `prisma.users.update`.

- [ ] **Step 7: Implement empty PATCH no-op**

  Build an explicit update object from the six editable keys, preserving `null`; if it has no keys, return `getProfile(id)` without modifying `updated_at`.

- [ ] **Step 8: Run the empty PATCH test and verify GREEN**

  Run the command from Step 2. Expected: the no-op case passes and `prisma.users.update` has zero calls.

- [ ] **Step 9: Add a failing successful PATCH test without an email change**

  Update `name` and clear `phone` with `null`. Expect active-account lookup, manual field allowlisting, explicit `null` forwarding, `updated_at`, safe selection, and the updated safe profile result. Include casted extra `password` and `role` input and assert neither reaches Prisma.

- [ ] **Step 10: Implement successful PATCH without email uniqueness logic**

  Use `findFirst({ where: { id, is_deleted: false } })`, throw 404 when absent, then call `update({ where: { id, is_deleted: false }, data, select: profileSelect })` so a concurrent soft deletion cannot be mutated. Do not add a `try` block yet; unexpected Prisma errors intentionally remain unhandled until their failing tests are added.

- [ ] **Step 11: Run the successful PATCH test and verify GREEN**

  Run the command from Step 2. Expected: safe non-email update passes.

- [ ] **Step 12: Add failing email behavior tests**

  Verify unchanged email skips the uniqueness query; an email owned by another row returns `BadRequestException`; and emails on soft-deleted rows remain reserved because uniqueness uses `findUnique` without an `is_deleted` filter.

- [ ] **Step 13: Run email tests and verify RED**

  Run the command from Step 2. Expected: changed-email cases fail because uniqueness logic is absent.

- [ ] **Step 14: Implement email uniqueness behavior**

  When `email` is defined and differs from the active account email, call `findUnique({ where: { email } })`; throw `BadRequestException('Email already exists')` when it returns another user. Leave unchanged email and omitted email without a uniqueness call.

- [ ] **Step 15: Run email tests and verify GREEN**

  Run the command from Step 2. Expected: all email cases pass.

- [ ] **Step 16: Add failing Prisma error translation tests**

  Parameterize failures from `findFirst`, `findUnique`, and `update` with generic errors and expect `InternalServerErrorException`. Reject update with a `PrismaClientKnownRequestError` using code `P2002` and expect `BadRequestException`; reject it with `P2025` and expect `NotFoundException`.

- [ ] **Step 17: Run error translation tests and verify RED**

  Run the command from Step 2. Expected: raw Prisma/generic errors escape because translation is absent.

- [ ] **Step 18: Implement one complete error boundary**

  Wrap the active lookup, uniqueness check, and update in one `try/catch`. In the catch block, first rethrow intentional `BadRequestException` and `NotFoundException`; translate Prisma `P2002` to duplicate-email 400 and `P2025` to profile-not-found 404; translate every other database failure to `InternalServerErrorException('Failed to update profile')`.

- [ ] **Step 19: Run all service tests and verify GREEN**

  Run the command from Step 2. Expected: all service cases pass.

### Task 3: Add HTTP Contract Before Controller Implementation

**Files:**
- Create: `test/user-profile.e2e-spec.ts`
- Create: `src/modules/modules-api/user/user.controller.spec.ts`
- Create: `src/common/decorators/current-user.decorator.ts`
- Modify: `src/modules/modules-api/user/user.controller.ts`

- [ ] **Step 1: Add a failing controller GET unit test**

  Instantiate `UserController` with a typed service stub. Call the future GET handler with `{ id: 7 }` and expect `getProfile(7)` plus `responseSuccess(profile, 'Get profile successfully')`.

- [ ] **Step 2: Add a failing GET HTTP test**

  Build a Nest test module with `UserController` and a stubbed `UserService`, add middleware that sets `request.user = { id: 7 }`, set global prefix `api`, request `GET /api/users/profile`, and expect `getProfile(7)` plus the standard success envelope.

- [ ] **Step 3: Run controller and GET HTTP tests and verify RED**

  Run: `npm test -- --runInBand modules/modules-api/user/user.controller.spec.ts`

  Expected: FAIL because the profile controller handlers do not exist.

  Run: `npm run test:e2e -- --runInBand user-profile.e2e-spec.ts`

  Expected: FAIL with 404 because the static route does not exist.

- [ ] **Step 4: Add the current-user decorator**

  Implement `CurrentUser` with `createParamDecorator((_data, context) => context.switchToHttp().getRequest().user)`. Export `AuthenticatedUser = Omit<users, 'password'>` for controller typing.

- [ ] **Step 5: Add GET profile before `GET :id`**

  Add `@Get('profile')`, bearer/operation/response Swagger metadata, `@CurrentUser() user`, a call to `userService.getProfile(user.id)`, and `responseSuccess(result, 'Get profile successfully')`.

- [ ] **Step 6: Run controller GET and HTTP GET tests and verify GREEN**

  Run both commands from Step 3. Expected: GET cases pass, proving delegation, response wrapping, and static route resolution.

- [ ] **Step 7: Add failing PATCH HTTP tests**

  First add a controller PATCH unit test that calls the future handler with `{ id: 7 }` and a DTO, expecting `updateProfile(7, dto)` plus `responseSuccess(profile, 'Update profile successfully')`. Then add HTTP cases verifying a valid body calls `updateProfile(7, dto)` and returns the standard envelope; separate requests containing `password` and `role` must return 400 and must not call the service.

- [ ] **Step 8: Run PATCH HTTP tests and verify RED**

  Run both the unit and e2e commands from Step 3. Expected: the controller PATCH unit case and HTTP PATCH cases fail because the handler and route do not exist.

- [ ] **Step 9: Add PATCH profile before `PATCH :id`**

  Add `@Patch('profile')`, Swagger metadata, and `@UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }))`. Pass `user.id` and `UpdateProfileDto` to `updateProfile`, then wrap the result with `responseSuccess(result, 'Update profile successfully')`.

- [ ] **Step 10: Run all controller and profile HTTP tests and verify GREEN**

  Run both commands from Step 3. Expected: controller delegation/envelope, GET, valid PATCH, password rejection, and role rejection all pass.

### Task 4: Final Verification

**Files:**
- Verify all files changed in Tasks 1-3.

- [ ] **Step 1: Format changed TypeScript files**

  Run: `npx prettier --write src/common/decorators/current-user.decorator.ts src/modules/modules-api/user/dto/update-profile.dto.ts src/modules/modules-api/user/dto/update-profile.dto.spec.ts src/modules/modules-api/user/user.controller.ts src/modules/modules-api/user/user.controller.spec.ts src/modules/modules-api/user/user.service.ts src/modules/modules-api/user/user.service.spec.ts test/user-profile.e2e-spec.ts`

- [ ] **Step 2: Run the full unit suite**

  Run: `npm test -- --runInBand`

  Expected: zero failures.

- [ ] **Step 3: Run the full e2e suite**

  Run: `npm run test:e2e -- --runInBand`

  Expected: zero failures.

- [ ] **Step 4: Run the production build**

  Run: `npm run build`

  Expected: exit code 0.

- [ ] **Step 5: Verify the security boundary without Git diff**

  Run: `rg -n "password|role" src/modules/modules-api/user/dto/update-profile.dto.ts`

  Expected: no matches.

  Run: `rg -n "@(Get|Patch)\\('profile'\\)|getProfile|updateProfile" src/modules/modules-api/user/user.controller.ts src/modules/modules-api/user/user.service.ts`

  Expected: both static routes and both service methods are present.

### Deterministic Test Fixtures And Doubles

Use this exact shared profile shape in the new tests so no fixture decisions remain:

```ts
const profile = {
  id: 7,
  name: 'Nguyen Minh Huy',
  email: 'huy@example.com',
  phone: '0912345678',
  birth_day: '2000-10-01',
  gender: 'male',
  role: 'user',
  avatar: 'https://cdn.example.com/avatar.jpg',
  created_at: new Date('2026-01-01T00:00:00.000Z'),
  updated_at: new Date('2026-01-01T00:00:00.000Z'),
};
```

Use this exact Prisma double in `user.service.spec.ts`:

```ts
const prisma = {
  users: {
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
} as unknown as PrismaService;

const service = new UserService(prisma);
```

Create a fresh Prisma double and a fresh `UserService` in `beforeEach`; additionally call `jest.resetAllMocks()` so neither calls nor implementations leak across cases. Use `new Prisma.PrismaClientKnownRequestError('constraint', { code: 'P2002', clientVersion: '6.15.0' })` and the same constructor with `P2025` for known-error fixtures.

Use this exact controller/e2e service double:

```ts
const userService = {
  getProfile: jest.fn(),
  updateProfile: jest.fn(),
} as unknown as UserService;
```

Create a fresh controller/e2e service double in each suite's `beforeEach` and call `jest.resetAllMocks()`. In the e2e setup, register `{ provide: UserService, useValue: userService }`, create the Nest application, call `app.use((request, _response, next) => { request.user = { id: 7 }; next(); })`, call `app.setGlobalPrefix('api')`, and then `await app.init()`. Close it in `afterEach` with `await app.close()`.

Every listed case must be a separate Jest `it`/`it.each` case with the exact fixture above. Each implementation step names every decorator, Prisma argument, error mapping, message, and response assertion needed; the executor must not introduce fields, validation rules, routes, or error behavior beyond those written here and in the approved design.

Git commit steps are intentionally omitted because this workspace is not currently a Git repository. The preferred `.agents/superpowers/specs` location is read-only in this environment, so this plan is stored alongside the approved design under `docs/superpowers/specs`.
