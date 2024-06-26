import { useEffect, useState } from 'react';
import axios from 'axios';
import { authEndpoint, clientId, redirectUri, scopes } from './spotify-config';
import hash from './hash';
import kitten1 from '../public/images/kitten1.png';
import kitten2 from '../public/images/kitten2.png';
import kitten3 from '../public/images/kitten3.png';
import './index.css'; 

const App = () => {
  const [token, setToken] = useState('');
  const [topArtists, setTopArtists] = useState([]);

  useEffect(() => {
    let _token = hash.access_token;
    if (_token) {
      setToken(_token);
      window.location.hash = '';
      getTopArtists(_token);
    } else {
      const code = new URLSearchParams(window.location.search).get('code');
      if (code) {
        fetchToken(code);
        window.history.pushState({}, null, '/');
      }
    }
  }, []);

  const fetchToken = async (code) => {
    try {
      const response = await axios.post('https://kittenfy.netlify.app/api/token', { code });
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
      setTopArtists(data.items.slice(0, 12));
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
    <div className="main-container">
      <img className='kitten kitten-1' src={kitten1} alt="Kitten 1" />
      <img className='kitten kitten-2' src={kitten2} alt="Kitten 2" />
      <img className='kitten kitten-3' src={kitten3} alt="Kitten 3" />
        {!token ? (
          <button className='login-button' onClick={handleLogin}>Login to Spotify</button>
        ) : (
          <div>
            <h1 className='page-title'>Top Artists</h1>
            <ul className="artists-list">
              {topArtists.map(artist => (
                <li className='artist-item' key={artist.id}>{artist.name}</li>
              ))}
            </ul>
          </div>
        )}
    </div>
  );
};

export default App;
