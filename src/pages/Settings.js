import React, { useState } from "react";
import MainLayout from "../components/layout/MainLayout";

function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
  };

  const handleNotificationsToggle = () => {
    setNotifications(!notifications);
  };

  return (
    <MainLayout>
      <div className="bg-black min-h-screen py-8 px-4">
        <h1 className="text-white text-3xl font-bold mb-6">Settings</h1>

        {/* Section : Appearance */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl text-white font-semibold mb-4">Appearance</h2>
          <div className="flex items-center justify-between mb-3">
            <span className="text-white">Dark Mode</span>
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={darkMode}
                  onChange={handleDarkModeToggle}
                />
                <div className="block w-14 h-8 rounded-full bg-gray-600"></div>
                <div
                  className={`absolute left-1 top-1 w-6 h-6 rounded-full bg-white transform transition
                    ${darkMode ? "translate-x-6" : ""}`}
                ></div>
              </div>
              <span className="ml-3 text-white">
                {darkMode ? "On" : "Off"}
              </span>
            </label>
          </div>
        </div>

        {/* Section : Notifications */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl text-white font-semibold mb-4">Notifications</h2>
          <div className="flex items-center justify-between mb-3">
            <span className="text-white">Enable Notifications</span>
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={notifications}
                  onChange={handleNotificationsToggle}
                />
                <div className="block w-14 h-8 rounded-full bg-gray-600"></div>
                <div
                  className={`absolute left-1 top-1 w-6 h-6 rounded-full bg-white transform transition
                    ${notifications ? "translate-x-6" : ""}`}
                ></div>
              </div>
              <span className="ml-3 text-white">
                {notifications ? "On" : "Off"}
              </span>
            </label>
          </div>
        </div>

        {/* Section : Autres paramètres (exemple) */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl text-white font-semibold mb-4">
            Autres paramètres
          </h2>
          <p className="text-gray-300 mb-2">
            Ici, tu peux ajouter d'autres réglages ou sections selon tes besoins.
          </p>
          <button className="mt-3 px-4 py-2 rounded bg-green-500 text-black font-semibold hover:bg-green-600">
            Sauvegarder
          </button>
        </div>
      </div>
    </MainLayout>
  );
}

export default Settings;
