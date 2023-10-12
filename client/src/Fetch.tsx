import React from "react";
import { useState, useEffect } from "react";

export function Fetch({ type, route }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3331/${route}`, {
      credentials: "include", 
    })
      .then((resp) => resp.json())
      .then((data) => {
        setData(data);
      })
      .catch((err) => {
        // Handle errors here
        console.error(err);
      });
  }, [type]);

  return data;
}
