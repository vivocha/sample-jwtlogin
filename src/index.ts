#!/usr/bin/env node

import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import * as program from 'commander';

const packageJSON = require('../package.json');

function requiredArgument(arg) {
  console.error(`\n ${arg} argument is required`);
  program.help();
  process.exit(1);
}

program
  .version(packageJSON.version)
  .option('-t, --token <token>', 'Vivocha secret token')
  .option('-p, --port [port]', 'port (default: 8080)')
  .option('-d, --duration [duration]', 'JWT token duration in seconds (default: 3600 seconds, 1 hour)')
  .parse(process.argv);

if (!program.token) requiredArgument('token');

const localport = program.port || 8080;
const app = express();
const http = require('http').Server(app);

app.use(express.static('public', {index:false,extensions:['html']}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.post('/login', function (req: express.Request, res: express.Response, next: express.NextFunction) {
  // TODO check credentials in your DB
  if (req.body.vvcpass !== 'password') {
    res.status(401).send({ result: false, error: 401, message: 'unauthorized', info: 'Provided credentials are not valid. Please check authentication data' });
  } else {
    // TODO get corresponding vivocha uid fot the user
    const vivochaUID = req.body.vvcuser;   
    // creating the Vivocha token
    const vivochaJWT = jwt.sign(
      {
        "uid": vivochaUID,
        "exp": Math.round(Date.now() / 1000) + (parseInt(program.duration) || 3600) // 1 hour
      },
      program.token
    );
    // send response with Vivocha JWT
    res.send({
      result: true,
      jwt: vivochaJWT
    });
  }
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err) {
    if (err.code === 'EBADCSRFTOKEN') {
      console.error(err.message, err.code);
      res.status(403).send('CSRF Validation Failed');
    } else if (err.status === 401) {
      console.error(err.message, err.code);
      res.status(401).send({ error: 401, message: 'unauthorized', info: 'Provided credentials are not valid. Please check authentication data' });
    } else {
      console.error(err, err.stack);
      res.status(err.status || 500).send();
    }
  } else {
    next();
  }
});

http.listen(localport, function () {
  console.log(`listening on http *:${localport}`);
});