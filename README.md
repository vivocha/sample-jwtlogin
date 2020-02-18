# Vivocha Login samples using JWT

This project contains some examples of usage of the Vivocha Login API using JWT Tokens.

1. **Login with JWT.** This sample app shows how to login to Vivocha using a Single-Sign-On mechanism. The page present a simple form with login and password and login on the local system. The local server verifies the user and sign a new JWT using the Vivocha secret given for the Vivocha Account.
2. **Login with JWT using POST.** Same as above but using a POST request to pass the access_token to the Vivocha login service.
3. **Dynamic provisioning on login.** This sample app extends the first one, adding the possibility to provide a new user in Vivocha or update it if already present in the Vivocha Database.
4. **Web-Components login.** This sample shows how to retrieve a token from a local web service and login an agent using the [Vivocha web-components](https://components.vivocha.com/docs/latest/).

The server side application runs on [Node.js](https://nodejs.org/) and uses the library [`jsonwebtoken`](https://www.npmjs.com/package/jsonwebtoken).

Please remeber that the token signature **MUST** be done on server side in order to not compromise the secret used for the signature.

## Table of Contents
- [Principles](#principles)
  - [JWT JSON Web Token](#principles-jwt)
    - [Header](#principles-jwt-header)
    - [Payload](#principles-jwt-payload)
    - [Signature](#principles-jwt-signature)
  - [Vivocha API](#principles-api)
    - [JSON Web Token Payload](#JWTPayload)
    - [VivochaUser](#VivochaUser)
    - [VivochaUserRole](#VivochaUserRole)
    - [VivochaUserMedia](#VivochaUserMedia)
- [Installation](#installation)
- [Usage](#usage)
  - [Usage Details](#usage-detail)

## [Principles](#principles)

### [JWT JSON Web Token](#principles-jwt)

As claimed in the official website [jwt.io](https://jwt.io/introduction/): "JSON Web Token (JWT) is an open standard ([RFC 7519](https://tools.ietf.org/html/rfc7519)) that defines a compact and self-contained way for securely transmitting information between parties as a JSON object. This information can be verified and trusted because it is digitally signed. JWTs can be signed using a secret (with **HMAC** algorithm) or a public/private key pair using **RSA** or **ECDSA**."

The JWT token is composed essentially by 3 parts:
- Header
- Payload
- Signature

These three parts are base64 encoded and separated by dots (`.`) like the following:
```
aaaaa.bbbbb.ccccc
```

#### [Header](#principles-jwt-header)

The header contains the info about the type of the token and the signing algorithm used.
```
{
  "alg":"HS256",
  "typ":"JWT"
}
```

#### [Payload](#principles-jwt-payload)

The payload contains the claims. Claim in Vivocha JWT are related to the user for which is needed the authentication.
Vivocha uses the properties described [here](#JWTPayload) for the authentication and [here](#JWTPayloadLogin) for the user provisioning.
```
{
  "uid": "acme",
  "exp": 1579194165
}
```

#### [Signature](#principles-jwt-signature)

To sign the token you have to use the HMAC SHA256 algorithm in the following way:

```
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret)
```

The signature ensures that nobody modified the message since it was generated and verifies that the sender is who it says it is.

### [Vivocha API](#principles-api)

The Vivocha API accepts JWT for the authentication of the API access.
Vivocha JWT tokens must be signed using the HMAC algorithm with the secret token provided to the Vviocha Account Owner to compute API signatures (see more [here](https://docs.vivocha.com/docs/security-config#section-encryption)).

JWT is accepted in the Authorization header using the Bearer schema

```
Authorization: Bearer <token>
```

Or passing an `access_token` parameter to GET/POST requests
E.g. the login API
```
https://www.vivocha.com/a/acme/login?access_token=my.jwt.token
```

#### [JSON Web Token Payload](#JWTPayload)

| PROPERTY  | VALUE                                                         | DESCRIPTION 
|-----------|---------------------------------------------------------------|-------------
| uid       | string                                                        | Vivocha user id
| exp       | number                                                        | Token expiration in seconds

### [Dynamic User Provisioning](#provisioning)

Login API allows also to create and/or update dynamically an user while loggin in Vivocha.
It consist on adding an additional `user` property that contains the user data that you want to create or update in the Vivocha user Database.
It's also possible to avoid the overwrite of an existing user in the Vivocha database using the `keep` flag.

#### [JSON Web Token Payload for login](#JWTPayloadLogin)

| PROPERTY  | VALUE                                                         | DESCRIPTION 
|-----------|---------------------------------------------------------------|-------------
| uid       | string                                                        | Vivocha user id
| exp       | number                                                        | Token expiration in seconds
| user      | (optional) object, see **[VivochaUser](#VivochaUser)** below  | Vivocha user data 
| keep      | (optional) boolean                                            | Keep Vivocha data if user already exists

#### [VivochaUser](#VivochaUser)

| PROPERTY  | VALUE                                                         | DESCRIPTION 
|-----------|---------------------------------------------------------------|-------------
| role      | string, see **[VivochaUserRole](#VivochaUserRole)** below     | User Role
| media     | object, see **[VivochaUserMedia](#VivochaUserMedia)** below   | User Media
| firstname | (optional) string                                             | User firstname
| surname   | (optional) string                                             | User lastname
| nickname  | (optional) string                                             | User nickname
| email     | (optional) string                                             | User email
| tags      | (optional) string[]. E.g. `["tag1", "tag2", "tag3"]`          | User tags for routing
| lang      | (optional) string. E.g., `en`, `it`, ...                      | User language

#### [VivochaUserRole](#VivochaUserRole)

`VivochaUserRole` possible values:
- admin
- supervisor
- agent
- auditor

#### [VivochaUserMedia](#VivochaUserMedia)

| PROPERTY  | VALUE                                                                               | DESCRIPTION 
|-----------|-------------------------------------------------------------------------------------|-------------
| chat      | (optional) number between between `-1` and `20` (`-1`: no limit, `0`: disabled)     | Concurrent chats
| voice     | (optional) number between between between `0` and `1` (`0`: disabled, `1`: enabled) | Voice enabled
| video     | (optional) number between between between `0` and `1` (`0`: disabled, `1`: enabled) | Video enabled

## [Installation](#installation)

```
git clone https://github.com/vivocha/sample-jwtlogin.git
cd sample-jwtlogin
npm i
```

## [Usage](#usage)
To start the server application just run `vvc-sample-jwt` with your Vivocha Account ID and the provided secret key.
```
./vvc-sample-jwt -a <account id> -t <token> [-p <port>] [-d <duration>]
```
Once started you can open the [index page (`http://localhost:8080`)](http://localhost:8080) in your browser from which you can choose the sample you want to test.

### [Details](#usage-detail)
For a list of all available options run `vvc-sample-jwt --help`:
```
$ ./vvc-sample-jwt --help
Usage: vvc-sample-jwt [options]

Options:
  -V, --version              output the version number
  -a, --account <account>    Vivocha account
  -t, --token <token>        Vivocha secret token
  -s, --server [server]      Vivocha routing server (default: www.vivocha.com)
  -p, --port [port]          port (default: 8080)
  -d, --duration [duration]  JWT token duration in seconds (default: 3600 seconds, 1 hour)
  -h, --help                 output usage information
```
