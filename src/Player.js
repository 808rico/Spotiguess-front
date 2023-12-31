import React from "react";
import SpotifyPlayer from "react-spotify-web-playback";

function Player({ accessToken, trackUri, callback}) {
  

  return (
    <div style={{display:'none'}}>
      <SpotifyPlayer
        token={accessToken}
        uris={trackUri}
        name="SpotiGuess"
        callback={callback}
      />
    </div>
  );
}

export default Player;



