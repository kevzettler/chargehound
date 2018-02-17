import React from 'react';
import PropTypes from 'prop-types';
import fetch from 'isomorphic-unfetch'
import Head from 'next/head';
import SongContainer from '../components/SongContainer';
import "../styles.scss"

export default class IndexPage extends React.Component{
  constructor(props, context){
    super(props, context);
    this.state = {
      waitingOnPurchase: false,
      message: null
    };


  }

  static async getInitialProps({ req }) {
    const res = await fetch(`${req.protocol}://${req.headers.host}/api/songs`);
    const songs = await res.json();
    return {
      songs,
      stripePKey: process.env.STRIPE_P_KEY
    };
  }

  checkoutItem = async (amount, song_artist, song_name, token) => {
    this.setState({
      waitingOnPurchase: true,
      message: null
    });

    try{
      fetch('/api/charge-stripe-token', {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          token,
          item: {
            purchase_url: window.location.href,
            amount,
            song_artist,
            song_name
          }
        }),
      })

      this.setState({
        message: 'success'
      });

    }catch(err){
      this.setState({
        message: 'error'
      });
    }
    this.setState({ waitingOnPurchase: false });
    setTimeout(() => {
      this.setState({ message: null })
    }, 5000);
  }


  renderMessage(){
    if(this.state.message === 'success'){
      return <div className="message success">Your purchase was successful!</div>
    }

    if(this.state.message === 'success'){
      return <div className="message error">There was a problem with your order.</div>
    }

    return null;
  }

  render(){
    return (
      <div className="index-container">
        <h1>Online Music Store</h1>
        {this.renderMessage()}
        <div className="song-container-row">
          {this.props.songs.map((song, index) => <SongContainer
                                                   song={song}
                                                   buyHandler={this.checkoutItem}
                                                   key={index}
                                                   stripePKey={this.props.stripePKey}
                                                   disabled={this.state.waitingOnPurchase}/>
          )}
        </div>
      </div>
    );
  }
}


IndexPage.propTypes = {
  songs: PropTypes.array.isRequired,
  stripePKey: PropTypes.string.isRequired
};
