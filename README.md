# Test Automation Framework - Playwright Example
Automation tests in Playwright - example for the 4F website.

# Main idea
This repository shows a realistic problem that can appear when testing a production e-commerce website: the live 4F website may behave differently in headless Chromium than in a regular headed browser. In this sample, the live end-to-end scenario can fail in headless mode during navigation with an HTTP/2-level error before the test reaches the UI.

The important detail is that Playwright does not run headed and headless Chromium in exactly the same way. In this setup, headed Chromium behaves like a regular browser window, while headless execution may use a different browser binary and a different automation fingerprint. That can change how the browser is seen by a live website, CDN, or bot-protection layer. The result can be a network-level failure, such as `ERR_HTTP2_PROTOCOL_ERROR`, before any selector or assertion is involved.

This is similar to the Playwright issue [microsoft/playwright#31240](https://github.com/microsoft/playwright/issues/31240), where Chromium headless failed during navigation while other browser engines worked.

The project demonstrates practical techniques for handling that kind of situation:
1. Run the live end-to-end smoke test in headed Chromium.
2. Use `xvfb-run` in GitHub Actions, so headed Chromium can run on a Linux CI runner without a physical display.
3. Keep a separate mocked-backend scenario to show how the same business area can be tested with deterministic cart data.
4. Check another browser engine or browser channel before deciding on the final CI strategy.

During local validation, the live scenario passed in WebKit headless and in Google Chrome channel headless. WebKit can therefore be a valid diagnostic or fallback option when browser coverage allows it. This repository intentionally keeps headed Chromium with `xvfb-run` as the CI example to show how to handle a case where the target browser must run in headed mode on a Linux runner.

# Next steps
One possible follow-up investigation is comparing request headers sent by headed and headless Chromium. Some production websites use a CDN or WAF that can react differently to automated headless traffic. In a real project, if the team owns the tested environment or has approval from the site owner, it may be worth checking whether aligning selected headers with headed Chromium makes headless execution stable.

This should be treated as diagnostics, not as a way to bypass protection on a third-party website. The preferred long-term solution is to test against a trusted environment where bot protection can be disabled or explicitly configured for automation.

# Other topics this project shows
1. Page Object Model with reusable page and component classes.
2. Playwright fixtures and a flow object for guest-shop setup.
3. A real end-to-end basket scenario against the live 4F website.
4. A mocked storefront and GraphQL cart scenario with a preloaded basket state.
5. TypeScript path aliases and strict type checking.
6. CI setup for headed Chromium on Linux with `xvfb-run`.
7. Browser-mode troubleshooting for headless vs headed execution.

# Available examples
1. `tests/basket.spec.ts` - real end-to-end flow against the live 4F backend.
2. `tests/basket.mocked.spec.ts` - cart-page flow with the storefront page and GraphQL cart responses mocked in the test.

# Installation
`npm install`

# Quality checks
`npm run typecheck`

# Full local check
`npm run check`

# Running tests
`npm run test`

The default test command runs all examples in headed Chromium.

# CI test strategy
`npm run test:ci`

GitHub Actions runs this command through `xvfb-run`:

`xvfb-run -a npm run test:ci`

This is useful when a real browser must run in headed mode, but the CI runner does not provide a graphical display. `xvfb-run` creates a virtual display for Chromium. The browser is still headed from Playwright's perspective, but it renders into the virtual display instead of a physical monitor.

# Live end-to-end smoke test
`npm run test:e2e`

This command runs the real basket flow against the live 4F backend in headed Chromium. It is useful for verifying the complete user journey against the production-like website.

# Mocked backend scenario
`npm run test:mocked`

This command runs the deterministic mocked storefront and cart scenario in headless Chromium. It shows how to test the basket area with controlled backend responses.

# Headless run for all tests
`npm run test:headless`

This command runs all examples in headless Chromium. It is kept intentionally because it makes the headless-vs-headed difference visible. Depending on the live 4F website behavior, the real end-to-end scenario may fail in headless mode even when it passes in headed mode.

# Debugging tests
`npm run test:debug`

# Showing Report
`npm run report`

# License
This project is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0) - see the [LICENSE](LICENSE) file for details.
