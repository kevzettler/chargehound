import React from 'react';
import StripeCheckout from 'react-stripe-checkout';

export default class IndexPage extends React.Component{
  constructor(){
    super();
  }

  checkoutItem = (amount, artist, song, token) => {
    fetch('/api/charge-stripe-token', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        token,
        item: {
          amount,
          artist,
          song
        }
      }),
    }).then(response => {
      response.json().then(data => {
        alert(`We are in business, ${data.email}`);
      });
    });
  }

  render(){
    return (
      <div>
        <h1>Online Music Store</h1>
        <div>
          <div className="song-record">
            <p>Artist</p>
            <p>Title</p>
            <StripeCheckout
              token={this.checkoutItem.bind(this, 500, 'Artist', 'Title')}
              stripeKey="pk_test_ZQJUUIzolNFkfMrHVOoXzRiA"
              name="Artist Name - Title"
              amount={500}
              billingAddress={true}
            >
              <button>Buy Now</button>
            </StripeCheckout>
          </div>
        </div>
      </div>
    );
  }
}
