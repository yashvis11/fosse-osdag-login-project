# Multi-Backend Web Application (Custom JWT vs. Appwrite BaaS)

## 1. Setup Instructions

### Custom Backend Setup
1. Navigate to the `custom_backend` directory:
   ```bash
   cd custom_backend

2. Create a .env file using .env.example as a reference and enter your configuration values.

3. Install dependencies and start the server:
    ```bash
   npm install
   npm start

### Appwrite Backend Setup

1. Launch index.html using a local server (e.g., VS Code Live Server).

2. Select Appwrite as the backend mode in the UI.

3. Enter your Appwrite project credentials directly into the GUI form:

    * Endpoint

    * Project ID

    * Database ID

    * Files Collection ID

    * Storage Bucket ID

### 2. Architectural Trade-offs: Stateless JWT vs. Stateful Sessions

1. **Stateless Benefit**: Unlike session cookies, which require a centralized session database, JWTs do not need to be stored on the server. The backend implementation validates the JWT's integrity instead of making a lookup on every request which decreases server response time. 

2. **CORS Compatibility**: Since the frontend can run on a different port and can switch backends, passing JWTs in the Authorization: Bearer <token> header avoids common browser cookie issues when making requests across different domains or ports.

3. **JWT Structure**: The JWT contains the payload within the token itself removing the need to perform a session table query. While session cookies are preferred for their ease in server-side revocation, JWTs were chosen due to their low server overhead, stateless architecture and dynamic header insertion. On the contrary Appwrite's implementation handles cookie synchronization allowing both the techniques to be used.

### 3. Logout Mechanics

1. Appwrite Backend (BaaS)

    * After the logout button is clicked, The logout function asks Appwrite to delete the current session. Appwrite removes the session on the server, and the client no longer has an active session.

    * Appwrite searches for that sessionID in the sessionDB and deletes that record. Upon receiving the successful response from the server the frontend deletes the session from the localStorage.


2. Custom Backend (JWT)

    * Unlike the Appwrite implementation logging out using JWT is simpler. Upon receiving the logout request the client executes the command to remove the token from the frontend.

### 4. User Data Isolation & Security

1. Appwrite Backend

    * Appwrite handles the user isolation as a built in feature. The files table containing all the files has row security enabled, this allows only the user who has been given explicit permission to access that file.
In the current implementation only Read permission is given. 

    * The storage bucket also has permissions enabled. In the current implementation, the bucket has Read permission for all users, while file-level security is enabled to control access to individual files.

    * When the request to get all the files, getting files by id or downloading files is sent the current user info is extracted to ensure only logged in users can perform those functions

2. Custom Backend

    * The authentication middleware contains a verifyToken method which takes the incoming request. If the request does not contain Authorization in the header a message indicating that user is not logged in is sent.

    * The user's ID contained in the verified JWT can then be used by protected routes to identify which resources belong to that user. This ensures that a user that is not logged in cannot access another user's files or information. 

    * When a user is logged in the token is extracted from the header and the jwt is verified using the SECRET_KEY 
if the token is invalid then a 401 Unauthorized is sent as response if no tampering is done the next function is executed and the request moves forward.

### 5. Appwrite vs. Self Configured

1. Appwrite Configured

    * **Authentication and password hashing:** Appwrite conducts password hashing without needing custom bcrypt hashing code. Authentication is handled by Appwrite as well using the email and password option

    * **Session creation and verification:** Appwrite handles creating the login session for users and verifying only the logged in user gets to move ahead with the other functions.

    * **Row-level security:** The row level security making sure the correct user accesses the correct file. The Read permission is given explicitly only to the users owning that particular file. The same level of security is applied to the storage bucket with an additional Read permission for the entire bucket to all the users.

2. Self-configured

    * **Database & Collection Schema:** Created the database, structured the files table and explicitly defined the columns and its data types(e.g. ownerId, fileName, uploadedAt)

    * **Storage Bucket Setup:** Created the storage bucket containing the user's files. Configured bucket level permissions setting to be All Users -> Read

    * **Global window functions:** Configured module-to-window functions like window.doLogin = doLogin in JS so HTML onclick handlers inside index.html could call the functions smoothly

### 6. Future Enhancements

* Given more time I would implement the self hosted option in Appwrite running it on Docker. As this would allow me to have more control over the backend, databases, networking and other server resources.

* Another feature I would like to implement is the hybrid verification approach which involves both JWT and session approach to enhance the security of the backend.







