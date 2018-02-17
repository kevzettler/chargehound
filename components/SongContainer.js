import React from 'react';
import PropTypes from 'prop-types';
import StripeCheckout from 'react-stripe-checkout';

export default function SongContainer (props){
  const { song_artist, song_name, amount } = props.song;
  return(
    <div className="song-container">
      <div className="song-image"></div>
      <p className="song-artist">{song_artist}</p>
      <p className="song-name">{song_name}</p>
      <StripeCheckout
        token={props.buyHandler.bind(this,
                                     amount,
                                     song_artist,
                                     song_name
        )}
        stripeKey={props.stripePKey}
        name={`${song_artist} - ${song_name}`}
        amount={amount}
        billingAddress={true}
      >
        <button disabled={props.disabled}>Buy Now</button>
      </StripeCheckout>
    </div>
  )
}

SongContainer.propTypes = {
  disabled: PropTypes.bool.isRequired,
  song: PropTypes.object.isRequired,
  buyHandler: PropTypes.func.isRequired,
  stripePKey: PropTypes.string.isRequired
};

SongContainer.defaultProps = {
  disabled: false
};
