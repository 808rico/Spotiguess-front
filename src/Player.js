import React from "react";
import SpotifyPlayer from "react-spotify-web-playback";

function Player({ accessToken, trackUri, callback, play}) {
  


  return (
    //<div style={{display:'none'}}>
    <div >
      <SpotifyPlayer
        token={accessToken}
        uris={trackUri}
        name="SpotiGuess"
        callback={callback}
        play={play}
          />
    </div>
  );
}

export default Player;



