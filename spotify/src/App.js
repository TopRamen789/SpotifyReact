import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import SpotifyWebApi from './spotify-web-api';
import token from './key/OAuth token'


//This function isn't really React related, I just wanted to be able to feed a collection and some paths to a method so I could be lazy.
//  courtesy of Alnitak: https://stackoverflow.com/questions/6491463/accessing-nested-javascript-objects-with-string-key?noredirect=1&lq=1
Object.byString = function(o, s) {
    s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, '');           // strip a leading dot
    var a = s.split('.');
    for (var i = 0, n = a.length; i < n; ++i) {
        var k = a[i];
        if (k in o) {
            o = o[k];
        } else {
            return;
        }
    }
    return o;
}

//REMINDER:
//  You need a single ROOT element
//  i.e. if you feed in an array and build elements out of it
//  you need to wrap something around the array
function ImageList(props) {
  return (
    <div>
      {props.collection.map((value, i) => 
        <ListGroup key={i}>
          <ImageContent 
            name={Object.byString(value, props.namePath)}
            src={Object.byString(value, props.srcPath)} />
        </ListGroup>
      )}
    </div>
  );
}

//There is a specially reserved object on props called 'children'
//  which basically lets you do this:
/*
  <CustomElement>
    {props.children}
  </CustomElement>

  which could be translated to:

  <CustomElement>
    <OtherCustomElement />
  </CustomElement>
*/
function ListGroup(props) {
  return (
    <div className="list-group">
      {props.children}
    </div>
  );
}

function ImageContent(props) {
  return (
    <a className="list-group-item">
      <h4 className="list-group-item-heading">{props.name}</h4>
      <img src={props.src} />
    </a>
  );
}

class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date()
    });
  }

  render() {
    return (
      <div>
        <h2> It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    )
  }
}

class App extends Component {

  constructor() {
    super();

    var spotifyApi = new SpotifyWebApi();

    //NOTE: The access token expires shortly after you get it.
    //  developer.spotify.com/web-api/authorization-guide/
    //  7. Requesting access token from refresh token
    spotifyApi.setAccessToken(token);

    this.state = {
      albums: [],
      displayList: true,
      spotify: spotifyApi
    };
  }

  componentDidMount() {
    var albums = [];

      this.state.spotify.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE', function(err, data) {
        if(err) console.log(err);
        else {
          data.items.forEach(function(val) {
            albums.push(val);
          });

          console.log(albums);

          this.setState({
            albums: albums
          });
        }
      }.bind(this));
  }

  renderHeader() {
    return (
      <div className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h2>Welcome to React</h2>
      </div>
    );
  }

  renderContent(content) {
    return (
      <div>
        {this.renderHeader()}
        <div className="App-intro">
          <div>To get started, edit <code>src/App.js</code> and save to reload.</div>
          <button onClick={() =>
              this.setState({
                displayList: !this.state.displayList
              })
            }>
            BUTTON
          </button>
          <Clock />
          <div className="panel panel-default">
            {content}
          </div>
        </div>
      </div>
    );
  }

  renderAlbumAsList() {
    //As much as I'd like this to work, it's unintuitive and gross looking
    //  Even after the deepFind function, this still feels gross...
    //  If you could just feed the collection that'd be pretty cool, but I don't know how that'd work.
    //  Unless the class was supposed to know what kind of collection it was being fed e.g. a list of songs, artists, or albums
    //    class AlbumList would know where it's supposed to go in the collection to find images and names.
    return (
      <ImageList
        collection={this.state.albums}
        namePath={"name"}
        srcPath={"images[2].url"} />
    );
  }

  renderAlbumAsThumbnails() {
    var row = [];
    var rows = [];
    this.state.albums.forEach((album, i) => {
      row.push(
        <div className="col-xs-6 col-md-3" key={i}>
          <a className="thumbnail">
            <img src={album.images[2].url} />
            <div className="caption">{album.name}</div>
          </a>
        </div>
      );

      if(row.length == 3) {
        rows.push(<div className="row" key={i}>{row}</div>);
        row = [];
      }
    });

    return rows;
  }

  render() {
    if(this.state.albums.length) {
      var albums;

      if(this.state.displayList) {
        albums = this.renderAlbumAsList();
      } else {
        albums = this.renderAlbumAsThumbnails();
      }

      return (
        <div className="App">
          {this.renderContent(albums)}
        </div>
      );
    } else {
      return (
        <div className="App">
          {this.renderContent("Loading...")}
        </div>
      )
    }
  }
}

export default App;