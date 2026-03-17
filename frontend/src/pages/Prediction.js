import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../config";

function Prediction(){

 const [predictions,setPredictions] = useState([]);

 useEffect(()=>{

   axios.get(config.PREDICTION_URL)
   .then(res=>setPredictions(res.data.predictions))
   .catch(err=>console.log(err));

 },[]);

 return(

  <div style={{padding:"40px"}}>

   <h1>Prediction Dashboard</h1>

   {predictions.map((p,i)=>(
     <p key={i}>
       {p.time} → Water Level {p.water_level} cm | Temp {p.temperature}°C
     </p>
   ))}

  </div>

 );

}

export default Prediction;