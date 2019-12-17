const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const authRouter = require('../auth/auth-router.js');
const usersRouter = require('../users/users-router.js');
const knex = require('../database/dbConfig')

const server = express();

const sessionConfiguration = {
  //session storage options
  name: 'chocolatechip', //default session id name
  secret: 'keep it secret, keep it safe', //used for encryption
  saveUninitialized: true, // has implications with GDPR laws
  resave: false,

  store: new KnexSessionStore({ //do not forget the new keyword
    knex,
    createtable: true,
      
    clearInterval: 1000 * 60 * 10,
    sidfieldname: 'sid',
    tablename: 'sessions',  //imported from dbConfig

    }),
  //cookie options
  
  
  
  cookie:{
    maxAge: 1000 * 60 * 10, // 10 mins in milliseconds
    secure: false, //if false the cookie is sent over http, if true only sent over https
    httpOnly: true, //if true JS cannot access the cookie
  },
};

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(sessions(sessionConfiguration))

server.use('/api/auth', authRouter);
server.use('/api/users', usersRouter);

server.get('/', (req, res) => {
  res.json({ api: 'up' });
});

module.exports = server;
