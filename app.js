var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
require('dotenv').config()

var app = express();

// var mustacheExpress = require("mustache-express");
// var engine = mustacheExpress();
// app.engine("mustache", engine);

// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'mustache');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var indexRouter = require('./routes/usuarios');
var install = require('./control/InstallAPI');
var apiADM = require('./routes/adm');
var apiUsuarios = require('./routes/usuarios');
var apiAulas = require('./routes/aulas');
var apiAlunos = require('./routes/alunos');
var apiInstrutor = require('./routes/instrutores')

app.use('/', indexRouter);
app.use('/install', install);
app.use('/api/adm', apiADM);
app.use('/api/usuario', apiUsuarios);
app.use('/api/aulas', apiAulas);
app.use('/api/alunos', apiAlunos);
app.use('/api/instrutores', apiInstrutor);

module.exports = app;
