// eslint-disable-next-line no-unused-vars
import React, {useState} from "react";
import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";

export default function Series() {
    return (
        <div>
            This is series.jsx
  // Get the passed id to a Series
  let { id } = useParams();

  const [data, setData] = useState(undefined);

  // Asynchronous code to fetch required data
  useEffect(() => {
    setData({
      title: "A name",
      description: "The description",
      photo: ""
    })
  }, []);

  // When data has loaded
  return (
    <div>
      {/*Left side*/}
      <div>
      </div>

      {/*Right side*/}
      <div>

      </div>
    </div>
  );
};
