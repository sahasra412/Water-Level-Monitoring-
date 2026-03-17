import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../config";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

import "../App.css";

function Home() {

  const [waterLevel, setWaterLevel] = useState(0);
  const [temperature, setTemperature] = useState(0);
  const [history, setHistory] = useState([]);
  const [deviceStatus, setDeviceStatus] = useState("OFFLINE");

  const [input, setInput] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [predictionHistory, setPredictionHistory] = useState([]);

  const tankHeight = 200;

  const fetchData = async () => {
    try {
      const res = await axios.get(config.SENSOR_DATA_URL);
      const data = res.data;

      if (!data || data.length === 0) return;

      const latest = data[0];

      const distance = Number(latest.distance);
      const temp = Number(latest.temperature);

      const percent = Math.round(((tankHeight - distance) / tankHeight) * 100);

      setWaterLevel(percent);
      setTemperature(temp);

      const lastTime = new Date(latest.created_at);
      const now = new Date();
      const diff = (now - lastTime) / 1000;

      setDeviceStatus(diff > 10 ? "OFFLINE" : "LIVE");

      const chartData = data.slice(0, 10).map(d => ({
        time: new Date(d.created_at).toLocaleTimeString(),
        water: Math.round(((tankHeight - Number(d.distance)) / tankHeight) * 100),
        temp: Number(d.temperature)
      }));

      setHistory(chartData.reverse());

    } catch (err) {
      console.log(err);
      setDeviceStatus("OFFLINE");
    }
  };

  const fetchPredictionHistory = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/history");
      setPredictionHistory(res.data.history.slice(0, 10).reverse());
    } catch (err) {
      console.log(err);
    }
  };

  const handlePredict = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/predict", {
        input: input
      });

      setPrediction(res.data.prediction);
      fetchPredictionHistory();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchPredictionHistory();

    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  let status = "NORMAL";
  let alertMessage = "";

  if (waterLevel < 20) {
    status = "LOW";
    alertMessage = "⚠ Water Level Low!";
  }

  if (waterLevel > 90) {
    status = "FULL";
    alertMessage = "⚠ Tank Almost Full!";
  }

  return (

    <div className="dashboard">

      <h1 className="title">🚰 Smart IoT Dashboard</h1>

      <div className={`device-status ${deviceStatus.toLowerCase()}`}>
        {deviceStatus === "LIVE" ? "🟢 DEVICE LIVE" : "🔴 DEVICE OFFLINE"}
      </div>

      {alertMessage && <div className="alert-box">{alertMessage}</div>}

      <div className="top-section">

        <div className="card">
          <h3>Water Level</h3>
          <div className="tank">
            <div className="water" style={{ height: `${waterLevel}%` }}>
              <div className="wave"></div>
            </div>
          </div>
          <h2 className="value">{waterLevel}%</h2>
        </div>

        <div className="card">
          <h3>Temperature</h3>
          <div className="temp-display">🌡 {temperature}°C</div>
        </div>

        <div className="card">
          <h3>Status</h3>
          <div className={`status ${status.toLowerCase()}`}>
            {status}
          </div>
        </div>

        <div className="card">
          <h3>Prediction</h3>

          <input
            type="number"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter value"
            style={{ padding: "10px", width: "80%", marginBottom: "10px" }}
          />

          <button onClick={handlePredict} style={{ padding: "10px 20px" }}>
            Predict
          </button>

          {prediction !== null && (
            <h3 style={{ marginTop: "10px" }}>Result: {prediction}</h3>
          )}
        </div>

      </div>

      {/* ✅ CLEAN MODEL INFO */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <h3>Model: Linear Regression</h3>
      </div>

      <div className="charts">

        <div className="chart-card">
          <h3>Water History</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="water" stroke="#38bdf8" strokeWidth={4} dot={false}/>
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Temperature History</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="temp" stroke="#fb7185" strokeWidth={4} dot={false}/>
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Prediction History</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={predictionHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="created_at" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="predicted_value" stroke="#22c55e" strokeWidth={4}/>
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>

    </div>
  );
}

export default Home;