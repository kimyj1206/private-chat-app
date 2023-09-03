const express = require('express');
const app = express();
const port = 3000;
const path = require('path');

// static file path configuration
const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));

// client send body parsing configuration
app.use(express.json());

// port configuration
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});