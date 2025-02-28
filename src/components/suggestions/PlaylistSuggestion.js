import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { message, Skeleton } from 'antd';
import './PlaylistSuggestion.css';
import { RedoOutlined } from '@ant-design/icons';


const urlServer = process.env.REACT_APP_URL_SERVER;


const PlaylistSuggestion = ({ onSuggestionSelect, enabled }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Fonction pour récupérer les suggestions
    const fetchSuggestions = () => {

        const accessToken= localStorage.getItem('access_token');;
        if (accessToken) {
            setIsLoading(true);
            axios.post(`${urlServer}/playlist-recommendations`, { accessToken })
                .then(response => {
                    console.log(response.data)
                    setSuggestions(response.data.playlistRecommendations);
                })
                .catch(error => {
                    message.error('Error:' + error.message);
                    console.error('Erreur lors de la requête:', error);
                    setIsLoading(false);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    };

    // Appel initial au chargement du composant
    useEffect(() => {
        fetchSuggestions();
    }, []);

    // Gestionnaire d'événement pour le bouton Regenerate
    const handleRegenerate = () => {
        fetchSuggestions();
    };

    const handleSuggestionClick = (suggestion) => {
        onSuggestionSelect(suggestion);
    };

    return (
        <div className="playlist-suggestions-container">
            <div className="playlist-suggestions-header">
                <h2 className='playlist-suggestion-text'>Suggestions:</h2>
                <div className={`playlist-regenerate-button ${enabled ? '' : 'disabled'}`} onClick={handleRegenerate}>
                    <RedoOutlined />
                    <span className="playlist-regenerate-button-text">Regenerate</span>
                </div>
            </div>


            {isLoading ? (
                <div className="playlist-loading-suggestions-list">
                    {Array(4).fill().map((_, index) => (
                        <div className="playlist-custom-skeleton" key={index}>
                            <div className="playlist-skeleton-image" />
                            <Skeleton avatar={false} title={false}   paragraph={{ rows: 2 }} active />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="playlist-suggestions-list">
                    {suggestions.map((suggestion, index) => (
                        <div className={`playlist-suggestion-item ${enabled ? '' : 'disabled'}`} key={index} onClick={() => handleSuggestionClick(suggestion)}>
                            <div className="playlist-suggestion-thumbnail">
                                <img src={suggestion.images[suggestion.images.length -1].url} alt={suggestion.name} />
                            </div>
                            <div className="playlist-suggestion-details">
                                <h3 className='playlist-suggestion-name'>{suggestion.name}</h3>
                                <p className='playlist-suggestion-author'>By {suggestion.owner.display_name}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
};

export default PlaylistSuggestion;
