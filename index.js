import "babel-core/register";
import "babel-polyfill";

import express from 'express';
import bodyParser from 'body-parser';
import next from 'next';
import stripeInit from 'stripe';
import chargeHoundInit from 'chargehound';

import chargeStripeToken from './api/charge-stripe-token';
import chargeHoundWebhook from './api/chargehound-webhook';

const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 8888;
const app = next({ dir: '.', dev });
const handle = app.getRequestHandler()

const stripe = stripeInit(process.env.STRIPE_SECRET_KEY);
const chargeHound = chargeHoundInit(process.env.CHARGEHOUND_KEY, {
  host: 'test-api.chargehound.com'
});

// The "database"
const songsDatabase = [
  {
    id: '1',
    song_artist: 'Hound of Love',
    song_name: 'Rivers Edge',
    amount: 200,
  },

  {
    id: '2',
    song_artist: 'Sheer Mag',
    song_name: 'Expect The Bayonet',
    amount: 500,
  },

  {
    id: '3',
    song_artist: 'Cloud Nothings',
    song_name: "Can't Stay Awake",
    amount: 300,
  },

  {
    id: '4',
    song_artist: 'Tax Payers',
    song_name: 'Everything Is Awful',
    amount: 100,
  }
]

app.prepare().then(() => {
  const server = express();

  //Add 3rd party apis to server scope to be used in api methods
  server.set('stripe', stripe);
  server.set('chargeHound', chargeHound);

  //By default, Express will not return request bodies without a middlware
  server.use(bodyParser.json());

  //Bind api methods
  server.post('/api/chargehound-webhook', chargeHoundWebhook);
  server.post('/api/charge-stripe-token', chargeStripeToken);

  // rake a REST resource GET
  server.get('/api/songs', (req, res) => {
    return res.send(JSON.stringify(songsDatabase));
  });

  // All get requets get passed to next.js
  // and served from the /pages directory
  server.get('*', (req, res) => {
    return handle(req, res)
  })

  //Start the express server
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`app listening on port ${port}!`)
  })
})
