import { useState, useEffect } from "react";
import logo from "/app_logo.svg";
import { APP_NAME } from "../lib/constants.js";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom"; // Import useNavigate

export default function Navbar() {
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate(); // Use navigate to programmatically change routes

    // Debounce Effect
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 500); // 500ms delay

        return () => {
            clearTimeout(handler); // Clear the timeout on query change or unmount
        };
    }, [searchQuery]);

    // Fetch Suggestions based on the debounced query
    useEffect(() => {
        if (debouncedQuery) {
            fetchSuggestions(debouncedQuery);
        } else {
            setSuggestions([]);
        }
    }, [debouncedQuery]);

    const fetchSuggestions = async (query) => {
        const endpoint = "https://dbpedia.org/sparql";
        const sparqlQuery = `
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

        SELECT DISTINCT ?videoGame ?title
        WHERE {
          ?videoGame rdf:type dbo:VideoGame ;
             rdfs:label ?title ;
             dbo:genre ?genre ;
             dbo:publisher ?publisher ;
             dbo:releaseDate ?releaseDate ;
             rdfs:comment ?comment .
          
          FILTER (lang(?title) = "en" && lang(?comment) = "en")
          FILTER (STRSTARTS(LCASE(?title), LCASE("${query}")))
        }
        LIMIT 10
        `;

        const url = `${endpoint}?query=${encodeURIComponent(sparqlQuery)}&format=json`;

        setIsLoading(true);

        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Accept: "application/sparql-results+json",
                },
            });

            if (response.ok) {
                const data = await response.json();
                const results = data.results.bindings.map((item) => ({
                    uri: item.videoGame.value,
                    title: item.title.value,
                }));
                setSuggestions(results);
                console.log("Fetched suggestions:", results);
            } else {
                console.error("Failed to fetch suggestions:", response.statusText);
            }
        } catch (error) {
            console.error("Error fetching suggestions:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setSearchQuery(e.target.value);
    };
    const handleSuggestionClick = (title) => {
        // Navigate to VideoGame page and pass the selected title
        navigate(`/videogame/${encodeURIComponent(title)}`);
    };

    return (
        <nav className="relative flex justify-between px-6 py-4 bg-gradient-to-b from-black w-full z-50">
            {/* Logo Section */}
            <Link to={"/"} className="flex items-center gap-2">
                <img src={logo} alt={APP_NAME + " logo"} />
                <p className="font-semibold">{APP_NAME}</p>
            </Link>

            {/* Search Input Section */}
            <div className="relative w-full max-w-xl">
                <input
                    type="text"
                    placeholder="Rechercher..."
                    className="px-4 py-2 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                    value={searchQuery}
                    onChange={handleInputChange}
                />
                {isLoading && (
                    <div className="absolute top-2 right-2 text-gray-500">Loading...</div>
                )}

                {/* Suggestions List */}
                {suggestions.length > 0 ? (
                    <ul
                        className="absolute left-0 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-50"
                        style={{
                            maxHeight: "160px", // Limit the height of dropdown
                            overflowY: "auto", // Vertical scroll
                            overflowX: "hidden", // Prevent horizontal scroll
                        }}
                    >
                        {suggestions.map((suggestion) => (
                            <li
                                key={suggestion.uri}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-blue-600"
                                onClick={() => handleSuggestionClick(suggestion.title)} // Navigate on click
                            >
                                {suggestion.title || "No Title Available"}
                            </li>
                        ))}
                    </ul>
                ) : (
                    !isLoading && searchQuery && (
                        <div
                            className="absolute left-0 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg px-4 py-2 text-gray-500">
                            No results found
                        </div>
                    )
                )}
            </div>
        </nav>
    );
}
