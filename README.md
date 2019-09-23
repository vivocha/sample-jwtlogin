# Sample JWT Login Application

The **Sample JWT Login Application** is a simple example of how to use a JSON Web Token signed with the Vivocha Account token to login an agent using the [Vivocha web-components](https://components.vivocha.com/docs/latest/).

### Installation

```sh
$ git clone [git-repo-url] sample-jwtlogin
$ cd sample-jwtlogin
$ npm i
```

And then replace [accountid] in the sample [app.js](./public/app.js) script with your Vivocha account id.

```html
<vvc-ad-core acct="[accountid]" version="1" jwt="' + result.jwt + '" ></vvc-ad-core>
```

### Usage:
```sh
./vvc-sample-jwt -t <token> [-p <port>] [-d <duration>]
```

### More:
For a list of all available options run `vvc-sample-jwt --help`:
```sh
$ ./vvc-sample-jwt --help
Usage: vvc-sample-jwt [options]

Options:
  -V, --version              output the version number
  -t, --token <token>        Vivocha secret token
  -p, --port [port]          port (default: 8080)
  -d, --duration [duration]  JWT token duration in seconds (default: 3600 seconds, 1 hour)
  -h, --help                 output usage information
```
