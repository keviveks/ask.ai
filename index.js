// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign
const express = require('express');
const mongoose = require('mongoose');
const socketio = require('socket.io');
const basicAuth = require('express-basic-auth');
const ask = require('./app/ask');
const { port, auth, db } = require('./app/config');

const app = express();

// set mongoose Promise to Bluebird
mongoose.Promise = Promise;

// mongoose connect
mongoose.connect(db.uri, db.options)
  .then(() => {
    console.log('mongodb connected');
  });

app.use(express.static(`${__dirname}/public`));

app.use(basicAuth({
  users: auth,
}));

const server = app.listen(port, () => {
  console.log('app listening to 8088');
});

const io = socketio(server);
io.on('connection', (socket) => {
  console.log('socket connected');
  socket.on('userMessage', async (text) => {
    console.log(`Message: ${text}`);
    const intent = await ask.getIntent(text);
    console.log(intent);
    socket.emit('botReply', intent);
  });
});
