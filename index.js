import express from 'express';
import parse from 'url';
import next from 'next';

const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 3000;
const app = next({ dir: '.', dev });
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express();

  // respond with "hello world" when a GET request is made to the homepage
  server.get('/api/*', function (req, res) {
    res.send('hello world api')
  })

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log(`app listening on port ${port}!`)
  })
})
