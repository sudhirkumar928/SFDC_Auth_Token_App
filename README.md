## ⚙️ Salesforce Sandbox Environment Setup


To deploy and use this utility, follow these step-by-step configuration phases inside your Salesforce Sandbox.

### Phase 1: Provision the Self-Signed Certificate
We will let Salesforce automatically generate the cryptographic public/private key pair natively so that sensitive files never sit on your local machine.

1. Log into your Salesforce Sandbox and navigate to **Setup**.
2. In the Quick Find box, type `Certificate` and select **Certificate and Key Management**.
3. Click **Create Self-Signed Certificate**.
4. Configure the parameters:
   - **Label:** `Auth_Token_App`
   - **Unique Name:** `Auth_Token_App`
5. Click **Save**.
6. On the certificate detail screen, click **Download Certificate**. This downloads the public half of the key (a `.crt` or `.cer` file) to your computer.

---

### Phase 2: Create and Pre-Authorize the External Client App
We will now create the OAuth entry point that trusts our native certificate and allows silent background user token requests.

1. In **Setup**, search for **App Manager** in the Quick Find menu and select it.
2. Click the **New Connected App** button in the upper right.
3. Complete the **Basic Information**:
   - **Connected App Name:** `Auth Token Client App`
   - **API Name:** `Auth_Token_Client_App`
   - **Contact Email:** (Your email address)
4. Scroll down and check the **Enable OAuth Settings** checkbox.
5. Apply the following OAuth specifications:
   - **Callback URL:** Type `https://localhost` *(Required placeholder)*
   - **Use Digital Signatures:** **Check this box**.
   - **Digital Signature File:** Click **Choose File** and upload the `.crt` file you downloaded in Phase 1.
   - **Selected OAuth Scopes:** Locate and add these two specific access scopes to the right column:
     1. *Manage user data via APIs (api)*
     2. *Perform requests at any time (refresh_token, offline_access)*
6. Scroll to the bottom and click **Save**, then click **Continue**.
7. **Copy the Consumer Key:** On the app management screen that loads, locate and safely copy the **Consumer Key** string. This is your dynamic `Client_Id`.
8. **Pre-Authorize User Contexts (Crucial Steps):**
   - Click the **Manage** button sitting at the top of your new app profile page.
   - Click **Edit Policies**.
   - Under **OAuth Policies**, change the **Permitted Users** dropdown properties to: **"Admin approved users are pre-authorized"**. Click **Save**.
   - Scroll to the very bottom of the page to the **Profiles** related list, click **Manage Profiles**, and check the checkboxes for the specific tester, automation, and administrator profiles that are allowed to run this utility. Click **Save**.

---

### Phase 3: Instantiate the Custom Setting Metadata Container
We isolate the configuration properties into a Custom Setting so that moving between different sandboxes or staging environments requires zero code alterations.

1. In **Setup**, search for **Custom Settings** in the Quick Find box and open it.
2. Click **New** at the top of the container table.
   - **Label:** `Auth Token Config`
   - **Object Name:** `Auth_Token_Config`
   - **Setting Type:** Hierarchy
3. Click **Save**.
4. Under the **Custom Fields** related list for your new setting, click **New** to provision the following three custom text fields:
   - **Field 1:** Create a text field named `Client_Id` (Length: `255`)
   - **Field 2:** Create a text field named `Audience_URL` (Length: `255`)
   - **Field 3:** Create a text field named `Certificate_Name` (Length: `100`)
5. Click the **Manage** button at the top of the main Custom Setting configuration landing layout page.
6. Click **New** in the top **Default Organization Level Value** framework container.
7. Fill in your environment parameters:
   - **Client_Id:** *(Paste the Consumer Key string you captured during Phase 2)*
   - **Audience_URL:** `https://your-sandbox-domain.my.salesforce.com` *(Your sandbox base instance URL)*
   - **Certificate_Name:** `Auth_Token_App` *(The exact name string of the certificate generated in Phase 1)*
8. Click **Save**.

---

### Phase 4: Component Deployment
1. Deploy the `AuthTokenController` Apex controller class into your sandbox runtime environment.
2. Deploy the `tokenGeneratorCanvas` Lightning Web Component package.
3. Open any workspace landing platform view or record layout page using the **Lightning App Builder**, drag the **Auth Token Security Playground** widget onto your dashboard canvas (or inside a console utility bar layout footer), save, and click activate.

---

## 📄 License

BSD 3-Clause License

Copyright (c) 2026, [Sudhir Kumar Panda -- sudhirkumar928]
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its
   contributors may be used to endorse or promote products derived from
   this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
