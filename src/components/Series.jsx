// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import {fetchSeriesData} from "../lib/series.js";

export default function Series() {
  // Get the passed id to a Series
  let { id } = useParams();

  const [data, setData] = useState(undefined);
  const [error, setError] = useState(null);

  // Asynchronous code to fetch required data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const series = await fetchSeriesData(id); // Call the fetch function
        console.log(series);
        setData(series); // Update the state with fetched data
      } catch (error) {
        setError(error.message); // If there's an error, set the error message
      }
    };
    fetchData().then(); // Fetch the data when the component mounts
  }, []); // Empty dependency array means this effect runs once when the component mounts

  if (error) {
    return <div>Error: {error}</div>; // Display error if there's any
  }

  // When data has loaded
  return (
    <div>
      {/*Left side*/}
      <div>
        <h1>{data?.name ?? <Skeleton />}</h1>
        <p>{data?.comment ?? <Skeleton />}</p>
      </div>

      {/*Right side*/}
      <div>
        <ul>
          {data?.games ?? <Skeleton/>}
        </ul>
      </div>
    </div>
  );
};
