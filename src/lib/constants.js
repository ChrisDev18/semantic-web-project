export const APP_NAME = "Notre Appli";
export const SPARQL_ENDPOINT = 'https://dbpedia.org/sparql';

export function escapeSpecialCharacters(input) {
  if (typeof input !== "string") {
    throw new Error("Input must be a string");
  }

  return input
    .replace(/\\/g, "\\\\")  // Escape backslashes
    .replace(/'/g, "\\'")    // Escape single quotes
    .replace(/"/g, '\\"')    // Escape double quotes
    .replace(/\n/g, "\\n")   // Escape newlines
    .replace(/\r/g, "\\r")   // Escape carriage returns
    .replace(/\t/g, "\\t")   // Escape tabs
    .replace(/\./g, "\\.")   // Escape periods (used in regex)
    .replace(/:/g, "\\:")   // Escape periods (used in regex)
    .replace(/\+/g, "\\+")   // Escape plus (used in regex)
    .replace(/\*/g, "\\*")   // Escape asterisk (used in regex)
    .replace(/\?/g, "\\?")   // Escape question mark (used in regex)
    .replace(/\|/g, "\\|")   // Escape pipe (used in regex)
    .replace(/\$/g, "\\$")   // Escape dollar sign (used in regex)
    .replace(/\^/g, "\\^")   // Escape caret (used in regex)
    .replace(/\(/g, "\\(")   // Escape opening parenthesis (used in regex)
    .replace(/\)/g, "\\)")   // Escape closing parenthesis (used in regex)
    .replace(/\[/g, "\\[")   // Escape opening square bracket (used in regex)
    .replace(/\]/g, "\\]")   // Escape closing square bracket (used in regex)
    .replace(/\{/g, "\\{")   // Escape opening curly brace
    .replace(/\}/g, "\\}");  // Escape closing curly brace
}

export function flattenJSON(json) {
  const simplified = {};

  for (const key in json) {
    if (json[key] && typeof json[key] === "object" && "value" in json[key]) {
      simplified[key] = json[key].value;
    }
  }

  return simplified;
}

export class NotFoundError extends Error {
  constructor(message) {
    super(message); // Call the parent constructor with the message
    this.name = "Not Found"; // Set the error name
  }
}