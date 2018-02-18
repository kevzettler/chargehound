import React from 'react';
import test from 'tape-enzyme';
import { shallow, mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import sinon from 'sinon';

configure({ adapter: new Adapter() });

// Component to test
import SongComponent from '../../components/SongContainer.js';


test('----- React Component Tests: SongComponent -----', (t) => {

  const song = {
    id: '1',
    song_artist: "Test Artist",
    song_name: 'Test Song',
    amount: 200
  };

  const buyHandler = sinon.stub();

  // Shallow rendering: Render React element only *one* level deep
  const wrapper = shallow(<SongComponent song={song}
                                           buyHandler={buyHandler}
                                           disabled={false}
                                           stripePKey="test_key"
  />);



  t.isFound(wrapper, '.song-container', "should contain a .song-container element")
  t.isFound(wrapper, '.song-name', "should contain a .song-name element")
  t.isFound(wrapper, '.song-image', "should contain a .song-image element")
  t.isFound(wrapper, '.song-image', "should contain a .song-image element")


  t.end();
});
