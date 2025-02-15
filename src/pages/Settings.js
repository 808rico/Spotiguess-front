import React, { useState, useEffect } from "react";
import MainLayout from "../components/layout/MainLayout";
import Cookies from "js-cookie";
import axios from "axios";
import { message } from 'antd';

function Settings() {
  const [manualGame, setManualGame] = useState(null); // Initialisation à null
  const urlServer = process.env.REACT_APP_URL_SERVER;

  // Récupérer le gameType au chargement
  useEffect(() => {
    const accessToken = Cookies.get("spotifyAuthToken");
    if (!accessToken) return; // Ne pas exécuter si l'utilisateur n'est pas connecté

    axios.get(`${urlServer}/settings/game-mode`, {
      params: { accessToken }
    })
    .then((response) => {
      if (response.data && response.data.gameType) {
        setManualGame(response.data.gameType === "manual");
      }
    })
    .catch((error) => {
      console.error("Error fetching game mode:", error);
      message.error("Error fetching game mode");
    });
  }, [urlServer]); // Exécution au premier rendu

  const handleManualGameToggle = () => {
    if (manualGame === null) return; // Éviter de toggler si non défini

    const accessToken = Cookies.get("spotifyAuthToken");
    setManualGame(!manualGame);

    axios.post(`${urlServer}/settings/game-mode`, {
      gameType: manualGame ? "auto" : "manual",
      accessToken
    })
    .then((response) => {
      console.log(response);
      message.success('Game mode updated');
    })
    .catch((error) => {
      console.error(error);
      message.error('Error updating game mode');
    });
  };

  return (
    <MainLayout>
      <div className="bg-black py-8 px-4">
        <h1 className="text-white text-3xl font-bold mb-6">Settings</h1>

        {/* Section : Game Mode */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl text-white font-semibold mb-4">Game mode</h2>
          <div className="flex items-center justify-between mb-3">
            <span className="text-white">Game Mode</span>
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={manualGame ?? false} // Évite un warning si `manualGame` est null
                  onChange={handleManualGameToggle}
                  disabled={manualGame === null} // Désactive si non chargé
                />
                <div className="block w-14 h-8 rounded-full bg-gray-600"></div>
                <div
                  className={`absolute left-1 top-1 w-6 h-6 rounded-full bg-white transform transition
                  ${manualGame ? "translate-x-6" : ""}`}
                ></div>
              </div>
              <span className="ml-3 text-white">
                {manualGame ? "Manual" : "Auto"}
              </span>
            </label>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Settings;
