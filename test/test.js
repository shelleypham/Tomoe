const assert = require('chai').assert; // define assert library
const request = require('supertest');
const should = require('should');


console.log("Testing installer")
require('./setup/install.js')(assert, request, should);
