import { useEffect, useState } from 'react';
import axios from 'axios';
import { authEndpoint, clientId, redirectUri, scopes } from './spotify-config';
import hash from './hash';

const App = () => {
  const [token, setToken] = useState('');
  const [topArtists, setTopArtists] = useState([]);

  useEffect(() => {
    // Check if we have a token in the URL hash
    let _token = hash.access_token;
    if (_token) {
      setToken(_token);
      window.location.hash = '';
      getTopArtists(_token);
    } else {
      // Check if we have a code in the URL search params
      const code = new URLSearchParams(window.location.search).get('code');
      if (code) {
        fetchToken(code);
        window.history.pushState({}, null, '/');
      }
    }
  }, []);

  const fetchToken = async (code) => {
    try {
      const response = await axios.post('http://localhost:3001/api/token', { code });
      setToken(response.data.access_token);
      getTopArtists(response.data.access_token);
    } catch (error) {
      console.error('Error fetching token', error);
    }
  };

  const getTopArtists = async (token) => {
    try {
      const { data } = await axios.get('https://api.spotify.com/v1/me/top/artists', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTopArtists(data.items);
    } catch (error) {
      console.error('Error fetching top artists', error);
    }
  };

  const handleLogin = () => {
    window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
      '%20'
    )}&response_type=code&show_dialog=true`;
  };

  return (
    <div className="App">
      <header className="App-header">
        {!token ? (
          <button onClick={handleLogin}>Login to Spotify</button>
        ) : (
          <div>
            <h1>Top Artists</h1>
            <ul>
              {topArtists.map(artist => (
                <li key={artist.id}>{artist.name}</li>
              ))}
            </ul>
          </div>
        )}
      </header>
    </div>
  );
};

export default App;
