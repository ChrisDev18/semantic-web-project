// eslint-disable-next-line no-unused-vars
import React, {useState} from "react";
import {useParams} from "react-router-dom";

export default function Person() {
  // Get the passed id to a Person
  let { id } = useParams();

  return (
      <div>
          This is Person.jsx
      </div>
  );
};
