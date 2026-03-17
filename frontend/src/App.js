import React from "react";
import { BrowserRouter,Routes,Route } from "react-router-dom";

import Home from "./pages/Home";
import Prediction from "./pages/Prediction";
import NodeCreation from "./pages/NodeCreation";

function App(){

 return(

  <BrowserRouter>

    <Routes>

      <Route path="/" element={<Home/>}/>

      <Route path="/prediction" element={<Prediction/>}/>

      <Route path="/node-creation" element={<NodeCreation/>}/>

    </Routes>

  </BrowserRouter>

 );

}

export default App;