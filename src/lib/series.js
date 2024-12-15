import {escapeSpecialCharacters, flattenJSON, SPARQL_ENDPOINT} from "./constants.js";

export async function fetchSeriesData(seriesName) {
  // Replace spaces with underscores, and escape special characters
  seriesName = seriesName.replace(/ /g, "_");
  seriesName = escapeSpecialCharacters(seriesName);

  console.log("Fetching Series given label: " + seriesName)

  const query = `
    PREFIX dbo: <http://dbpedia.org/ontology/>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX dbr: <http://dbpedia.org/resource/>
    
    SELECT ?label ?comment (GROUP_CONCAT(?gameLabel; separator=",") AS ?games)
    WHERE {
      dbr:${seriesName} rdfs:label ?label;
      rdfs:comment ?comment.
      
      OPTIONAL { dbr:${seriesName} dbp:game ?game. ?game rdfs:label ?gameLabel. }
      
      FILTER (lang(?label) = "en" && lang(?comment) = "en" && lang(?gameLabel) = "en")
    }
    GROUP BY ?label ?comment
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

    if (data.results.bindings.length === 0) {
      throw new Error("No data found for the provided game name.");
    }

    let results = data.results.bindings[0];
    if (! results)
      throw new Error("No data found.");

    // Flatten JSON to only access values of each key
    results = flattenJSON(results);
    console.log(results);

    // Format the results and return them
    return {
      ...results,
      games: results.games.split(","),
    };

  } catch (error) {

    console.error("Error fetching data: ", error);
    throw new Error("Error fetching data: " + error.message);

  }
}
