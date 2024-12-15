export const APP_NAME = "Notre Appli";
export const SPARQL_ENDPOINT = 'https://dbpedia.org/sparql';

export function escapeSpecialCharacters(input) {
  if (typeof input !== "string") {
    throw new Error("Input must be a string");
  }

  return input
    .replace(/\\/g, "\\\\")  // Escape backslashes first
    .replace(/'/g, "\\'")    // Escape single quotes
    .replace(/"/g, '\\"')    // Escape double quotes
    .replace(/\n/g, "\\n")   // Escape newlines
    .replace(/\r/g, "\\r")   // Escape carriage returns
    .replace(/\t/g, "\\t");  // Escape tabs
}