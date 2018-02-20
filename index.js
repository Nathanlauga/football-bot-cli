#!/usr/bin/env node
const { ask } = require('./cli');
const API = require('./api.js');

const api = new API();

ask();
