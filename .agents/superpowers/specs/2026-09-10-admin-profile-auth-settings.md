# Admin Profile, Session, Settings, and Not-Found Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep unknown routes and expired sessions inside the correct admin experience while adding reusable profile fetching/updating and two functional settings tabs.

**Architecture:** Public requests retain `apiClient`. Protected BFF requests use `adminApiClient`, which shares a pure authorization-status detector and runs an admin-only cleanup coordinator. Profile server state belongs to TanStack Query and successful profiles are copied into the existing Zustand auth store. A catch-all route explicitly invokes the admin segment's `not-found.tsx`.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Axios, TanStack Query 5, Zustand 5, React Hook Form, Zod 4, shadcn/Radix UI, Node 24 test runner.

**Baseline:** `node --test lib/auth.test.mjs lib/i18n-keys.test.mjs` currently reports 5 passing tests and one unrelated failure: `login translations use the Card Platform brand` because the current locales use `NuoiToi`. This feature must not add failures; the baseline branding mismatch is reported rather than changed.

**Test import rule:** Executable Node tests import only production modules whose runtime imports are package imports or explicit relative `.ts` imports. All React/Next modules that use `@/` aliases are verified through alias-free extracted coordinators plus narrow source-contract tests. Index files only re-export; they never own validation logic.

---

## Chunk 1: Authorization and Profile Contracts

### Task 1: Add pure authorization-status normalization

**Files:**

- Create: `lib/admin-auth-response.ts`
- Test: `lib/admin-auth-response.test.mjs`

- [ ] **Step 1: Create the test.** Test `getAdminAuthorizationStatus(httpStatus, payload)` for HTTP `401`, HTTP `403`, payload numeric/string `401` and `403`, success `200`, and unrelated payloads.
- [ ] **Step 2: Run the test loader.** Run `node --test lib/admin-auth-response.test.mjs`. Expected: `ERR_MODULE_NOT_FOUND` for `admin-auth-response.ts`; this is not yet the RED gate.
- [ ] **Step 3: Add a signature-only scaffold.** Create the exported types/classes/functions with `getAdminAuthorizationStatus()` returning `null` and `throwIfAdminAuthorizationFailure()` returning normally.
- [ ] **Step 4: Verify RED.** Run the same command. Expected: at least four assertion failures where `null` is returned instead of `401`/`403`.
- [ ] **Step 5: Implement the helper.** Payload status takes precedence when it is `401` or `403`; otherwise use the HTTP status. `AdminAuthorizationError` exposes `status` and a backend-preferred message. Also define `AdminRoleError` for a successful non-admin profile.
- [ ] **Step 6: Verify GREEN.** Run the same command. Expected: exit 0 and all authorization cases pass.
- [ ] **Step 7: Commit.** Run `git add lib/admin-auth-response.ts lib/admin-auth-response.test.mjs && git commit -m "feat: define admin authorization failures"`.

### Task 2: Add profile-specific models and form validation

**Files:**

- Modify: `types/user.ts`
- Create: `features/admin/settings/profile-form.ts`
- Modify: `features/admin/settings/schemas/index.ts`
- Test: `features/admin/settings/profile-form.test.mjs`

- [ ] **Step 1: Add the test, then an empty callable scaffold after the expected module-load failure.** Test `buildProfilePatch(values, dirtyFields)` omitting untouched/`undefined` fields while preserving `''`, profile schema rules, and password schema rules. Assert no `currentPassword` key is produced. Do not test profile extraction here; Task 6 owns it.
- [ ] **Step 2: Verify RED.** Run `node --test features/admin/settings/profile-form.test.mjs`. Expected after the scaffold loads: assertion failures for field filtering and validation.
- [ ] **Step 3: Implement isolated profile contracts.** Keep existing `UserItem` unchanged. Add `UserProfile`, `ProfileGender`, `ProfileLanguage`, `ProfileResponse`, `UpdateProfilePayload`, and `UpdatePasswordPayload`. `profile-form.ts` owns schemas and builders; `schemas/index.ts` only re-exports them. Validate non-empty name, optional phone, a real calendar date serialized as `YYYY-MM-DD` or empty, `Male|Female|Other`, empty or absolute HTTP(S) avatar, `vi|en`, password minimum 8, and matching confirmation.
- [ ] **Step 4: Implement payload construction.** `buildProfilePatch` accepts supported form values plus dirty-field flags and returns only dirty allowlisted keys; explicit empty strings remain present and dates remain unchanged strings.
- [ ] **Step 5: Verify GREEN.** Run `node --test features/admin/settings/profile-form.test.mjs`. Expected: exit 0 and all contract/schema cases pass.
- [ ] **Step 6: Commit.** Run `git add types/user.ts features/admin/settings/profile-form.ts features/admin/settings/profile-form.test.mjs features/admin/settings/schemas/index.ts && git commit -m "feat: define profile update contracts"`.

### Task 3: Add tested admin-session cleanup coordination

**Files:**

- Create: `lib/admin-session.ts`
- Test: `lib/admin-session.test.mjs`

- [ ] **Step 1: Write a failing test against a compilable coordinator stub.** Inject `removeProfileQuery`, `logoutStore`, `revokeServerSession`, `getPathname`, and `replaceLocation`. Assert cleanup order, redirect outside `/auth/login`, no redundant redirect on login, and deduplication of concurrent failures.
- [ ] **Step 2: Verify RED.** Run `node --test lib/admin-session.test.mjs`. Expected: assertions fail because the stub performs no cleanup.
- [ ] **Step 3: Implement `createAdminSessionExpiryHandler(dependencies)`.** Remove only `['admin-profile']`, clear Zustand, then attempt `POST /api/auth/logout`. Navigation runs from `finally`, so a failed revocation still replaces the current URL with `/auth/login` when necessary. Use one in-flight promise to prevent duplicated logout calls/redirects.
- [ ] **Step 4: Verify GREEN.** Run `node --test lib/admin-session.test.mjs`. Expected: exit 0; cleanup, login-page behavior, and concurrency tests pass.
- [ ] **Step 5: Commit.** Run `git add lib/admin-session.ts lib/admin-session.test.mjs && git commit -m "feat: coordinate admin session expiry"`.

### Task 4: Add the isolated admin API client and migrate only active protected services

**Files:**

- Create: `lib/admin-api-client.ts`
- Create: `lib/admin-response-handler.ts`
- Create: `lib/query-client.ts`
- Modify: `components/providers/query-provider.tsx`
- Modify: `services/user.service.ts`
- Modify: `services/admin-blog.service.ts`
- Modify: `services/admin-blog-category.service.ts`
- Modify: `services/admin-product.service.ts`
- Modify: `services/admin-product-category.service.ts`
- Test: `lib/admin-response-handler.test.mjs`
- Test: `lib/admin-api-client-contract.test.mjs`

- [ ] **Step 1: Write the executable response-handler test.** The alias-free handler accepts `{ httpStatus, payload, cleanup }`. Assert HTTP-success/payload `401` or `403` awaits cleanup then throws `AdminAuthorizationError`; HTTP `401/403` does the same; ordinary success returns normally; cleanup is called exactly once.
- [ ] **Step 2: Verify RED.** After adding a callable no-op scaffold, run `node --test lib/admin-response-handler.test.mjs`. Expected: assertion failures for missing cleanup/error behavior.
- [ ] **Step 3: Implement the response handler.** Both fulfilled and rejected Axios paths call this same helper, so payload-only failures cannot bypass cleanup.
- [ ] **Step 4: Write the source-contract test.** Assert `admin-api-client.ts` uses the shared response handler and session handler; public services keep `apiClient`; the five existing services backed by admin BFF routes use `adminApiClient`. Do not include brand/campaign services because matching BFF routes do not exist.
- [ ] **Step 5: Verify contract RED.** Run `node --test lib/admin-api-client-contract.test.mjs`. Expected: failures because the new client is missing and protected services still use `apiClient`.
- [ ] **Step 6: Extract the QueryClient singleton.** Move browser/server construction into `lib/query-client.ts`. Configure query and mutation retry functions to return false for `AdminAuthorizationError` and otherwise preserve the existing one-retry policy. Export `PROFILE_QUERY_KEY` and `getQueryClient`; keep `QueryProvider` as the wrapper.
- [ ] **Step 7: Implement `adminApiClient`.** Mirror get/post/put/patch/delete. Its fulfilled interceptor awaits the response handler for validation/cleanup and then returns the original `AxiosResponse`; its rejected interceptor awaits the handler with Axios error status/data and rethrows the original non-auth error. Request methods continue to unwrap `response.data`. Register cleanup dependencies once at module initialization using query client, Zustand, fetch, pathname, and location replacement. Keep SSR-safe guards by reading `window.location` only inside injected callbacks after checking `typeof window !== 'undefined'`.
- [ ] **Step 8: Migrate the five protected service files.** Change only their client import/reference. Leave public services and currently non-BFF brand/campaign services unchanged.
- [ ] **Step 9: Verify GREEN.** Run `node --test lib/admin-auth-response.test.mjs lib/admin-session.test.mjs lib/admin-response-handler.test.mjs lib/admin-api-client-contract.test.mjs`. Expected: exit 0 and all tests pass.
- [ ] **Step 10: Commit.** Run `git add lib/admin-api-client.ts lib/admin-response-handler.ts lib/query-client.ts components/providers/query-provider.tsx services/user.service.ts services/admin-blog.service.ts services/admin-blog-category.service.ts services/admin-product.service.ts services/admin-product-category.service.ts lib/admin-response-handler.test.mjs lib/admin-api-client-contract.test.mjs && git commit -m "feat: isolate protected admin requests"`.

### Task 5: Add the profile BFF route and expire cookies on authorization failures

**Files:**

- Modify: `lib/admin-proxy.ts`
- Create: `app/api/users/profile/route.ts`
- Test: `lib/admin-proxy-contract.test.mjs`

- [ ] **Step 1: Write a failing contract test.** Assert the profile route exports `GET` and `PATCH` forwarding exactly `users/profile`; assert the proxy imports the shared detector, normalizes payload-only auth statuses, and expires `AUTH_COOKIE_NAME` with `value: ''`, `httpOnly: true`, `sameSite: 'lax'`, `path: '/'`, and `maxAge: 0` for locally invalid sessions and backend `401/403`.
- [ ] **Step 2: Verify RED.** Run `node --test lib/admin-proxy-contract.test.mjs`. Expected: failures for missing profile route, missing shared detector, and missing cookie expiration.
- [ ] **Step 3: Add a single `adminAuthFailureResponse` helper inside the proxy.** It creates the JSON response with normalized status and applies the exact expired-cookie attributes. Use it for missing/invalid local sessions and backend authorization failures.
- [ ] **Step 4: Add `app/api/users/profile/route.ts`.** `GET` and `PATCH` each call `proxyAdminRequest(request, 'users/profile')`.
- [ ] **Step 5: Verify GREEN.** Run `node --test lib/admin-auth-response.test.mjs lib/admin-proxy-contract.test.mjs lib/auth.test.mjs`. Expected: exit 0 and all listed tests pass.
- [ ] **Step 6: Commit.** Run `git add lib/admin-proxy.ts app/api/users/profile/route.ts lib/admin-proxy-contract.test.mjs && git commit -m "feat: proxy admin profile requests"`.

---

## Chunk 2: Profile Query, Login, and Routing

### Task 6: Add profile service, query options, hooks, and store synchronization

**Files:**

- Create: `services/profile.service.ts`
- Create: `hooks/profile-query.ts`
- Create: `hooks/profile-refresh.ts`
- Create: `hooks/use-profile.ts`
- Modify: `services/index.ts`
- Modify: `hooks/index.ts`
- Modify: `stores/auth.store.ts`
- Test: `hooks/profile-query.test.mjs`
- Test: `hooks/profile-hooks-contract.test.mjs`

- [ ] **Step 1: Write the failing pure query test, then add signature-only scaffolds after the expected load failure.** Keep `profile-refresh.ts` alias-free at runtime. Test `extractAdminProfile(response)` returns `response.data`, rejects a missing profile, and throws `AdminRoleError` for `role !== 'admin'`; test `refreshProfileAfterPatch(refresh)` returns fresh profile, returns `{ updated: true, refreshError }` without overwriting data for non-auth refresh failure, rethrows `AdminAuthorizationError` unchanged without another cleanup call, and runs cleanup only for `AdminRoleError` before rethrowing it.
- [ ] **Step 2: Verify RED.** Run `node --test hooks/profile-query.test.mjs`. Expected: assertion failures from stubbed extraction/refresh functions.
- [ ] **Step 3: Implement the service/query primitives.** `profileService.getProfile()` uses `adminApiClient.get<ProfileResponse>('/users/profile')`; `updateProfile()` patches the same URL with either allowlisted DTO. `profileQueryOptions()` returns `queryKey: PROFILE_QUERY_KEY`, `queryFn`, `retry: false`, and `staleTime: 0`. `extractAdminProfile` throws the distinct `AdminRoleError` before any cache/store synchronization.
- [ ] **Step 4: Implement hooks.** `useProfile(options)` calls `useQuery`, then synchronizes successful data into `useAuthStore.setUser`. `useUpdateProfile()` patches, immediately marks PATCH success, forces `queryClient.fetchQuery(profileQueryOptions())`, writes only the fresh admin profile to cache/store, and returns a refresh-warning result for non-auth refresh failures. Auth failures remain rejected.
- [ ] **Step 5: Update the store without narrowing user CRUD types.** Store `Partial<UserProfile> | null`; persistence stays limited to `user` and `isAuthenticated`.
- [ ] **Step 6: Add a source-contract test.** Assert the service uses `adminApiClient`, hooks use TanStack Query, profile query disables retries, mutation forces a fresh GET, and synchronization calls `setUser` only with extracted profile data.
- [ ] **Step 7: Verify GREEN.** Run `node --test hooks/profile-query.test.mjs hooks/profile-hooks-contract.test.mjs`. Expected: exit 0 and all tests pass.
- [ ] **Step 8: Commit.** Run `git add services/profile.service.ts hooks/profile-query.ts hooks/profile-refresh.ts hooks/use-profile.ts services/index.ts hooks/index.ts stores/auth.store.ts hooks/profile-query.test.mjs hooks/profile-hooks-contract.test.mjs && git commit -m "feat: add reusable admin profile hooks"`.

### Task 7: Integrate fresh profile checks into login and admin layout

**Files:**

- Create: `features/auth/login/login-profile-flow.ts`
- Modify: `features/auth/login/components/login-form.tsx`
- Modify: `app/admin/layout.tsx`
- Modify: `components/layout/admin-header.tsx`
- Test: `features/auth/login/login-profile-flow.test.mjs`

- [ ] **Step 1: Write a failing executable login-decision test plus narrow source contracts.** The alias-free `getLoginProfileAction({ isFetchedAfterMount, isSuccess, profile, error })` returns `redirect`, `stay`, `cleanup-role`, or `show-error`. Cover cached pre-fetch data, fresh admin success, auth failure, non-admin success, and ordinary server failure. Source assertions only verify that the component delegates to this function, calls `refetch()` after login, uses `router.replace`, and the layout/header use the profile hook/store.
- [ ] **Step 2: Verify RED.** Run `node --test features/auth/login/login-profile-flow.test.mjs`. Expected: failures because the current login stores token claims directly, layout calls `/api/auth/me`, and header is static.
- [ ] **Step 3: Implement the decision helper and login mount behavior.** Run a fresh profile query with no retry. Delegate every settled state to the tested helper. Redirect only for fresh admin success. Auth failure cleanup remains on login. `cleanup-role` runs the same server/cache/store cleanup and remains on login without a redirect loop.
- [ ] **Step 4: Implement post-login behavior.** After `loginApi.login`, call `profileQuery.refetch()`. Only the fresh admin profile causes `router.replace(DASHBOARD)`; otherwise display the profile-fetch/backend error and remain on login.
- [ ] **Step 5: Replace layout session verification.** Render loading while profile is pending; render the admin shell for an admin profile; render a retryable inline error only for non-auth/non-role failures. `AdminAuthorizationError` redirects through `adminApiClient`; `AdminRoleError` explicitly runs the same server/cache/store cleanup and login redirect rather than displaying a retryable error.
- [ ] **Step 6: Render and revoke header identity.** Show avatar/name/email from the store. Logout posts the logout route, removes `PROFILE_QUERY_KEY`, clears the store, and replaces `/auth/login`.
- [ ] **Step 7: Verify GREEN.** Run `node --test features/auth/login/login-profile-flow.test.mjs hooks/profile-hooks-contract.test.mjs lib/admin-session.test.mjs`. Expected: exit 0 and all tests pass.
- [ ] **Step 8: Commit.** Run `git add features/auth/login/login-profile-flow.ts features/auth/login/components/login-form.tsx app/admin/layout.tsx components/layout/admin-header.tsx features/auth/login/login-profile-flow.test.mjs && git commit -m "feat: synchronize admin profile sessions"`.

### Task 8: Add admin-scoped not-found routing

**Files:**

- Create: `app/admin/not-found.tsx`
- Create: `app/admin/[...not-found]/page.tsx`
- Modify: `shared/i18n/locales/vi/common.ts`
- Modify: `shared/i18n/locales/en/common.ts`
- Test: `app/admin/admin-not-found.test.mjs`

- [ ] **Step 1: Write the failing route test.** Assert catch-all imports and invokes `notFound()` and the boundary links to `/admin/dashboard` and `/admin/settings` without `MarketingLayout` or locale/public links. Assert both locales define `adminNotFound.title`, `description`, `dashboard`, and `settings`.
- [ ] **Step 2: Verify RED.** Run `node --test app/admin/admin-not-found.test.mjs`. Expected: failure because both route files and translation keys are missing.
- [ ] **Step 3: Implement the catch-all.** The server page immediately calls `notFound()`; no params are needed.
- [ ] **Step 4: Implement the boundary.** Use existing card/button/icon primitives and semantic theme classes. It renders inside the authenticated admin layout with dashboard/settings actions and accessible icon treatment.
- [ ] **Step 5: Verify GREEN.** Run `node --test app/admin/admin-not-found.test.mjs`. Expected: exit 0 and all route/translation assertions pass.
- [ ] **Step 6: Manual route check.** With a valid admin cookie, open `/admin/does-not-exist/deep` and expect sidebar/header plus admin 404. In a private window, open the same URL and expect `/auth/login`, not the public marketing 404.
- [ ] **Step 7: Commit.** Run `git add app/admin/not-found.tsx 'app/admin/[...not-found]/page.tsx' app/admin/admin-not-found.test.mjs shared/i18n/locales/vi/common.ts shared/i18n/locales/en/common.ts && git commit -m "feat: add admin not-found experience"`.

---

## Chunk 3: Functional Settings UI

### Task 9: Build the two settings forms

**Files:**

- Modify: `features/admin/settings/components/settings-dashboard.tsx`
- Create: `features/admin/settings/components/profile-settings-form.tsx`
- Create: `features/admin/settings/components/security-settings-form.tsx`
- Create: `features/admin/settings/settings-submit.ts`
- Modify: `features/admin/settings/components/index.ts`
- Modify: `features/admin/settings/types/index.ts`
- Modify: `shared/i18n/locales/vi/settings.ts`
- Modify: `shared/i18n/locales/en/settings.ts`
- Test: `features/admin/settings/settings-contract.test.mjs`
- Test: `features/admin/settings/settings-submit.test.mjs`

- [ ] **Step 1: Write failing behavioral submission tests and a narrow source contract.** The alias-free submission coordinator covers validation preventing mutation, unchanged-profile no-op, PATCH failure preserving values, fresh-profile success, refresh-warning success, password clearing after PATCH success, and password retention after PATCH failure. The source contract asserts exactly two tabs, exact required fields/hook usage/locales, both submit buttons disabled from mutation pending state, and `useNotification` used for profile/password success, PATCH error, and refresh warning.
- [ ] **Step 2: Verify RED.** Run `node --test features/admin/settings/settings-contract.test.mjs features/admin/settings/profile-form.test.mjs features/admin/settings/settings-submit.test.mjs`. Expected: settings/submission failures against the current four-tab placeholder page while schema tests remain green.
- [ ] **Step 3: Reduce the dashboard to two responsive tabs.** Use `grid-cols-2`, keep existing page title/subtitle, and render focused Profile/Security form components.
- [ ] **Step 4: Implement profile loading/error states.** While `useProfile` is pending, render labeled skeleton/disabled content. For non-auth error, render the localized message and a button calling `refetch()`. Do not discard form values for mutation errors.
- [ ] **Step 5: Implement Profile form initialization and reset.** Defaults are `name`, `email`, `phone`, `birth_day`, `gender`, `avatar`, and `lang` from query data with empty-string fallbacks. Unrelated/background query updates call `reset` only when the form is pristine (`!isDirty`) and not submitting. A successful mutation with a fresh profile explicitly resets to that returned profile and clears dirty state. Email is `readOnly` and excluded from the patch builder.
- [ ] **Step 6: Implement Profile submission.** Validate with Zod, build a dirty-field allowlisted patch, skip/no-op with a localized message when nothing changed, call `useUpdateProfile`, disable submit from `updateProfile.isPending`, preserve values on failure, and call existing `useNotification`: `success` for fresh profile, `error` with backend-preferred text for PATCH failure, and `warning` when PATCH succeeded but refresh failed.
- [ ] **Step 7: Implement Security submission.** Validate minimum eight characters and equality; submit exactly `{ password }`; never request current password. Disable submit from mutation pending state. Clear both fields whenever PATCH succeeds, including the refresh-warning result. Retain fields only when PATCH itself fails. Use the existing notification provider for success, PATCH error, and refresh warning.
- [ ] **Step 8: Verify GREEN.** Run `node --test features/admin/settings/profile-form.test.mjs features/admin/settings/settings-submit.test.mjs features/admin/settings/settings-contract.test.mjs`. Expected: exit 0 and all behavior/schema/source contracts pass.
- [ ] **Step 9: UI check at 1440x900.** Open `/admin/settings`; expect two equal tabs, readable card width, visible labels/focus rings, disabled submit while pending, and no overflow in light/dark themes.
- [ ] **Step 10: UI check at 375x812.** Expect both tabs remain reachable, all controls fit without horizontal scrolling, buttons meet at least 44px height, and validation/error text wraps without clipping.
- [ ] **Step 11: Commit.** Run `git add features/admin/settings/components/settings-dashboard.tsx features/admin/settings/components/profile-settings-form.tsx features/admin/settings/components/security-settings-form.tsx features/admin/settings/components/index.ts features/admin/settings/settings-submit.ts features/admin/settings/types/index.ts shared/i18n/locales/vi/settings.ts shared/i18n/locales/en/settings.ts features/admin/settings/settings-submit.test.mjs features/admin/settings/settings-contract.test.mjs && git commit -m "feat: connect admin profile settings"`.

---

## Chunk 4: Verification and Review

### Task 10: Run complete automated verification

**Files:**

- Modify only feature files implicated by failures introduced by this work.

- [ ] **Step 1: Run new tests.** Run `node --test lib/admin-auth-response.test.mjs lib/admin-session.test.mjs lib/admin-response-handler.test.mjs lib/admin-api-client-contract.test.mjs lib/admin-proxy-contract.test.mjs hooks/profile-query.test.mjs hooks/profile-hooks-contract.test.mjs features/auth/login/login-profile-flow.test.mjs app/admin/admin-not-found.test.mjs features/admin/settings/profile-form.test.mjs features/admin/settings/settings-submit.test.mjs features/admin/settings/settings-contract.test.mjs`. Expected: exit 0, zero failures.
- [ ] **Step 2: Run existing tests.** Run `node --test lib/auth.test.mjs lib/i18n-keys.test.mjs`. Expected: auth tests and locale-section test pass; the one pre-existing Card Platform branding assertion may remain the sole failure and must be reported unchanged.
- [ ] **Step 3: Run focused lint.** Run `npx eslint app/admin/layout.tsx app/admin/not-found.tsx 'app/admin/[...not-found]/page.tsx' app/api/users/profile/route.ts components/layout/admin-header.tsx components/providers/query-provider.tsx features/auth/login/components/login-form.tsx features/auth/login/login-profile-flow.ts features/admin/settings/components/settings-dashboard.tsx features/admin/settings/components/profile-settings-form.tsx features/admin/settings/components/security-settings-form.tsx features/admin/settings/profile-form.ts features/admin/settings/settings-submit.ts hooks/profile-query.ts hooks/profile-refresh.ts hooks/use-profile.ts lib/admin-api-client.ts lib/admin-auth-response.ts lib/admin-proxy.ts lib/admin-response-handler.ts lib/admin-session.ts lib/query-client.ts services/profile.service.ts services/user.service.ts services/admin-blog.service.ts services/admin-blog-category.service.ts services/admin-product.service.ts services/admin-product-category.service.ts stores/auth.store.ts types/user.ts`. Expected: exit 0. Separately run `npm run lint` and record the existing repository-wide baseline (currently 110 findings/78 errors, including `.agents` skill files) without fixing unrelated debt.
- [ ] **Step 4: Run typecheck.** Run `npx tsc --noEmit`. Expected: exit 0 with no TypeScript errors.
- [ ] **Step 5: Run production build.** Run `npm run build`. Expected: exit 0; route output includes `/admin/[...not-found]` and `/api/users/profile`.
- [ ] **Step 6: Validate patch hygiene.** Before implementation save `git status --short` as the baseline containing the design/plan paths. At completion run `git diff --check` (expected exit 0), `git status --short`, and `git diff --name-only`; every additional path must be listed in Tasks 1-9.

### Task 11: Verify user-visible behavior

- [ ] **Step 1: Login auto-redirect.** With a valid admin cookie, open `/auth/login`; expect one fresh profile request, store/header data populated, then route replacement to `/admin/dashboard`.
- [ ] **Step 2: Expired local session.** Run the app, clear the auth cookie in browser storage, and open `/admin/settings`; expect the profile BFF to return `401`, cleanup to run, and `/auth/login` to remain visible. Payload-only `403` cleanup is verified by `lib/admin-response-handler.test.mjs` rather than a temporary production hook.
- [ ] **Step 3: Public isolation.** Verify `lib/admin-api-client-contract.test.mjs` passes and inspect a public product/blog/contact page normally; the executable contract proves these services have no admin interceptor. Do not add temporary public-error behavior.
- [ ] **Step 4: Profile update/refetch.** Change one profile field and submit; expect PATCH containing only that dirty allowlisted field, a subsequent GET profile, updated cache/store/header, and success notification.
- [ ] **Step 5: Password update.** Submit matching passwords without current password; expect PATCH `{ password }`, subsequent GET profile, and cleared password inputs. The failed-refresh outcome is verified by `settings-submit.test.mjs`; no temporary backend mutation is introduced.
- [ ] **Step 6: Admin 404.** Repeat the authenticated/unauthenticated checks from Task 8 and confirm the public marketing 404 never replaces an active admin shell.

### Task 12: Focused code review

- [ ] **Step 1: Capture review scope.** Run `git diff --name-only` and `git diff --stat`; include the four user requirements and design spec path in the review prompt.
- [ ] **Step 2: Request review.** Ask a reviewer to inspect authorization isolation, cache/cookie cleanup, role handling, hook/store synchronization, partial-success mutation behavior, route conventions, form validation, accessibility, and missing tests.
- [ ] **Step 3: Resolve findings.** Fix every Critical and Important finding, re-run the exact relevant focused tests, then repeat Tasks 10 and 11 before handoff.
