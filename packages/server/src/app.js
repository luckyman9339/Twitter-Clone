import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import session from 'express-session';
import connectSessionKnex from 'connect-session-knex';

import knex from './db/knex';
import { findUserById } from './db/actions/user';
import auth from './auth';
import schema from './graphql';

const start = (options = {}) => {
  return new Promise((resolve, reject) => {
    // if (!options.port) {
    //   reject(new Error('The server must specify a port!'));
    // }

    //--------------------
    // Server startup

    const app = express();
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

    //--------------------
    // Sessions

    const KnexSessionStore = connectSessionKnex(session);
    const store = new KnexSessionStore({ knex });
    app.use(
      session({
        cookie: {
          // httpOnly: true,
          // secure: true,
        },
        secret: 'test',
        resave: false,
        saveUninitialized: false,
        store,
      })
    );

    //--------------------
    // Auth

    app.use(auth());

    //--------------------
    // GraphQL

    const apolloServer = new ApolloServer({
      schema,
      context: async ({ req: { session } }) => ({
        // Extract userId from request and find it from DB
        user: session.userId && (await findUserById(session.userId)),
      }),
      playground: !!__DEV__,
      debug: !!__DEV__,
    });
    apolloServer.applyMiddleware({ app, cors: false });

    //--------------------
    // Turn on

    app.get('/', (req, res) => {
      res.end('hi');
    });

    resolve(app);
  });
};

export default { start };
