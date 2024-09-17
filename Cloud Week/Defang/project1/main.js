const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('<html><body><h1>Hello World</h1></body></html>');
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
