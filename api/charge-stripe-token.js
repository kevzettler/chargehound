export default async (req, res) => {
  console.log("POST /api/charge-stripe-token");
  const stripe = req.app.get('stripe');
  const token = req.body.token;
  const item = req.body.item;

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
      metadata: {
        ...item,
        customer_email: token.email
      }
    });

    console.log('stripe charge success');
    return res.send(charge);
  }catch(err){
    console.error('stripe charge error');
    console.error(err);
    return res.sendStatus(500);
  }
};
