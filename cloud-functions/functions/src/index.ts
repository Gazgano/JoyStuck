const functions = require('firebase-functions');

import { App } from './app';

const app = new App().app;
export const api = functions.https.onRequest(app);