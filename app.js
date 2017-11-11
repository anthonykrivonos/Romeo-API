const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const http = require('http');

const app = express();
app.use(bodyParser.json());
app.use(morgan('common'));

// fill these in such that a new file is opened to handle them
app.post('/newchallenge')

app.post('/newrendition')
