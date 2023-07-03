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

    if (results.multiHandedness[0] !== undefined) {
      if (results.multiHandedness[0].label === 'Left'
        && results.multiHandLandmarks[0] !== undefined
        && results.multiHandLandmarks[0][4].x > results.multiHandLandmarks[0][3].x > results.multiHandLandmarks[0][2].x > results.multiHandLandmarks[0][1].x
        && results.multiHandLandmarks[0][8].x > results.multiHandLandmarks[0][7].x > results.multiHandLandmarks[0][6].x > results.multiHandLandmarks[0][5].x
        && results.multiHandLandmarks[0][12].x > results.multiHandLandmarks[0][11].x > results.multiHandLandmarks[0][10].x > results.multiHandLandmarks[0][9].x
        && results.multiHandLandmarks[0][16].x > results.multiHandLandmarks[0][15].x > results.multiHandLandmarks[0][14].x > results.multiHandLandmarks[0][13].x
        && results.multiHandLandmarks[0][20].x > results.multiHandLandmarks[0][19].x > results.multiHandLandmarks[0][18].x > results.multiHandLandmarks[0][17].x
        && results.multiHandLandmarks[0][4].y < results.multiHandLandmarks[0][3].y < results.multiHandLandmarks[0][2].y < results.multiHandLandmarks[0][1].y
        && results.multiHandLandmarks[0][8].y < results.multiHandLandmarks[0][7].y < results.multiHandLandmarks[0][6].y < results.multiHandLandmarks[0][5].y
        && results.multiHandLandmarks[0][12].y < results.multiHandLandmarks[0][11].y < results.multiHandLandmarks[0][10].y < results.multiHandLandmarks[0][9].y
        && results.multiHandLandmarks[0][16].y < results.multiHandLandmarks[0][15].y < results.multiHandLandmarks[0][14].y < results.multiHandLandmarks[0][13].y
        && results.multiHandLandmarks[0][20].y < results.multiHandLandmarks[0][19].y < results.multiHandLandmarks[0][18].y < results.multiHandLandmarks[0][17].y
      ) {
        console.log("left hand is raise");
      }

      if (results.multiHandedness[0].label === 'Right'
        && results.multiHandLandmarks[0] !== undefined
        && results.multiHandLandmarks[0][4].x < results.multiHandLandmarks[0][3].x < results.multiHandLandmarks[0][2].x < results.multiHandLandmarks[0][1].x
        && results.multiHandLandmarks[0][8].x < results.multiHandLandmarks[0][7].x < results.multiHandLandmarks[0][6].x < results.multiHandLandmarks[0][5].x
        && results.multiHandLandmarks[0][12].x < results.multiHandLandmarks[0][11].x < results.multiHandLandmarks[0][10].x < results.multiHandLandmarks[0][9].x
        && results.multiHandLandmarks[0][16].x < results.multiHandLandmarks[0][15].x < results.multiHandLandmarks[0][14].x < results.multiHandLandmarks[0][13].x
        && results.multiHandLandmarks[0][20].x < results.multiHandLandmarks[0][19].x < results.multiHandLandmarks[0][18].x < results.multiHandLandmarks[0][17].x
        && results.multiHandLandmarks[0][4].y < results.multiHandLandmarks[0][3].y < results.multiHandLandmarks[0][2].y < results.multiHandLandmarks[0][1].y
        && results.multiHandLandmarks[0][8].y < results.multiHandLandmarks[0][7].y < results.multiHandLandmarks[0][6].y < results.multiHandLandmarks[0][5].y
        && results.multiHandLandmarks[0][12].y < results.multiHandLandmarks[0][11].y < results.multiHandLandmarks[0][10].y < results.multiHandLandmarks[0][9].y
        && results.multiHandLandmarks[0][16].y < results.multiHandLandmarks[0][15].y < results.multiHandLandmarks[0][14].y < results.multiHandLandmarks[0][13].y
        && results.multiHandLandmarks[0][20].y < results.multiHandLandmarks[0][19].y < results.multiHandLandmarks[0][18].y < results.multiHandLandmarks[0][17].y
      ) {
        console.log("right hand is raise");
      }
    }
  // console.log(results.multiHandLandmarks);
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
      selfieMode: true,
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
            height: 480898000,
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
