import express from 'express';
import bodyParser from 'body-parser';
import next from 'next';
import stripeInit from 'stripe';
import chargeHoundInit from 'chargehound';

const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 8888;
const app = next({ dir: '.', dev });
const handle = app.getRequestHandler()

const stripe = stripeInit(process.env.STRIPE_SECRET_KEY);
const chargeHound = chargeHoundInit(process.env.CHARGEHOUND_KEY);

const songsDatabase = [
  {
    id: '1',
    song_artist: 'Hound of Love',
    song_name: 'Rivers Edge',
    amount: 200,
  },

  {
    id: '2',
    song_artist: 'Hound of Love',
    song_name: 'Rivers Edge',
    amount: 500,
  },

  {
    id: '3',
    song_artist: 'Hound of Love',
    song_name: 'Rivers Edge',
    amount: 300,
  },

  {
    id: '4',
    song_artist: 'Hound of Love',
    song_name: 'Rivers Edge',
    amount: 100,
  }
]

app.prepare().then(() => {
  const server = express();
  server.use(bodyParser.json());

  server.post('/api/chargehound-webhook', async (request, response) => {
    console.log('POST /api/chargehound-webhook');
    // Retrieve the request's body and parse it as JSON
    var eventJson = request.body;

    // 1) Handle the dispute.created event
    if (!eventJson ||
        eventJson.type !== 'dispute.created') {
      return response.sendStatus(500);
    }

    // The id of the dispute.
    // The id used by your payment processor is also used by Chargehound.
    var disputeId = eventJson.dispute;

    try {
      const dispute = await stripe.disputes.retrieve(disputeId)
      console.log('fetched dispute from stripe ', disputeId);
      console.log(dispute);
    }catch(err){
      console.error('failed to fetch a dispute from stripe ', disputeId);
      console.error(err);
      return response.sendStatus(500);
    }

    console.log('sending dispute evidence to chargehound...');
    try{
      const chres = chargehound.Disputes.submit(disputeId, {
        template: 'song-purchase',
        fields: {
          'purchase_url': 'www.example.com',
          'song_artist': 'example text',
          'song_name': 'example text'
        }
      });
      return response.sendStatus(200);
    }catch(err){
      console.error('error form chargehound ', 500);
      return response.sendStatus(500);
    }



  });

  server.post('/api/charge-stripe-token', async (req, res) => {
    console.log("POST /api/charge-stripe-token");
    const token = req.body.token;
    const item = req.body.item;

    console.log(req.body);

    if(!token || !token.object){
      return res.sendStatus(500);
    }

    if(!item || !item.amount){
      return res.sendStatus(500);
    }

    console.log("charging stripe");
    try {
      const charge = await stripe.charges.create({
        amount: item.amount,
        source: token.id,
        currency: 'usd',
        capture: true,
        metatdata: item
      });

      console.log('stripe charge success');
      return res.send(charge);
    }catch(err){
      console.error('stripe charge error');
      console.error(err);
      return res.sendStatus(500);
    }
  });

  server.get('/api/songs', (req, res) => {
    return res.send(JSON.stringify(songsDatabase));
  });

  // All get requets get passed to next.js
  // and served from the /pages directory
  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`app listening on port ${port}!`)
  })
})
