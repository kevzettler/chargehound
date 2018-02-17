export default async (req, res) => {
  console.log('POST /api/chargehound-webhook');
  const stripe = req.app.get('stripe')
  const chargeHound = req.app.get('chargeHound');
  const eventJson = req.body;

  // 1) Handle the dispute.created event
  if (!eventJson ||
      eventJson.type !== 'dispute.created') {
    return res.sendStatus(500);
  }

  const disputeId = eventJson.dispute;
  let dispute = null;
  let charge = null;

  try {
    dispute = await stripe.disputes.retrieve(disputeId)
    console.log('fetched dispute from stripe ', disputeId);
  }catch(err){
    console.error('failed to fetch a dispute from stripe ', disputeId);
    console.error(err);
    return res.sendStatus(500);
  }

  try {
    console.log("retrive charge from stripe");
    charge = await stripe.charges.retrieve(dispute.charge);
  }catch(err){
    console.log('unable to retrive charge matching dispute');
    console.error(err);
    return res.sendStatus(500);
  }

  console.log('sending dispute evidence to chargehound...');
  try{
    const chres = chargeHound.Disputes.submit(disputeId, {
      template: 'song-purchase',
      fields: {
        'purchase_url': charge.metadata.purchase_url,
        'song_artist': charge.metadata.song_artist,
        'song_name': charge.metadata.song_name,
        'customer_email': charge.metadata.customer_email,
        'charge_statement_descriptor': "Online Music Store"
      }
    });
    console.log("chargehound success");
    return res.sendStatus(200);
  }catch(err){
    console.error('error form chargehound ',);
    console.log(err);
    return res.sendStatus(500);
  }
}
