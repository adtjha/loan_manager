# Loan Management API
A sample API built for manging loan accounts, by admin, agents, and customers.

# Installation
1. Download this directory as .ZIP and unzip it.
2. Install the required packages, by the running the code written below.
```
$   npm install
```
3. Create [MongoDB Account](https://account.mongodb.com/account/register), and an Atlas Database. Then create a .env files containing URI, code.
```
ATLAS_URI=mongodb+srv://[username]:[password]@[database_name].zqeja.mongodb.net/test?retryWrites=true&w=majority
```
4. Run the Tests.
```
$   npm run test
```
5. Start the server.
```
$   npm start
```

# API Endpoints

### /users

- GET `/users/` - Get all the users information, with respective loan information.
> Access Token Required, Scope: Agent/Admin

- POST `/users/` - Add a new user to the Database.
> Access Token Required, Scope: Agent/Admin

- POST `/users/verify` - Used for user login purpose, and after successful login, an accessToken is generated, which should be send with every api call.
> No Access Token Required

- POST `/users/refreshToken` - Used for user generating fresh tokens.
> Access Token Required

- POST `/users/logout` - Deletes the token that is sent using this api call.
> Access Token Required, Scope: Customer/Agent/Admin

- PATCH `/users/:id/:name` - Update the name of any particular user.
> Access Token Required, Scope: Agent/Admin

- DELETE `/users/:id` - Delete the user account attached to the id.
> Access Token Required, Scope: Agent/Admin

### /loan

- GET `/loan/` - Get all the information regarding all available loan profiles.
> Access Token Required, Scope: Agent/Admin

- POST `/loan/` - Add a loan application to the database.
> Access Token Required, Scope: Agent/Admin

- POST `/loan/approve/:id` - Approve a loan application, can only be done if accessToken used is valid, that is can be done by admin only.
> Access Token Required, Scope: Admin

- GET `/loan/:id` - Get information about a particular loan id.
> Access Token Required, Scope: Customer/Agent/Admin

- DELETE `/loan/:id` - Delete a loan application related to the id.
> Access Token Required, Scope: Agent/Admin

# Authentication & User Role Management

### Generating Access Tokens

I have used JWT in order to create user accessTokens. Each Time a user logs in, he passes a username and password combo, which is then verified on server side. After successful verification, an `accessToken` is generated using the client id that user is attached to, and returned to the user. With this user can access the endpoints. 

> Any user which is added to database has a category which is his particular client category. Each time any new user is added, respective client database is updated with user's id.

All the api endpoints are protected with a middleware `authenticate({scope: scope_related_to_endpoint})`, and whenever any user fetches the endpoint with his `accessToken`, his `accessToken` is verified using the Client Id attached to the token (which is fetched from database),  and if the scope of client matches the scope required then access is provided else error is returned.

### Generating Fresh Tokens

1. User submits his expired token,
2. We fetch the respective token from the database on the server side,
3. A new user `accessToken` is generated using `clientSecret` , 
4. Send new `accessToken` to user.   

### Password Storage and Verification

> Exact Password is never stored on database.

Passwords are salted and hashed, whenever a new user is stored on database, and stored on the database with their respective salt. Each time whenever user logs in, the password is then salted with salt attached to the user, and hashed, and is then compared to the stored password.

# Database Structure

There are five collections, which are,

### Users Database Model
```
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    pass: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    secret: { type: String, required: true },
    category: { type: String, required: true },
    loans: [{ type: Schema.Types.ObjectId, ref: "loan" }],
  }
```

### Client Database Model
```
{
    category: {
      type: String,
      required: true,
    },
    grants: { type: Array, required: true },
    secret: { type: String, required: true },
    scope: { type: Array, required: true },
    user: [{ type: Schema.Types.ObjectId, ref: "User" }],
  }
```

### Loan Database Model
```
{
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    particulars: {
      amount: { type: Number, required: true },
      rate: { type: Number, required: true },
      tenure: { type: Number, required: true },
      emi: { type: Number },
      payments: [],
    },
    purpose: { type: String, required: true },
    status: { type: String, required: true },
    history: [],
  }
```

### Token Database Model
```
{
  accessToken: { type: String, required: true },
  refreshToken: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, required: true, ref: User },
  client: { type: Schema.Types.ObjectId, required: true, ref: client },
  scope: { type: Array, required: true },
}
```
