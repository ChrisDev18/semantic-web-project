import {escapeSpecialCharacters, SPARQL_ENDPOINT} from "./constants.js";

// Function to fetch video game data by its name (e.g., The Legend of Zelda)
export async function fetchVideoGames(gameName) {
    console.log(gameName)
    // Updated SPARQL query with more details
    const query = `PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX dbr: <http://dbpedia.org/resource/>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX foaf: <http://xmlns.com/foaf/0.1/>

        SELECT DISTINCT ?game ?label ?comment ?releaseDate ?series ?publisher ?platform ?rating ?ageRating ?genreLabel ?modes
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

export async function fetchVideoGameData(gameName) {
    gameName = gameName.replace(/ /g, "_");
    gameName = escapeSpecialCharacters(gameName);

    console.log("Fetching given entity name: " + gameName)
    // Updated SPARQL query with more details
    const query = `
        PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX dbr: <http://dbpedia.org/resource/>
        
        SELECT ?label ?comment 
               (GROUP_CONCAT(DISTINCT ?genreLabel; separator=",") AS ?genres)
               ?rating 
               (GROUP_CONCAT(DISTINCT ?platformLabel; separator=",") AS ?platforms)
               ?publisher ?releaseDate ?series ?ageRating 
               (GROUP_CONCAT(DISTINCT ?modeLabel; separator=",") AS ?modes)
        WHERE {
          dbr:${gameName} rdfs:label ?label;
                                   rdfs:comment ?comment.
                                   
          OPTIONAL { dbr:${gameName} dbo:genre ?genre. ?genre rdfs:label ?genreLabel. FILTER (lang(?genreLabel) = "en") }
          OPTIONAL { dbr:${gameName} dbo:rating ?rating. }
          OPTIONAL { dbr:${gameName} dbo:computingPlatform ?platform. ?platform rdfs:label ?platformLabel. FILTER (lang(?platformLabel) = "en") }
          OPTIONAL { dbr:${gameName} dbo:publisher ?publisher. }
          OPTIONAL { dbr:${gameName} dbo:releaseDate ?releaseDate. }
          OPTIONAL { dbr:${gameName} dbo:series ?series. }
          OPTIONAL { dbr:${gameName} dbo:ageRating ?ageRating. }
          OPTIONAL { dbr:${gameName} dbo:modes ?mode. ?mode rdfs:label ?modeLabel. FILTER (lang(?modeLabel) = "en") }
        
          FILTER (lang(?label) = "en" && lang(?comment) = "en")
        }
        GROUP BY ?label ?comment ?rating ?publisher ?releaseDate ?series ?ageRating
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
        console.log(data);
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
