import express from 'express';
import bodyParser from 'body-parser';
import next from 'next';
import stripeInit from 'stripe';

const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 8888;
const app = next({ dir: '.', dev });
const handle = app.getRequestHandler()
const stripe = stripeInit(process.env.STRIPE_SECRET_KEY);


app.prepare().then(() => {
  const server = express();
  server.use(bodyParser.json());

  server.post('/api/chargehound-webhook', function (request, response) {
    // Retrieve the request's body and parse it as JSON
    var eventJson = request.body;

    // 1) Handle the dispute.created event
    if (!eventJson ||
        !eventJson.type === 'dispute.created') {
      return response.send(500);
    }

    // The id of the dispute.
    // The id used by your payment processor is also used by Chargehound.
    var disputeId = eventJson.dispute;

    stripe.disputes.retrieve(disputeId)
          .then((dispute) => {
            console.log('fetched dispute from stripe ', disputeId);
            response.send(200);
          })
          .catch((err) => {
            console.error('failed to fetch a dispute from stripe ', disputeId);
            response.send(500);
          });

    // 2) Collect your evidence to send to Chargehound.

    // 3) POST your evidence to the Chargehound API to respond
  });

  server.post('/api/charge-stripe-token', (req, res) => {
    const token = req.body.token;
    const item = req.body.item;

    console.log(req.body);

    if(!token || !token.object){
      return res.send(500);
    }

    if(!item || !item.amount){
      return res.send(500);
    }

    console.log("charging stripe");
    stripe.charges.create({
      amount: item.amount,
      source: token.id,
      currency: 'usd',
      capture: true
    }).then(function(charge){
      console.log('stripe charge success!!', charge);
      return res.send(charge);
    }).catch(function(err){
      console.error('stripe charge error');
      throw err;
      return res.send(500);
    })
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
