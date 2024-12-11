import { useState } from "react";
import logo from "/app_logo.svg";
import { APP_NAME } from "../lib/constants.js";

export default function Navbar() {
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchSuggestions = async (query) => {
        if (!query) {
            setSuggestions([]);
            return;
        }

        const endpoint = "https://dbpedia.org/sparql";
        const sparqlQuery = `
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

        SELECT ?videoGame ?title
        WHERE {
          ?videoGame rdf:type dbo:VideoGame .
          ?videoGame rdfs:label ?title .
          FILTER (lang(?title) = "en") # Ensure titles are in English
          FILTER (STRSTARTS(LCASE(?title), LCASE("${query}")))
        }
        LIMIT 10
        `;

        // Construct the query URL
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
        const query = e.target.value;
        setSearchQuery(query);

        if (query) {
            fetchSuggestions(query);
        } else {
            setSuggestions([]);
        }
    };

    return (
        <nav className="flex justify-between px-6 py-4 z-10 bg-gradient-to-b from-black">
            <span className="flex items-center gap-2">
                <img src={logo} alt={APP_NAME + " logo"} />
                <p className="font-semibold">{APP_NAME}</p>
            </span>
            <div className="relative">
                <input
                    type="text"
                    placeholder="Rechercher..."
                    className="px-4 py-2 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchQuery}
                    onChange={handleInputChange}
                />
                {isLoading && (
                    <div className="absolute top-2 right-2 text-gray-500">Loading...</div>
                )}
                {suggestions.length > 0 ? (
                    <ul className="absolute left-0 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                        {suggestions.map((suggestion) => (
                            <li
                                key={suggestion.uri}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-blue-600"
                                onClick={() => window.open(suggestion.uri, "_blank")}
                            >
                                {suggestion.title || "No Title Available"}
                            </li>
                        ))}
                    </ul>
                ) : (
                    !isLoading &&
                    searchQuery && (
                        <div className="absolute left-0 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg px-4 py-2 text-gray-500">
                            No results found
                        </div>
                    )
                )}
            </div>
        </nav>
    );
}
