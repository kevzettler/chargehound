import fetch from 'isomorphic-unfetch'
import SongContainer from '../components/SongContainer';

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
      response.json().then(data => {
        alert(`We are in business, ${data}`);
      });
      this.setState({ waitingOnPurchase: false });
    });
  }

  render(){
    return (
      <div>
        <h1>Online Music Store</h1>
        <div>
          {this.props.songs.map((song, index) => <SongContainer
                                                   song={song}
                                                   buyHandler={this.checkoutItem}
                                                   key={index} />)}
        </div>
      </div>
    );
  }
}
