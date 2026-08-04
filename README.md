# ISE Check-in

Performance-focused revision of the original ISE employee attendance app.

## Improvements

- React and JSX are bundled and minified during deployment; Babel no longer runs in each user's browser.
- Tailwind CSS is generated and minified during deployment; the Tailwind CDN compiler is removed from production.
- The app renders immediately while attendance information refreshes in the background.
- GPS is requested only when the employee initiates an attendance action.
- Leave types load only when the Leave tab is opened and are cached for 12 hours.
- Room availability remains lazy-loaded when the Rooms tab is opened.
- New browsers are verified by a one-time email code instead of requiring admin approval.
- Each account can retain up to three recently used trusted browsers.
- Read-only API calls retry once on transient network/timeout failures.
- Backend errors include a request reference that can be matched in `SystemErrorLogs`.
- The login screen displays the deployed client version.

## Local build

```bash
npm install
npm run build
```

The deployable site is generated in `dist/`.

## Deployment

`index.source.html` is the editable application source. `npm run build` generates the production site in `dist/`.

For this repository's GitHub Pages setup, publish these generated files to the repository root:

- `dist/index.html` → `index.html`
- `dist/assets/app.js` → `assets/app.js`
- `dist/assets/app.css` → `assets/app.css`

The checked-in root files are already production-built, so GitHub Pages can serve them directly from `main` without running Babel or Tailwind in users' browsers.

## Backend

This revision uses the configured Google Apps Script `/exec` endpoint. The Spreadsheet IDs remain controlled by Apps Script, not by this frontend repository.

The Apps Script backend must include the trusted-browser revision and be redeployed as a new version of the existing web-app deployment. Keep backend configuration outside this public repository.

Backend version 2.1 keeps every existing Spreadsheet ID and creates only two supporting tabs in the user spreadsheet:

- `TrustedDeviceRequests`
- `SystemErrorLogs`

Deploy it through **Deploy → Manage deployments → Edit → New version** to preserve the existing `/exec` URL. The backend remains compatible with the legacy frontend; OTP verification is enabled only for clients that send `client_version: "2.x"`.
