import sinon from 'sinon';
import express from 'express';
import request from 'supertest';
import test from 'tape';
import bodyParser from 'body-parser';
import stripeInit from 'stripe';
import chargeHoundInit from 'chargehound';
import chargeStripeToken from '../../api/charge-stripe-token.js';

const token = {
  object: "token",
  id: "token_id",
  email: "test-user@testmail.com"
};

const item = {
  amount: 333,
  song_artist: "test artist",
  song_name: "test song"
};

const charge = {
  amount: item.amount,
  source: token.id,
  currenc: 'usd',
  capture: true,
  metadat: {
    ...item,
    customer_email: token.email
  }
};



const stripe = stripeInit('test_key');
const chargeCreateStub = sinon.stub();
chargeCreateStub.onCall(0).returns(charge);
chargeCreateStub.onCall(1).throws("StripeChargeError")
stripe.charges.create = chargeCreateStub;


const app = express();
app.use(bodyParser.json());
app.set('stripe', stripe);




test('----- API Test: charge-stripe-token -----', (t) => {

  app.post('/charge-stripe-token', chargeStripeToken);

  request(app)
    .post('/charge-stripe-token')
    .expect(500)
    .end((err, res) => {
      t.error(err, "returns 500 when no token is passed");
    })

  request(app)
    .post('/charge-stripe-token')
    .send({
      token:{ object: false}
    })
    .expect(500)
    .end((err, res) => {
      t.error(err, "returns 500 when token is present but missing token id");
    })

  request(app)
    .post('/charge-stripe-token')
    .send({
      token
    })
    .expect(500)
    .end((err, res) => {
      t.error(err, "returns 500 when token is present but item is not");
    })


  request(app)
    .post('/charge-stripe-token')
    .send({
      token,
      item: { test: true}
    })
    .expect(500)
    .end((err, res) => {
      t.error(err, "returns 500 when token and item are passed but item is missing amount");
    })

  request(app)
    .post('/charge-stripe-token')
    .send({
      token,
      item
    })
    .expect(200)
    .end((err, res) => {
      t.error(err, "returns 200 when token and item are passed");
      t.deepEqual(charge, res.body, "expects the response to be the stripe charge object")
    })

  request(app)
    .post('/charge-stripe-token')
    .send({
      token,
      item
    })
    .expect(500)
    .end((err, res) => {
      t.error(err, "returns 500 when stripe charge throws an error");
      t.end();
    })

});
