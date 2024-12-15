import React, { useState, useEffect } from "react";
import {Link, useParams} from "react-router-dom"; // Import useParams to get the dynamic part of the URL
import {fetchVideoGameData} from "../lib/videogame.js"; // Import the fetch function

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
                const gameData = await fetchVideoGameData(decodeURIComponent(id)); // Fetch the game data using the title
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
        <div className={"p-6"}>
            <h1 className={"italic"}>Video game</h1>
            {!gameDetails.label ? (
                <div>Loading...</div>
            ) : (
              <div className={"flex flex-col gap-2"}>
                  <h2 className={"text-3xl font-bold"}>{gameDetails.label}</h2>

                  <p>{gameDetails.comment}</p>


                  <div>
                      <p className={"font-medium"}>Genres</p>
                      {gameDetails.genres ? (
                        <ul className={"list-disc pl-6 space-y-1"}>
                            {gameDetails.genres.map((genre, i) =>
                              <li key={i}>
                                  {genre}
                              </li>
                            )}
                        </ul>
                      ) : (
                        <p>N/A</p>
                      )}
                  </div>

                  <div>
                      <p className={"font-medium"}>Rating (MC)</p>
                      <p>{gameDetails.rating ?? "N/A"}</p>
                  </div>

                  <div>
                      <p className={"font-medium"}>Platforms</p>
                      {gameDetails.platforms ? (
                        <ul className={"list-disc pl-6 space-y-1"}>
                            {gameDetails.platforms.map((platform, i) =>
                              <li key={i}>
                                  {platform}
                              </li>
                            )}
                        </ul>
                      ) : (
                        <p>N/A</p>
                      )}
                  </div>

                  <div>
                      <p className={"font-medium"}>Video game series</p>
                      {gameDetails.seriesLabel ? (
                        <Link className="text-blue-400 hover:text-blue-500 focus:text-blue-500 focus:outline-none hover:underline active:underline focus:underline focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
                              to={"/series/" + encodeURIComponent(gameDetails.seriesLabel)}>
                            {gameDetails.seriesLabel}
                        </Link>
                      ) : (
                        <p>N/A</p>
                      )}
                  </div>

                  <div>
                      <p className={"font-medium"}>Modes</p>
                      {gameDetails.modes ? (
                        <ul className={"list-disc pl-6 space-y-1"}>
                            {gameDetails.modes.map((mode, i) =>
                              <li key={i}>
                                  {mode}
                              </li>
                            )}
                        </ul>
                      ) : (
                        <p>N/A</p>
                      )}
                  </div>

                  <div>
                      <p className={"font-medium"}>Publisher</p>
                      <p>{gameDetails.publisher ?? "N/A"}</p>
                  </div>

                  <div>
                      <p className={"font-medium"}>Release Date</p>
                      <p>{gameDetails.releaseDate ?? "N/A"}</p>
                  </div>

                  <div>
                      <p className={"font-medium"}>Age Rating</p>
                      <p>{gameDetails.ageRating ?? "N/A"}</p>
                  </div>


              </div>
            )}
        </div>
    );
}
