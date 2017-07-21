import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import SpotifyWebApi from './spotify-web-api';
import token from './key/OAuth token.txt'

class App extends Component {
  initSpotifyApi() {
    var spotifyApi = new SpotifyWebApi();

    spotifyApi.setAccessToken(token);
    return spotifyApi;
  }

  testSpotifyApi() {
    var spotifyApi = this.initSpotifyApi();

    spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE', function(err, data) {
      if(err) console.error(err);
      else console.log('Artist albums', data);
    });
  }

  test() {
    this.testSpotifyApi();
  }

  render() {
    this.test();

    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
