import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

const WebcamFeed = () => {
  const webcamRef = useRef(null);
  const [feedback, setFeedback] = useState("Scanning your workspace...");

  const captureFrame = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    try {
      const response = await axios.post(
        `https://detect.roboflow.com/YOUR_MODEL_NAME/1`,
        imageSrc,
        {
          params: {
            api_key: process.env.REACT_APP_ROBOFLOW_API_KEY
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      const predictions = response.data.predictions;
      if (predictions.length > 0) {
        setFeedback(`Clutter Level: ${predictions.length} distractions detected`);
      } else {
        setFeedback("Zen Mode: No distractions found 🧘");
      }
    } catch (error) {
      console.error("Detection error:", error);
      setFeedback("Error scanning workspace.");
    }
  };

  useEffect(() => {
    const interval = setInterval(captureFrame, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={640}
        height={480}
      />
      <p>{feedback}</p>
    </div>
  );
};

export default WebcamFeed;
