import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App'; // Assurez-vous que le chemin d'importation est correct

// Obtenez la div root de votre fichier index.html
const container = document.getElementById('root');

// Créez une racine
const root = createRoot(container);

// Lancez votre application en utilisant la méthode render de la racine
root.render(<App />);
