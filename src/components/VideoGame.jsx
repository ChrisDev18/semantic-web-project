import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';  // Import PropTypes
import { fetchVideoGameData } from "../lib/videogame.js";
import {useParams} from "react-router-dom"; // Import the fetch function

export default function VideoGame() {
    // Get the passed id to a VideoGame
    let { id } = useParams();

    const [gameDetails, setGameDetails] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const games = await fetchVideoGameData(id); // Call the fetch function
                setGameDetails(games); // Update the state with fetched data
            } catch (error) {
                setError(error.message); // If there's an error, set the error message
            }
        };
        fetchData(); // Fetch the data when the component mounts
    }, []); // Empty dependency array means this effect runs once when the component mounts

    if (error) {
        return <div>Error: {error}</div>; // Display error if there's any
    }

    return (
        <div>
            <h1>Game Detail:</h1>
            {gameDetails.length === 0 ? (
                <div>Loading...</div>
            ) : (
                <div>
                    {/*this map is useless since there will be just one element ?*/}
                    {gameDetails.map((game, index) => (
                        // eslint-disable-next-line react/jsx-key
                        <div>
                            <h2>{game.label}</h2>
                            <p>{game.comment}</p>
                            <p>Genre:{game.genre}</p>
                            <p>Rating:{game.mc}</p>
                            <p>Platforms: {game.platforms}</p>
                            <p>Publisher: {game.publisher}</p>
                            <p>Release Date: {game.releaseDate}</p>
                            <p>Series: {game.series}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
