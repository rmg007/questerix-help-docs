<!-- Last updated: 2026-02-27 -->

# SSO configuration

Problem

- You need to let your school sign in with a single sign-on (SSO) provider, but you don’t know where to set it up.

Solution

1. Go to the Settings menu in the admin panel.
2. Open the **Single sign-on** (SSO) section.
3. Click **Add provider** and enter the details from your identity provider (IdP):
   - Provider name
   - Entity ID / Issuer
   - SSO URL
   - Public certificate or metadata URL
4. Save the provider and test the connection.

![SSO settings panel showing Add provider button and provider list](/screenshots/admin-sso-configuration.png)

Verification

- After saving, click **Test** next to the provider. You should see a success message.
- Try signing in with an SSO account in a private browser window.
- If the test fails, check the certificate and issuer values and try again.

If you still need help, contact your system administrator or Questerix support with the provider metadata and a screenshot of any error messages.
