import React from "react";
import { useState, useEffect } from "react";


export function Fetch({ type,route }) {
  
    const [data, setData] = useState([]);
  
    useEffect(() => {
      fetch(`http://localhost:3331/${route}`)
        .then(resp => resp.json())
        .then(data => {
          setData(data);
        })
        .catch(err => {
          console.log(err)
        });
    }, [type]);
  
    return data;
  }