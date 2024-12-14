import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Import useParams to get the dynamic part of the URL
import { fetchVideoGameData } from "../lib/videogame.js"; // Import the fetch function

export default function VideoGame() {
    // Get the game title from the URL parameters
    let { id } = useParams(); // Use the title from the URL
    console.log("Current game title from URL:", id); // Log the title here to confirm
    const [gameDetails, setGameDetails] = useState({});
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log("Fetching data for:", id);
        const fetchData = async () => {
            try {
                const gameData = await fetchVideoGameData(id); // Fetch the game data using the title
                setGameDetails(gameData); // Set the fetched data in state
            } catch (error) {
                setError(error.message); // Handle error if any
            }
        };
        fetchData();
    }, [id]); // Run effect whenever the title changes

    if (error) {
        return <div>Error: {error}</div>; // Display error if any
    }

    return (
        <div>
            <h1>Game Detail:</h1>
            {!gameDetails.label ? (
                <div>Loading...</div>
            ) : (
                <div>
                    <h2>{gameDetails.label}</h2>
                    <p>{gameDetails.comment}</p>
                    <p>Genre: {gameDetails.genre}</p>
                    <p>Rating: {gameDetails.rating}</p>
                    <p>Platforms: {gameDetails.platforms}</p>
                    <p>Publisher: {gameDetails.publisher}</p>
                    <p>Release Date: {gameDetails.releaseDate}</p>
                    <p>Series: {gameDetails.series}</p>
                    <p>Age Rating: {gameDetails.ageRating}</p>
                    <p>Modes: {gameDetails.modes}</p>
                </div>
            )}
        </div>
    );
}
