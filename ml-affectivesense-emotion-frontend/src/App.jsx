import { useState } from "react";
import Webcam from "react-webcam";
import "./styles/globals.css";
import "./styles/glass.css";

function App() {
  const [emotion, setEmotion] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [loading, setLoading] = useState(false);

  const webcamRef = React.useRef(null);

  const captureFrame = async () => {
    if (!webcamRef.current) return;

    setLoading(true);

    const imageSrc = webcamRef.current.getScreenshot();

    try {
      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageSrc }),
      });

      const data = await response.json();
      setEmotion(data.emotion);
      setConfidence(data.confidence);
    } catch (error) {
      console.error("Prediction error:", error);
    }

    setLoading(false);
  };

  return (
    <div className="app-container">
      <header className="glass-card header">
        <h1>AffectiveSense</h1>
        <p>AI‑Powered Emotion Detection</p>
      </header>

      <div className="glass-card webcam-card">
        <Webcam
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="webcam"
        />
        <button className="detect-btn" onClick={captureFrame}>
          {loading ? "Analyzing..." : "Detect Emotion"}
        </button>
      </div>

      {emotion && (
        <div className="glass-card result-card">
          <h2>Detected Emotion</h2>
          <p className="emotion">{emotion}</p>
          <p className="confidence">Confidence: {confidence}</p>
        </div>
      )}
    </div>
  );
}

export default App;
