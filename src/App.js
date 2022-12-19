import './App.css';
import { Hands } from '@mediapipe/hands';
import * as mediapipeHand from '@mediapipe/hands';
import * as cam from '@mediapipe/camera_utils';
import Webcam from 'react-webcam';
import { useRef, useEffect } from 'react';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  function onResults(results) {
    const videoWidth = webcamRef.current.video.videoWidth;
    const videoHeight = webcamRef.current.video.videoHeight;

    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;

    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext('2d');
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(
      results.image, 0, 0, canvasElement.width, canvasElement.height);
    if (results.multiHandLandmarks) {
      for (const landmarks of results.multiHandLandmarks) {
        drawConnectors(canvasCtx, landmarks, mediapipeHand.HAND_CONNECTIONS,
          { color: '#00FF00', lineWidth: 5 });
        drawLandmarks(canvasCtx, landmarks, { color: '#FF0000', lineWidth: 2 });
      }
    }
    canvasCtx.restore();
  }

  useEffect(() => {
    const hands = new Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      }
    });

    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      // selfieMode: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    hands.onResults(onResults)

    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null
    ) {
      const camera = new cam.Camera(webcamRef.current.video, {
        onFrame: async () => {
          await hands.send({ image: webcamRef.current.video });
        },
        width: 640,
        height: 480
      });
      camera.start();
    };
  }, []);

  return (
    <center>
      <div className="App">
        <Webcam
          ref={webcamRef}
          style={{
            position: 'absolute',
            marginRight: 'auto',
            marginLeft: 'auto',
            left: 0,
            right: 0,
            textAlign: 'center',
            zIndex: 9,
            width: 640,
            height: 480,
          }} />{" "}

        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            marginRight: 'auto',
            marginLeft: 'auto',
            left: 0,
            right: 0,
            textAlign: 'center',
            zIndex: 9,
            width: 640,
            height: 480,
          }}></canvas>
      </div >
    </center>
  );
}

export default App;
