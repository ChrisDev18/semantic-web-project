import {escapeSpecialCharacters, flattenJSON, NotFoundError, SPARQL_ENDPOINT} from "./constants.js";

export async function fetchSeriesData(seriesName) {
  // Replace spaces with underscores, and escape special characters
  seriesName = seriesName.replace(/ /g, "_");
  seriesName = escapeSpecialCharacters(seriesName);

  console.log("Fetching Series given label: " + seriesName)

  const query = `
    PREFIX dbo: <http://dbpedia.org/ontology/>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX dbr: <http://dbpedia.org/resource/>
    
    SELECT ?label ?comment (GROUP_CONCAT(?genreLabel; separator=",") AS ?genres) (GROUP_CONCAT(?gameLabel; separator=",") AS ?games)
    WHERE {
      dbr:${seriesName} rdfs:label ?label;
                        rdfs:comment ?comment;
                        dbp:genre ?genre.
      
      OPTIONAL { dbr:${seriesName} dbp:genre ?genre. ?genre rdfs:label ?genreLabel. }
      OPTIONAL { dbr:${seriesName} dbp:game ?game. ?game rdfs:label ?gameLabel. }
      
      FILTER (lang(?label) = "en" && lang(?comment) = "en" && lang(?gameLabel) = "en" && lang(?genreLabel) = "en")
    }
    GROUP BY ?label ?comment ?genreLabel
  `;

  // Perform request
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

  // Check if anything was found
  if (data.results.bindings.length === 0) {
    throw new NotFoundError("No data found for the provided game name.");
  }
  let results = data.results.bindings[0];
  if (! results) {
    throw new NotFoundError("No data found for the provided game name.");
  }

  // Flatten JSON to only access values of each key
  results = flattenJSON(results);
  console.log(results);

  // Format the results and return them
  return {
    ...results,
    genres: results.genres ? results.genres.split(",") : null,
    games: results.games ? results.games.split(",") : null,
  };
}
