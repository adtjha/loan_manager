# Loan Management API
A sample API built for manging loan accounts, by admin, agents, and customers.

# Installation
1. Download this directory as .ZIP and unzip it.
2. Install the required packages, by the running the code written below.
```
$   npm install
```
3. Run the Tests.
```
npm run test
```
4. Start the server.
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

I have used JWT in order to create user accessTokens. Each Time a user logs in, he passes a username and password combo, which is then verified on server side. After successful verification, an `accessToken` is generated and returned to the user.
With this user can access the endpoints.

All the api endpoints are protected with a middleware `authenticate({scope: scope_related_to_endpoint})`, and whenever any user fetched the endpoint with his `accessToken`, his `accessToken` is verified using the Client Id attached to the token (which is fetched from database), 
and if the scope of client matches the scope required then access is provided else error is returned.

Any user which is added to database has a category which is his particular client category. Each time any new user is added, respective client database is updated with user's id.

