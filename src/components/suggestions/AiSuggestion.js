import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { message, Skeleton } from 'antd';
import './AiSuggestion.css';
import { RedoOutlined } from '@ant-design/icons';

const urlServer = process.env.REACT_APP_URL_SERVER;


const AISuggestion = ({onSuggestionSelect, enabled}) => {
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Fonction pour récupérer les suggestions
    const fetchSuggestions = () => {
        const accessToken = localStorage.getItem('access_token');
        if (accessToken) {
            setIsLoading(true);
            axios.post(`${urlServer}/ai-recommendations`, { accessToken })
                .then(response => {
                    setSuggestions(response.data.playlist);
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
        <div className="suggestions-container">
            <div className="suggestions-header">
                <h2 className='suggestion-text'>Suggestions:</h2>
                <div className={`regenerate-button ${enabled ? '' : 'disabled'}`}  onClick={handleRegenerate}>
                    <RedoOutlined />
                    <span className="regenerate-button-text">Regenerate</span>
                </div>
            </div>

            
            {isLoading ? (
                <div className="loading-suggestions-list">
                <Skeleton className="custom-skeleton" active paragraph={{ rows: 1 }} />
                <Skeleton className="custom-skeleton" active paragraph={{ rows: 1 }} />
                <Skeleton className="custom-skeleton" active paragraph={{ rows: 1 }} />
                <Skeleton className="custom-skeleton" active paragraph={{ rows: 1 }} />
                </div>
            ) : (
                <div className="suggestions-list">
                    {suggestions.map((suggestion, index) => (
                        <div className={`suggestion-item ${enabled ? '' : 'disabled'}`} key={index} onClick={() => handleSuggestionClick(suggestion)} >
                            <div className="suggestion-content">
                                <h3 className="suggestion-title">{suggestion.title}</h3>
                                <p className="suggestion-subtitle">{suggestion.subtitle}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
        </div>
    );
};

export default AISuggestion;
