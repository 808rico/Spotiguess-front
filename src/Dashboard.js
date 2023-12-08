import React, { useEffect, useState } from "react";
import UseAuth from "./UseAuth";
import SpotifyWebApi from "spotify-web-api-node"

const spotifyApi = new SpotifyWebApi({
    clientId: '80256b057e324c5f952f3577ff843c29',
})




function Dashboard({ code }) {
    const accessToken = UseAuth(code)
    spotifyApi.setAccessToken(accessToken)


    useEffect(() => {
        if (!accessToken) return
        spotifyApi.setAccessToken(accessToken)
    }, [accessToken])

    

    return(
        <div>
            <p>skurt</p>
        </div>
    )
    }

    export default Dashboard