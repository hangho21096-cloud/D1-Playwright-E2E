# Test Cases: Magic Link Login (Magic Login)

This document defines the test cases for the Magic Link login flow in the IVY project.

---

## TC-LOG-001: Successful Login with Magic Link (Existing Account)

- **Test Case ID:** TC-LOG-001
- **Category:** Functional (Happy Path)
- **Title / Goal:** Verify successful login to the application using an existing registered email.
- **Pre-conditions:** 
  - The email account (e.g., `ivyqa26@gmail.com`) is registered and exists in the IVY system.
  - The user has access to this email account's inbox.
- **Test Steps:**
  1. Open the browser and navigate to the login page: `https://staging.saas.ivy.com/auth/login`.
  2. Enter the valid registered email address in the **Email Address** field.
  3. Click the **CONTINUE** button.
  4. Open the email inbox and find the latest email sent from IVY.
  5. Click the login link (**Magic Link**) inside the email.
- **Expected Results:**
  - After Step 3: The system displays a success message indicating the email has been sent (e.g., *"We've sent a link to your email"* or similar).
  - After Step 5: The browser redirects the user to the dashboard `/insights` in a logged-in state.
- **Actual Results:** (Leave blank for manual execution)
- **Status:** `[ ]` (Not run / Pass / Fail)

---

## TC-LOG-002: Login Failure - Account Does Not Exist

- **Test Case ID:** TC-LOG-002
- **Category:** Error Handling
- **Title / Goal:** Verify that the correct error message is displayed when attempting to log in with an unregistered email.
- **Pre-conditions:**
  - The email address entered is not registered in the IVY system (e.g., `unregistered-account-test@gmail.com`).
- **Test Steps:**
  1. Open the browser and navigate to the login page: `https://staging.saas.ivy.com/auth/login`.
  2. Enter the unregistered email address in the **Email Address** field.
  3. Click the **CONTINUE** button.
- **Expected Results:**
  - The system does not send any magic link email.
  - An error message is displayed on the screen: **"Account Does Not Exist, Please Sign Up!"**.
- **Actual Results:** (Leave blank for manual execution)
- **Status:** `[ ]` (Not run / Pass / Fail)

---

## TC-LOG-003: Login Validation - Empty Email & Invalid Email Formats

- **Test Case ID:** TC-LOG-003
- **Category:** Error Handling / UI Validation
- **Title / Goal:** Verify that validation errors are displayed for empty or invalid email formats, and the CONTINUE button is disabled on the Login screen.
- **Pre-conditions:** None.
- **Test Steps:**
  1. Open the browser and navigate to the login page: `https://staging.saas.ivy.com/auth/login`.
  2. Focus the **"Email Address"** input field, leave it empty, and blur/click outside.
  3. Enter an invalid email format (e.g., `invalidemail`, `invalid@`, `invalid@domain`).
- **Expected Results:**
  - After Step 2: The validation message **"Email is required"** (or similar validator message) may appear, and the **"CONTINUE"** button is disabled.
  - After Step 3: The validation message **"Email is invalid."** is displayed underneath the input field, and the **"CONTINUE"** button remains disabled.
- **Actual Results:** (Leave blank for manual execution)
- **Status:** `[ ]` (Not run / Pass / Fail)

---

## TC-LOG-004: Login Flow - Session Persistence & Logout

- **Test Case ID:** TC-LOG-004
- **Category:** Functional (Happy Path)
- **Title / Goal:** Verify that a logged-in session persists on refresh/navigation and is successfully cleared upon logging out.
- **Pre-conditions:**
  - An email account (e.g., `ivyqa26@gmail.com`) is registered and exists in the IVY system.
- **Test Steps:**
  1. Open the browser and navigate to the login page: `https://staging.saas.ivy.com/auth/login`.
  2. Log in using a valid registered email and retrieve the Magic Link via IMAP.
  3. Navigate to the Magic Link and confirm successful redirect to the `/insights` dashboard.
  4. Reload the page (refresh) and verify that the user remains logged in (dashboard is visible).
  5. Click on the user's avatar icon in the header, then click the **"LOGOUT"** button.
  6. Verify redirection to the login page (`/auth/login`).
  7. Click the browser's **Back** button.
- **Expected Results:**
  - After Step 4: The user remains logged in without being redirected back to login.
  - After Step 5 & 6: The session is destroyed, and the user is redirected back to the login page.
  - After Step 7: The user remains on the login page (or is blocked from accessing `/insights` and redirected back to `/auth/login`), preventing session hijack via browser history.
- **Actual Results:** (Leave blank for manual execution)
- **Status:** `[ ]` (Not run / Pass / Fail)

