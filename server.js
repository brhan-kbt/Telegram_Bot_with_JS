const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const listener = app.listen(process.env.PORT, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
