# Test Cases: User Sign Up (Registration)

This document defines the test cases for the User Registration (Sign Up) flow in the IVY project.

---

## TC-SUP-001: Successful Sign Up with $0 Plan and Profile Completion

- **Test Case ID:** TC-SUP-001
- **Category:** Functional (Happy Path)
- **Title / Goal:** Verify successful user registration using a new email address with the $0 plan, email verification, and profile completion.
- **Pre-conditions:**
  - The email address used uses a Gmail subaddress format (`ivyqa26+<random>@gmail.com`) to ensure it does not exist in the IVY system.
  - The user has access to the main `ivyqa26@gmail.com` Gmail inbox to retrieve the magic link.
- **Test Steps:**
  1. Open the browser and navigate to the login page: `https://staging.saas.ivy.com/auth/login`.
  2. Click the **"Create an account"** link to go to the plan selection page.
  3. Under the **"Rising Leaders" ($0)** plan card, click the **"SELECT"** button.
  4. In the **"Email Address"** field, enter a new subaddressed email: `ivyqa26+<random_number>@gmail.com`.
  5. Click the **"CONTINUE"** button.
  6. Open the email inbox of `ivyqa26@gmail.com`, find the latest verification email from IVY with the subject *"Welcome to IVY!"*, and click the **"VERIFY YOUR EMAIL"** button (Magic Link).
  7. In the **"Complete Account"** popup modal:
     - Enter First Name (e.g., *"Nami"*).
     - Enter Last Name (e.g., *"Nguyen"*).
     - Enter Password in the **"Set Password*"** field.
     - Click the **"CONTINUE"** button.
  8. Once redirected to the home dashboard `/insights`, click on the user's avatar icon in the header, and click the **"SETTINGS"** button.
  9. Verify that the account settings page displays the correct First Name (*"Nami"*), Last Name (*"Nguyen"*), and the registered subaddressed email address.
- **Expected Results:**
  - After Step 3: Redirects to the Create Account screen.
  - After Step 5: The page displays a success message indicating the verification email has been sent.
  - After Step 7: The registration modal submits successfully and redirects to `/insights`.
  - After Step 8: Navigates to the user's account settings page.
  - After Step 9: The settings page displays the correct registration details (*"Nami Nguyen"* and the unique email).
- **Actual Results:** (Leave blank for manual execution)
- **Status:** `[ ]` (Not run / Pass / Fail)

---

## TC-SUP-002: Sign Up Failure - Email Already Registered

- **Test Case ID:** TC-SUP-002
- **Category:** Error Handling
- **Title / Goal:** Verify that the correct error message is displayed when attempting to register with an already registered email.
- **Pre-conditions:**
  - The email address entered is already registered in the IVY system (e.g., `ivyqa26@gmail.com`).
- **Test Steps:**
  1. Open the browser and navigate to the login page: `https://staging.saas.ivy.com/auth/login`.
  2. Click the **"Create an account"** link.
  3. Under the **"Rising Leaders" ($0)** plan, click **"SELECT"**.
  4. Enter the already registered email address in the **"Email Address"** field.
  5. Click the **"CONTINUE"** button.
- **Expected Results:**
  - The system does not send any verification email.
  - An error message is displayed on the screen: **"You already have an account with this email address. Please login instead."**.
- **Actual Results:** (Leave blank for manual execution)
- **Status:** `[ ]` (Not run / Pass / Fail)

---

## TC-SUP-003: Sign Up Validation - Empty Email & Invalid Email Formats

- **Test Case ID:** TC-SUP-003
- **Category:** Error Handling / UI Validation
- **Title / Goal:** Verify that validation errors are displayed for empty or invalid email formats, and the CONTINUE button is disabled.
- **Pre-conditions:** None.
- **Test Steps:**
  1. Open the browser and navigate to the login page: `https://staging.saas.ivy.com/auth/login`.
  2. Click the **"Create an account"** link.
  3. Under the **"Rising Leaders" ($0)** plan, click **"SELECT"**.
  4. Focus the **"Email Address"** input field, leave it empty, and blur/click outside.
  5. Enter an invalid email format (e.g., `invalidemail`, `invalid@`, `invalid@domain`).
- **Expected Results:**
  - After Step 4: The message **"Email is required"** (or similar validator message) may appear, and the **"CONTINUE"** button is disabled.
  - After Step 5: The validation message **"Email is invalid."** is displayed underneath the input field, and the **"CONTINUE"** button remains disabled.
- **Actual Results:** (Leave blank for manual execution)
- **Status:** `[ ]` (Not run / Pass / Fail)

---

## TC-SUP-004: Sign Up Validation - Empty Fields in Profile Onboarding

- **Test Case ID:** TC-SUP-004
- **Category:** Error Handling / UI Validation
- **Title / Goal:** Verify that onboarding profile fields show validation/required errors when attempting to submit blank values.
- **Pre-conditions:**
  - The email address used is unregistered.
  - The user has requested a registration link and accessed the onboarding page via the magic link.
- **Test Steps:**
  1. Open the browser and navigate to the onboarding profile page via the Magic Link.
  2. Clear all default or pre-filled values in First Name, Last Name, and Password inputs.
  3. Click the **"CONTINUE"** (or submit) button.
- **Expected Results:**
  - Field validation errors appear indicating First Name, Last Name, and Password are required.
  - The form is not submitted, and the user remains on the onboarding page.
- **Actual Results:** (Leave blank for manual execution)
- **Status:** `[ ]` (Not run / Pass / Fail)


---

## TC-SUP-005: Sign Up via Header SIGN UP and Subscription Modal

- **Test Case ID:** TC-SUP-005
- **Category:** Functional (Happy Path)
- **Title / Goal:** Verify registration by clicking the header **SIGN UP** button, entering email in the subscription modal, and completing onboarding.
- **Pre-conditions:**
  - The email address used uses a Gmail subaddress format (`ivyqa26+<random>@gmail.com`) to ensure it does not exist in the IVY system.
  - The user has access to the main `ivyqa26@gmail.com` Gmail inbox to retrieve the magic link.
- **Test Steps:**
  1. Open the browser and navigate to the login page: `https://staging.saas.ivy.com/auth/login`.
  2. Click the green **"SIGN UP"** button in the top-right header.
  3. Wait for the subscription popup modal ("Supercharge Your Performance") to appear.
  4. In the email input inside the modal, enter the unique subaddressed email address.
  5. Click the **"START YOUR FREE MONTH TODAY"** button.
  6. Open the email inbox of `ivyqa26@gmail.com`, find the verification email from IVY, and click the **"VERIFY YOUR EMAIL"** button (Magic Link).
  7. Fill in First Name, Last Name, and a strong password on the onboarding page, then click **"CONTINUE"**.
  8. Verify redirect to `/insights` dashboard, click the avatar -> **SETTINGS**, and check that the user details match the registration info.
- **Expected Results:**
  - After Step 2 & 3: The page redirects or opens the subscription modal containing the email field.
  - After Step 5: The browser displays the "Check Your Inbox" screen.
  - After Step 6: Redirects to the complete profile page.
  - After Step 7 & 8: Successfully signs in, redirects to the dashboard, and displays the correct user profile settings.
- **Actual Results:** (Leave blank for manual execution)
- **Status:** `[ ]` (Not run / Pass / Fail)

