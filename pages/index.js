import React from 'react';
import StripeCheckout from 'react-stripe-checkout';
import fetch from 'isomorphic-unfetch'

class SongContainer extends React.Component{
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
    const { song_artist, song_name, amount } = this.props.song;
    return(
      <div className="song-container">
        <p>{song_artist}</p>
        <p>{song_name}</p>
        <StripeCheckout
          token={this.checkoutItem.bind(this,
                                        500,
                                        song_artist,
                                        song_name
          )}
          stripeKey="pk_test_ZQJUUIzolNFkfMrHVOoXzRiA"
          name={`${song_artist} - ${song_name}`}
          amount={amount}
          billingAddress={true}
        >
          <button>Buy Now</button>
        </StripeCheckout>
      </div>
    )
  }
}

export default class IndexPage extends React.Component{
  static async getInitialProps({ req }) {
    const res = await fetch(`${req.protocol}://${req.headers.host}/api/songs`);
    const songs = await res.json();
    return {songs};
  }

  render(){
    return (
      <div>
        <h1>Online Music Store</h1>
        <div>
          {this.props.songs.map((song, index) => <SongContainer song={song} key={index} />)}
        </div>
      </div>
    );
  }
}
