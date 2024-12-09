import React, {useState} from "react";
import {getVideoGameSeriesByName} from "../lib/series.js";

export default function SeriesPage() {
  const [details, setDetails] = useState(undefined);

  async function getSeries() {
    try {
      const data = await getVideoGameSeriesByName("Zelda")
      setDetails(data);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="flex flex-col flex-grow gap-4 p-10 text-center">
      <h1 className={"text-2xl font-semibold"}>Série de jeux vidéo</h1>
      <button className="px-2 py-2 bg-blue-500 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-700 hover:bg-blue-600 active:bg-blue-700 disabled:bg-gray-400 disabled:text-gray-600"
              onClick={getSeries}>
        Get show details
      </button>
    </div>
  );
};
