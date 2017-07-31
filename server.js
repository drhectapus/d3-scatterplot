const express = require('express');
const path = require('path');
const port = process.env.PORT || 8080;
const app = express();

// app.use(express.static(__dirname));

app.use(express.static(path.resolve(path.join(__dirname, '/dist'))));

app.get('*', (req, res) => {
  res.sendFile('index.html');
});

app.listen(port);
console.log('Server started');
