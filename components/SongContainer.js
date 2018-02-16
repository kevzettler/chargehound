import React from 'react';
import StripeCheckout from 'react-stripe-checkout';

export default class SongContainer extends React.Component{
  render(){
    const { song_artist, song_name, amount } = this.props.song;
    return(
      <div className="song-container">
        <div className="song-image"></div>
        <p className="song-artist">{song_artist}</p>
        <p className="song-name">{song_name}</p>
        <StripeCheckout
          token={this.props.buyHandler.bind(this,
                                        amount,
                                        song_artist,
                                        song_name
          )}
          stripeKey="pk_test_ZQJUUIzolNFkfMrHVOoXzRiA"
          name={`${song_artist} - ${song_name}`}
          amount={amount}
          billingAddress={true}
        >
          <button disabled={this.props.disabled}>Buy Now</button>
        </StripeCheckout>
      </div>
    )
  }
}
