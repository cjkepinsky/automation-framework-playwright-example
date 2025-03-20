# Test Automation Framework - Playwright Example
 Automation tests in Playwright - example for 4F website

# Task on hand
1. Log-in with correct credentials and verify whether the login was successful
2. Add any product to the cart and verify its appearance in the mini cart  
3. Add any product to the cart, proceed to the cart, verify the current total amount to be paid > adding one more item in the cart itself (or apply a discount code if available) > verify whether the amount has changed
4. Generate any report after testing.

# Installation
`npm install`

# Configuration
1. Copy `.env.example` to `.env`
2. Fill in your credentials in `.env` file:
   ```
   FOURF_USER_EMAIL=your.email@example.com
   FOURF_USER_PASSWORD=your_password
   ```

# Running tests
`npx playwright test --project=firefox`
