# Vivocha Login samples using JWT

This project contains some examples of usage of the Vivocha Login API using JWT Tokens.

1. **Login with JWT.** This sample app shows how to login to Vivocha using a Single-Sign-On mechanism. The page present a simple form with login and password and login on the local system. The local server verifies the user and sign a new JWT using the Vivocha secret given for the Vivocha Account.
2. **Dynamic provisioning on login.** This sample app extends the first one, adding the possibility to provide a new user in Vivocha or update it if already present in the Vivocha Database.
3. **Web-Components login.** This sample shows how to retrieve a token from a local web service and login an agent using the [Vivocha web-components](https://components.vivocha.com/docs/latest/).

## Table of Contents
- [Principles](#principles)
  - [JWT JSON Web Token](#principles-jwt)
  - [Vivocha API](#principles-api)
- [Installation](#installation)
- [Usage](#usage)
  - [Usage Details](#usage-detail)

## [Principles](#principles)

### [JWT JSON Web Token](#principles-jwt)
###### todo

### [Vivocha API](#principles-api)
###### todo

#### [JSON Web Token Payload](#JWTPayload)
| PROPERTY  | VALUE                                                         | DESCRIPTION 
|-----------|---------------------------------------------------------------|-------------
| uid       | string                                                        | Vivocha user id
| exp       | number                                                        | Token expiration in seconds
| user      | (optional) object, see **[VivochaUser](#VivochaUser)** below  | Vivocha user data 
| keep      | (optional) boolean                                            | Keep Vivocha data if user already exists

#### [VivochaUser](#VivochaUser)
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

#### [VivochaUserRole](#VivochaUserRole)
VivochaUserRole possible values:
- admin
- supervisor
- agent
- auditor

#### [VivochaUserMedia](#VivochaUserMedia)
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
