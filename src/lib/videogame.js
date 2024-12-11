import { SPARQL_ENDPOINT } from "./constants.js";

// Function to fetch video game data by its name (e.g., The Legend of Zelda)
export async function fetchVideoGameData(gameName) {
    // Define the SPARQL query with a placeholder for the game name
    const query = `PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX dbp: <http://dbpedia.org/property/>
        PREFIX dbr: <http://dbpedia.org/resource/>
        
        SELECT ?game ?label ?genreValue ?comment ?releaseDate ?series ?publisher ?platforms ?mc
        WHERE {
          ?game a dbo:VideoGame;
                   rdfs:label ?label;
                   dbp:genre ?genre;
                   rdfs:comment ?comment;
                dbo:releaseDate ?releaseDate;
                dbo:series ?series;
                dbp:publisher ?publisher;
                dbp:platforms ?platforms;
                dbp:mc ?mc.
        
          FILTER ( regex(?label, "${gameName}"))
          
          # Extract the local part of the genre URI (the part after "http://dbpedia.org/resource/")
          BIND(STRAFTER(str(?genre), "http://dbpedia.org/resource/") AS ?genreValue)
          
          # Optionally, remove "_game" from the genre value
          BIND(REPLACE(?genreValue, "_game", "") AS ?genreValueCleaned)
          
          # Filter to only include English labels (xml:lang = "en")
          FILTER (lang(?label) = "en" && lang(?comment)="en")
        }
        
            `;

    try {
        const response = await fetch(SPARQL_ENDPOINT, {
            method: 'POST',
            headers: {
                'Accept': 'application/sparql-results+json',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `query=${encodeURIComponent(query)}`
        });

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        const results = data.results.bindings;

        if (results.length === 0) {
            throw new Error("No data found for the provided game name.");
        }

        console.log(results);
        // Format the results and return them
        return {
            label: results[0].label.value,
            comment: results[0].comment.value,
            genre: results[0].genreValue.value,
            mc: results[0].mc.value,
            platforms: results[0].platforms.value,
            publisher: results[0].publisher.value,
            releaseDate: results[0].releaseDate.value,
            series: results[0].series.value
        };
    } catch (error) {
        console.error("Error fetching data: ", error);
        throw new Error("Error fetching data: " + error.message);
    }
}
