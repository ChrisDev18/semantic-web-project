import React, {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {fetchSeriesData} from "../lib/series.js";
import {NotFoundError} from "../lib/constants.js";

export default function Series() {
  // Get the passed id to a Series
  let {id} = useParams();
  const nav = useNavigate();

  const [data, setData] = useState({});
  const [error, setError] = useState(null);

  // Asynchronous code to fetch required data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const series = await fetchSeriesData(decodeURIComponent(id)); // Call the fetch function
        console.log(series);
        setData(series); // Update the state with fetched data
      } catch (error) {
        if (error instanceof NotFoundError)
          return nav("/notfound", {replace: true});
        setError(error.message); // If there's an error, set the error message
      }
    };
    fetchData().then(); // Fetch the data when the component mounts
  }, [id]); // Empty dependency array means this effect runs once when the component mounts

  if (error) {
    return <div>Error: {error}</div>; // Display error if there's any
  }

  // When data has loaded
  return (
    <div className={"p-6"}>
      <h1 className={"italic"}>Video game series</h1>
      {!data.label ? (
        <div>Loading...</div>
      ) : (
        <div className={"flex flex-col gap-2"}>
          <h2 className={"text-3xl font-bold"}>{data.label}</h2>

          <p>{data.comment}</p>

          <div>
            <p className={"font-medium"}>Games in series</p>
            {data.games ? (
              <ul className={"list-disc pl-6 space-y-1"}>
                {data.games.map((game, i) =>
                  <li key={i}>
                    <Link
                      className={"text-blue-400 hover:text-blue-500 focus:text-blue-500 focus:outline-none hover:underline active:underline focus:underline focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"}
                      to={"/videoGame/" + encodeURIComponent(game)}>
                      {game}
                    </Link>
                  </li>
                )}
              </ul>
            ) : (
              <p>N/A</p>
            )}
          </div>

          <div>
            <p className={"font-medium"}>Genres</p>
            {data.genres ? (
              <ul className={"list-disc pl-6 space-y-1"}>
                {data.genres.map((genre, i) =>
                  <li key={i}>
                    {genre}
                  </li>
                )}
              </ul>
            ) : (
              <p>N/A</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
