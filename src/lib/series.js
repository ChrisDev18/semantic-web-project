import {escapeSpecialCharacters, SPARQL_ENDPOINT} from "./constants.js";

export async function fetchSeriesData(seriesName) {
  seriesName = seriesName.replace(/ /g, "_");
  seriesName = escapeSpecialCharacters(seriesName);

  // Define query
  const query = `
    PREFIX dbo: <http://dbpedia.org/ontology/>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX dbr: <http://dbpedia.org/resource/>
    
    SELECT ?label ?comment (GROUP_CONCAT(?gameLabel; separator=",") AS ?games)
    WHERE {
      dbr:${seriesName} rdfs:label ?label;
                      dbp:game ?game;
                      rdfs:comment ?comment.
      
      ?game rdfs:label ?gameLabel.
      
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
    const results = data.results.bindings;

    if (results.length === 0) {
      throw new Error("No data found for the provided game name.");
    }

    console.log(results);
    // Format the results and return them
    return {
      label: results[0].label.value,
      comment: results[0].comment.value,
      games: results[0].games.value.split(",")
    };
  } catch (error) {
    console.error("Error fetching data: ", error);
    throw new Error("Error fetching data: " + error.message);
  }
}