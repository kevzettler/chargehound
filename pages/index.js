import fetch from 'isomorphic-unfetch'
import Head from 'next/head';
import SongContainer from '../components/SongContainer';
import "../styles.scss"

export default class IndexPage extends React.Component{
  constructor(props, context){
    super(props, context);
    this.state = {
      waitingOnPurchase: false
    };
  }

  static async getInitialProps({ req }) {
    const res = await fetch(`${req.protocol}://${req.headers.host}/api/songs`);
    const songs = await res.json();
    return {songs};
  }

  checkoutItem = (amount, song_artist, song_name, token) => {
    this.setState({ waitingOnPurchase: true });

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
    }).then(response => {
      this.setState({ waitingOnPurchase: false });
    });
  }

  render(){
    return (
      <div className="index-container">
        <h1>Online Music Store</h1>
        <div className="song-container-row">
          {this.props.songs.map((song, index) => <SongContainer
                                                   song={song}
                                                   buyHandler={this.checkoutItem}
                                                   key={index}
                                                   disabled={this.state.waitingOnPurchase}/>
          )}
        </div>
      </div>
    );
  }
}
