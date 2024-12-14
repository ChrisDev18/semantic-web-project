import { SPARQL_ENDPOINT } from "./constants.js";

// Function to fetch video game data by its name (e.g., The Legend of Zelda)
export async function fetchVideoGameData(gameName) {
    // Updated SPARQL query with more details
    const query = `PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX dbr: <http://dbpedia.org/resource/>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX foaf: <http://xmlns.com/foaf/0.1/>

        SELECT DISTINCT ?game ?label ?genreValue ?comment ?releaseDate ?series ?publisher ?platforms ?rating ?ageRating ?genreLabel ?modes
        WHERE {
          ?game a dbo:VideoGame ;
                rdfs:comment ?comment ;
                dbo:genre ?genre ;
                dbo:developer ?programmer ;
                dbo:publisher ?publisher ;
                dbo:releaseDate ?releaseDate ;
                rdfs:label ?label .

          OPTIONAL { ?game dbo:series ?series . }
          OPTIONAL { ?game dbo:platform ?platform . }
          OPTIONAL { ?game dbo:mc ?rating . }
          OPTIONAL { ?game dbo:ageRange ?ageRating . }
          OPTIONAL { ?genre rdfs:label ?genreLabel . }
          OPTIONAL { ?game dbp:modes ?modes . }

          FILTER (lang(?label) = "en" && lang(?comment) = "en")
          FILTER (regex(?label, "${gameName}", "i"))
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

        // Format the results and return them
        return {
            label: results[0].label.value,
            comment: results[0].comment.value,
            genre: results[0].genreLabel?.value || 'N/A',
            rating: results[0].rating?.value || 'N/A',
            platforms: results[0].platforms?.value || 'N/A',
            publisher: results[0].publisher?.value || 'N/A',
            releaseDate: results[0].releaseDate?.value || 'N/A',
            series: results[0].series?.value || 'N/A',
            ageRating: results[0].ageRating?.value || 'N/A',
            modes: results[0].modes?.value || 'N/A',
        };
    } catch (error) {
        console.error("Error fetching data: ", error);
        throw new Error("Error fetching data: " + error.message);
    }
}
