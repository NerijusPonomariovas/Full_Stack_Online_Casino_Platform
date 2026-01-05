import { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import { Renderer } from "./catGameComponents/Renderer";
import { Camera } from "./catGameComponents/Camera";
import { player, initializePlayer, position, queueMove } from "./catGameComponents/Player";
import { map, initializeMap } from "./catGameComponents/Map";
import { DirectionalLight } from "./catGameComponents/DirectionalLight";
import { animateVehicles } from "./catGameComponents/animateVehicles";
import { animatePlayer } from "./catGameComponents/animatePlayer";
import { hitTest } from "./catGameComponents/hitTest";
//import "./catGameComponents/collectUserInput";
import "./catGameComponents/cat.css";

export default function Cat() {
  const initializeGameRef = useRef<() => void>(() => {});

  useEffect(() => {
    let inputEnabled = true;
    const onKeyDown = (event: KeyboardEvent) => {
      if(!inputEnabled) return;
      if (event.key === "ArrowRight") {
        event.preventDefault();
        queueMove("forward");
      }
    };

    const onGameOver = () => {
      inputEnabled = false; // disables controls instantly
    };

    window.addEventListener("game:over", onGameOver);

    window.addEventListener("keydown", onKeyDown);

    // Scene setup AFTER React has rendered the <canvas>
    const scene = new THREE.Scene();
    scene.add(player);
    scene.add(map);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const dirLight = DirectionalLight();
    dirLight.target = player;
    player.add(dirLight);

    const camera = Camera();
    //player.add(camera);

    function initializeGame() {
      initializePlayer();
      initializeMap();
      inputEnabled = true;
      const scoreDOM = document.getElementById("score");
      const resultDOM = document.getElementById("result-container");
      if (scoreDOM) scoreDOM.innerText = "0";
      if (resultDOM) resultDOM.style.visibility = "hidden";
    }

    initializeGameRef.current = initializeGame;  

    initializeGame();

    const {renderer, dispose} = Renderer(); // ✅ now works because canvas exists

    const animate = () => {
      animateVehicles();
      hitTest();
      animatePlayer();
      
      // Example offsets; adjust to taste
      const offsetX = 200;
      const offsetY = 0; // behind the player
      const offsetZ = 150;  // above the player
      if (position.currentRow >= 7) {
        camera.up.set(0,0,1);
        camera.lookAt(0,294,0);
        camera.position.set(200,294,150);
      } else if(position.currentRow >= 4){
        camera.position.set(
          player.position.x + offsetX,
          player.position.y + offsetY,
          player.position.z + offsetZ
        );
        camera.lookAt(player.position.x, player.position.y, player.position.z);
      } else {
        camera.up.set(0,0,1);
        camera.lookAt(0,168,0);
        camera.position.set(200, 168, 150);
      }

      renderer.render(scene, camera);
    };

    renderer.setAnimationLoop(animate);

//document.querySelector("#retry")?.addEventListener("click", initializeGame);

// In cleanup:
return () => {
  window.removeEventListener("game:over", onGameOver);
  window.removeEventListener("keydown", onKeyDown);
  player.remove(dirLight);
  scene.remove(ambientLight);
  scene.remove(player);
  scene.remove(map);
  renderer.setAnimationLoop(null);
  dispose();
  //document.querySelector("#retry")?.removeEventListener("click", initializeGame);
};
  }, []);

  const onRetry = useCallback(() => {
    initializeGameRef.current();
  }, []);

  return (
    <div className="w-full h-full">
      <canvas className="game"></canvas>
      <div id="controls">
        <div>
          {/* <button id="left">◀</button> */}
          <button id="forward" onClick={() => queueMove("forward")}>▶</button>
        </div>
      </div>
      <div id="score">0</div>
      <div id="result-container">
        <div id="result">
          <h1>Game Over!</h1>
          <p>Score: <span id="final-score">0</span></p>
          <button id="retry" onClick={onRetry}>Retry</button>
        </div>
      </div>
    </div>
  );
}
