# Test Automation Framework - Playwright Example
Automation tests in Playwright - example for the 4F website.

# Covered scenario
1. Open the current new-products listing as a guest user.
2. Open a product details page and add an item to the cart.
3. Open the mini cart and navigate to the cart page.
4. Change product quantity in the cart and verify that the total price increases.
5. Generate an HTML report after the run.

# Available examples
1. `tests/basket.spec.ts` - real end-to-end flow against the live 4F backend.
2. `tests/basket.mocked.spec.ts` - the add-to-basket flow with the cart GraphQL backend mocked in the test.

# Installation
`npm install`

# Configuration
No credentials are required for the current basket scenario.

# Quality checks
`npm run typecheck`

# Running tests
`npm run test`

# Showing Report
`npm run report`

# License
This project is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0) - see the [LICENSE](LICENSE) file for details.
