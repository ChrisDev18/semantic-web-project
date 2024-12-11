import {SPARQL_ENDPOINT} from "./constants.js";

export async function getVideoGameSeriesById(SeriesName){
 const query =  `
 PREFIX dbo: <http://dbpedia.org/ontology/>
 PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
 PREFIX foaf: <http://xmlns.com/foaf/0.1/>

 SELECT ?label ?abstract ?genre ?wikiPage
 WHERE {
   ?series a dbo:VideoGameSeries ;
           rdfs:label ?label ;
           dbo:abstract ?abstract ;
           dbo:genre ?genre ;
           foaf:isPrimaryTopicOf ?wikiPage .
   FILTER (lang(?label) = "en" && regex(?label, "^${seriesName}$", "i"))
 }
`;  


}



getVideoGameSeriesById(seriesName);

export async function getVideoGameSeriesByName(seriesName) {
  // Define query
  const query = `
    PREFIX dbo: <http://dbpedia.org/ontology/>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

    SELECT ?label ?abstract ?genre ?series
    WHERE {
      ?game a dbo:VideoGame ;
            rdfs:label ?label ;
            dbo:abstract ?abstract ;
            dbo:series ?series ;
            dbo:genre ?genre .
      FILTER (lang(?label) = "en" && regex(?label, "${seriesName}", "i"))
    }
  `;

  // Make request
  const response = await fetch(SPARQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Accept': 'application/sparql-results+json',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `query=${encodeURIComponent(query)}`
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  // Format results for UI and return
  const data = await response.json();
  const results = data.results.bindings;
  return results.map(result => ({
    name: result.label.value,
    abstract: result.abstract.value,
    genre: result.genre.value
  }));
}