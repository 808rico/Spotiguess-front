import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { message, Skeleton } from 'antd';
import './ArtistSuggestion.css';
import { RedoOutlined } from '@ant-design/icons';
import Cookies from 'js-cookie';

const urlServer = process.env.REACT_APP_URL_SERVER;


const ArtistSuggestion = ({ onSuggestionSelect, enabled }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Fonction pour récupérer les suggestions
    const fetchSuggestions = () => {
        const accessToken= Cookies.get("spotifyAuthToken");
        if (accessToken) {
            setIsLoading(true);
            axios.post(`${urlServer}/artist-recommendations`, { accessToken })
                .then(response => {
                    console.log(response.data)
                    setSuggestions(response.data.artistRecommendations);
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
        <div className="artist-suggestions-container">
            <div className="artist-suggestions-header">
                <h2 className='artist-suggestion-text'>Suggestions:</h2>
                <div className={`artist-regenerate-button ${enabled ? '' : 'disabled'}`} onClick={handleRegenerate}>
                    <RedoOutlined />
                    <span className="artist-regenerate-button-text">Regenerate</span>
                </div>
            </div>


            {isLoading ? (
                <div className="artist-loading-suggestions-list">
                    {Array(4).fill().map((_, index) => (
                        <div className="artist-custom-skeleton" key={index}>
                            <div className="artist-skeleton-image" />
                            <Skeleton avatar={false} title={false}   paragraph={{ rows: 2 }} active />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="artist-suggestions-list">
                    {suggestions.map((suggestion, index) => (
                        <div className={`artist-suggestion-item ${enabled ? '' : 'disabled'}`} key={index} onClick={() => handleSuggestionClick(suggestion)}>
                            <div className="artist-suggestion-thumbnail">
                                <img src={suggestion.images[suggestion.images.length -1].url} alt={suggestion.name} />
                            </div>
                            <div className="artist-suggestion-details">
                                <h3 className='artist-suggestion-name'>{suggestion.name}</h3>
                                
                            </div>
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
};

export default ArtistSuggestion;
