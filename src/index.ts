#!/usr/bin/env node

import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import * as program from 'commander';
import * as querystring from 'querystring';
import * as request from 'request';

type VivochaUserRole = 'admin' | 'supervisor' | 'agent' | 'auditor';
interface VivochaUserMedia {
  chat?: number;
  voice?: number;
  video?: number;
}
interface VivochaUser {
  id: string;
  acct_id: string;
  role: VivochaUserRole;
  media: VivochaUserMedia;
  firstname?: string;
  surname?: string;
  nickname?: string;
  email?: string;
  pic?: string;
  password?: string;
  tags?: string[];
  lang?: string;
}
interface JWTPayload {
  uid: string;
  user?: VivochaUser;
  keep?: boolean;
  exp: number;
}

const packageJSON = require('../package.json');

function requiredArgument(arg) {
  console.error(`\n ${arg} argument is required`);
  program.help();
  process.exit(1);
}

function getHost(acct: string, server: string = 'www.vivocha.com'): Promise<string> {
  return new Promise((resolve, reject) => {
    request({
      url: `https://${server}/a/${acct}/api/v3/openapi.json`,
      method: 'HEAD',
      followRedirect: false
    }, function (err, res) {
      if (err) {
        reject(err);
      } else if (res.statusCode !== 302 || !res.headers.location) {
        reject(new Error('invalid account'));
      } else {
        var u = new URL(Array.isArray(res.headers.location) ? res.headers.location[0] : res.headers.location);
        resolve(u.host);
      }
    });
  });
}

program
  .version(packageJSON.version)
  .option('-a, --account <account>', 'Vivocha account')
  .option('-t, --token <token>', 'Vivocha secret token')
  .option('-s, --server [server]', 'Vivocha routing server (default: www.vivocha.com)')
  .option('-p, --port [port]', 'port (default: 8080)')
  .option('-d, --duration [duration]', 'JWT token duration in seconds (default: 3600 seconds, 1 hour)')
  .parse(process.argv);

if (!program.account) requiredArgument('account');
if (!program.token) requiredArgument('token');

(async function() {
  const localport = program.port || 8080;
  const app = express();
  const http = require('http').Server(app);
  const host = await getHost(program.account, program.server);
  app.use(express.static('public', {index: ['index.html'], extensions: ['html']}));
  app.use('/', express.static('public', {index: ['index.html'], extensions: ['html']}));
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.post('/login', (req: express.Request, res: express.Response, next: express.NextFunction) => {
    /**
     * TODO
     * This sample application simple checks for a password = 'password'.
     * You should verify you user credentials here.
     */
    if (req.body.vvcpass !== 'password') {
      res.status(401).send({
        result: false,
        error: 401,
        message: 'unauthorized',
        info: 'Provided credentials are not valid. Please check authentication data'
      });
    } else {
      /**
       * TODO
       * This sample application assumes that the user id used in your system is the same you'll use in Vivocha.
       * If not, you have to retrieve the Vivocha one from your mapping table and assign it to the following "uid" variable.
       */
      const uid = req.body.vvcuser;

      const media: VivochaUserMedia = {};
      if(req.body.chat) media.chat = parseInt(req.body.chat, 10);
      if(req.body.voice) media.voice = parseInt(req.body.voice, 10);
      if(req.body.video) media.video = parseInt(req.body.video, 10);

      const user: VivochaUser = {
        id: uid,
        acct_id: program.account,
        role: req.body.role || 'agent',
        media
      };
      if (req.body.nickname) user.nickname = req.body.nickname;
      if (req.body.firstname) user.firstname = req.body.firstname;
      if (req.body.surname) user.surname = req.body.surname;
      if (req.body.email) user.email = req.body.email;
      if (req.body.role) user.role = req.body.role;
      if (req.body.lang) user.lang = req.body.lang;
      if (req.body.tags) user.tags = req.body.tags;

      const keep = req.body.keep && req.body.keep === 'true';
      const payload: JWTPayload = {
        uid,
        exp: Math.round(Date.now() / 1000) + (parseInt(program.duration) || 3600) // 1 hour
      }
      if (user) payload.user = user;
      if (keep) payload.keep = keep;

      // creating the Vivocha token
      const vivochaJWT = jwt.sign(payload, program.token);

      console.log('JWT Token', vivochaJWT);
      console.log('JWT Payload', payload);

      if (req.query.json || req.body.json) {
        // send response with Vivocha JWT
        res.send({
          result: true,
          account: program.account,
          jwt: vivochaJWT
        });
      } else {
        const qs = {
          access_token: vivochaJWT,
          logout: `http://localhost:${program.port || 8080}/login`
        };
        const redirect = `https://${host}/a/${program.account}/login?${querystring.stringify(qs)}`;
        console.log('login redirect', redirect);
        res.redirect(redirect);
      }
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
  
  http.listen(localport, () => {
    console.log(`listening on http *:${localport}`);
  });
})();