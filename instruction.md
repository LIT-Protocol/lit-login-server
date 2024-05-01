1. Create an App ID:
App IDs are used to uniquely identify your apps.

- Go to the Apple Developer portal.
- Sign in with your developer account.
- In the left-hand sidebar, navigate to "Certificates, IDs & Profiles."
- Under the "Identifiers" section, click on "App IDs."
- Click the "+" button to create a new App ID.
- Fill in the necessary details for your App, such as the Name, Bundle ID, etc.
- Ensure that you check the "Sign In with Apple" capability under the Capabilities section.
- Click "Continue" and then "Register" to create the App ID.

2. Create a Service ID:
Service IDs represent a single instance of your web service and are used for web-based authentication.

- In the Apple Developer portal, under "Certificates, IDs & Profiles", go to the "Identifiers" section.
- Click on the "Service IDs" option.
- Click the "+" button to create a new Service ID.
- Select "Service IDs" as the type and click "Continue."
- Fill in the necessary details. The identifier will typically be a reverse domain (like com.yourdomain.servicename).
- Once created, click on the Service ID you've just made in the list.
- Click on "Configure" next to the "Sign in with Apple" section.
- Here, you'll need to set up a few things:
  - Domains and Subdomains: Enter your web service's domain.
  - Return URLs: Enter the redirect URLs for authentication.
  - Email Sources: (if you want to relay user emails) Enter your domain.
- Save your changes.

3. Set up a Key for Sign in with Apple:
- Under "Certificates, IDs & Profiles", go to the "Keys" section.
- Click the "+" button to create a new key.
- Give it a name and check "Sign in with Apple."
- Click "Configure" and select your primary App ID.
- Click "Save" and then "Continue."
- Register the key and download it. This will be used to create the client secret (JWT) for server-side authentication.

After setting up these, ensure you configure your web and backend services to use the App ID, Service ID, and the downloaded key appropriately. Always refer to Apple's official documentation for the most detailed and updated steps.