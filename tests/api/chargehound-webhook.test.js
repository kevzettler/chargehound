import sinon from 'sinon';
import express from 'express';
import request from 'supertest';
import test from 'tape';
import bodyParser from 'body-parser';

import stripeInit from 'stripe';
import chargeHoundInit from 'chargehound';

const app = express();
app.use(bodyParser.json());


const stripe = stripeInit('test_key');
const disputeRetriveStub = sinon.stub();
disputeRetriveStub.withArgs('bad_id').throws('StripeDisputeError');
disputeRetriveStub.withArgs('good_id').returns({
  charge: 'good_id'
})
disputeRetriveStub.withArgs('missing_charge_id').returns({
  charge: null
});
stripe.disputes.retrieve = disputeRetriveStub;


const chargeRetriveStub = sinon.stub();
chargeRetriveStub.withArgs(null).throws('StripeChargeError');
chargeRetriveStub.withArgs('good_id').returns({
  metadata: {

  }
})
stripe.charges.retrieve = chargeRetriveStub;


const chargeHound = chargeHoundInit('test_key', {
  host: 'test-api.chargehound.com'
});
const disputeSubmitStub = sinon.stub();
disputeSubmitStub.onCall(0).returns(true);
disputeSubmitStub.onCall(1).throws('ChargeHoundError');
chargeHound.Disputes.submit = disputeSubmitStub;



app.set('stripe', stripe);
app.set('chargeHound', chargeHound);

import chargehoundWebhook from '../../api/chargehound-webhook.js';


test('----- API Test: chargehound-webhook -----', (t) => {

  app.post('/chargehound-webhook', chargehoundWebhook);

  request(app)
    .post('/chargehound-webhook')
    .expect(500)
    .end((err, res) => {
      t.error(err, "returns 500 when no eventJSON is passed");
    })

  request(app)
    .post('/chargehound-webhook')
    .send({
      type: "notvalid.event",
      dispute: 'bad_id'
    })
    .expect(500)
    .end((err, res) => {
      t.error(err, "returns 500 when event type is not valid");
    })

  request(app)
    .post('/chargehound-webhook')
    .send({
      type: "dispute.created",
      dispute: 'bad_id'
    })
    .expect(500)
    .end((err, res) => {
      t.error(err, "returns 500 when with bad dispute id");
    })


  request(app)
    .post('/chargehound-webhook')
    .send({
      type: "dispute.created",
      dispute: 'missing_charge_id'
    })
    .expect(500)
    .end((err, res) => {
      t.error(err, "returns 500 when when dispute and charge mismatch");
    })


  request(app)
    .post('/chargehound-webhook')
    .send({
      type: "dispute.created",
      dispute: 'good_id'
    })
    .expect(200)
    .end((err, res) => {
      t.error(err, "returns 200 when when dispute is good");
    })

  request(app)
    .post('/chargehound-webhook')
    .send({
      type: "dispute.created",
      dispute: 'good_id'
    })
    .expect(500)
    .end((err, res) => {
      t.error(err, "returns 500 on chargehound exception");
      t.end();
    })

});
