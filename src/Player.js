import React from "react";
import SpotifyPlayer from "react-spotify-web-playback";

function Player({ accessToken, trackUri, callback}) {
  
  console.log("Player", trackUri);

  return (
    //<div style={{display:'none'}}>
    <div>
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



