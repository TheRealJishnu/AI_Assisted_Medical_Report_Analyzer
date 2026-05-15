import { useState, useEffect } from "react";
// useEffect(() => {
//   fetchHistory();
// }, []);

function App() {

  const [hemoglobin, setHemoglobin] = useState("");
  const [wbc, setWbc] = useState("");
  const [platelets, setPlatelets] = useState("");
  const [glucose, setGlucose] = useState("");

  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  async function handlePredict() {

    const response = await fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        hemoglobin: parseFloat(hemoglobin),
        wbc: parseFloat(wbc),
        platelets: parseFloat(platelets),
        glucose: parseFloat(glucose)
      })
    });
    

    const data = await response.json();

    setResult(data);
    fetchHistory();
  }
  async function fetchHistory() {

    const response = await fetch("http://127.0.0.1:8000/history");

    const data = await response.json();

    setHistory(data);
  }
  useEffect(() => {
    fetchHistory();
  }, []);
  return (
    <div style={{ padding: "30px" }}>

      <h1>Medical Risk Predictor</h1>

      <div>
        <input
          type="number"
          placeholder="Hemoglobin"
          value={hemoglobin}
          onChange={(e) => setHemoglobin(e.target.value)}
        />
      </div>

      <br />

      <div>
        <input
          type="number"
          placeholder="WBC"
          value={wbc}
          onChange={(e) => setWbc(e.target.value)}
        />
      </div>

      <br />

      <div>
        <input
          type="number"
          placeholder="Platelets"
          value={platelets}
          onChange={(e) => setPlatelets(e.target.value)}
        />
      </div>

      <br />

      <div>
        <input
          type="number"
          placeholder="Glucose"
          value={glucose}
          onChange={(e) => setGlucose(e.target.value)}
        />
      </div>

      <br />

      <button onClick={handlePredict}>
        Predict
      </button>

      <br />
      <br />

      {result && (
        <div>
          <h2>Prediction Result</h2>

          <p>
            Risk Level: <strong>{result.risk_level}</strong>
          </p>

          <p>
            Confidence: <strong>{result.confidence}</strong>
          </p>
        </div>
      )}
      <h2>Prediction History</h2>

<table border="1" cellPadding="10">

  <thead>
    <tr>
      <th>ID</th>
      <th>Hemoglobin</th>
      <th>WBC</th>
      <th>Platelets</th>
      <th>Glucose</th>
      <th>Risk</th>
      <th>Confidence</th>
      <th>Timestamp</th>
    </tr>
  </thead>

  <tbody>

    {history.map((item) => (

      <tr key={item.id}>

        <td>{item.id}</td>
        <td>{item.hemoglobin}</td>
        <td>{item.wbc}</td>
        <td>{item.platelets}</td>
        <td>{item.glucose}</td>
        <td>{item.risk_level}</td>
        <td>{item.confidence}</td>
        <td>{item.timestamp}</td>

      </tr>

    ))}

  </tbody>

</table>

    </div>
  );
}

export default App;