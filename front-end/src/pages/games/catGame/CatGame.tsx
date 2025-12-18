import { useEffect } from "react";
import * as THREE from "three";
import { Renderer } from "./catGameComponents/Renderer";
import { Camera } from "./catGameComponents/Camera";
import { player, initializePlayer, position } from "./catGameComponents/Player";
import { map, initializeMap } from "./catGameComponents/Map";
import { DirectionalLight } from "./catGameComponents/DirectionalLight";
import { animateVehicles } from "./catGameComponents/animateVehicles";
import { animatePlayer } from "./catGameComponents/animatePlayer";
import { hitTest } from "./catGameComponents/hitTest";
import "./catGameComponents/collectUserInput";
import "./catGameComponents/cat.css";

export default function Cat() {
  useEffect(() => {
    // Scene setup AFTER React has rendered the <canvas>
    const scene = new THREE.Scene();
    scene.add(player);
    scene.add(map);

    const ambientLight = new THREE.AmbientLight();
    scene.add(ambientLight);

    const dirLight = DirectionalLight();
    dirLight.target = player;
    player.add(dirLight);

    const scoreDOM = document.getElementById("score");
    const resultDOM = document.getElementById("result-container");

    const camera = Camera();
    //player.add(camera);

    function initializeGame() {
      initializePlayer();
      initializeMap();
      if (scoreDOM) scoreDOM.innerText = "0";
      if (resultDOM) resultDOM.style.visibility = "hidden";
    }

    initializeGame();

    const renderer = Renderer(); // ✅ now works because canvas exists

    const animate = () => {
      animateVehicles();
      hitTest();
      animatePlayer();
      

      if (position.currentRow >= 4) {
      // Example offsets; adjust to taste
      const offsetX = 200;
      const offsetY = 0; // behind the player
      const offsetZ = 150;  // above the player

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

    document.querySelector("#retry")?.addEventListener("click", initializeGame);

    // ✅ Optional cleanup
    return () => {
      renderer.dispose();
      document.querySelector("#retry")?.removeEventListener("click", initializeGame);
    };
  }, []);

  return (
    <div className="w-full h-full">
      <canvas className="game"></canvas>
      <div id="controls">
        <div>
          <button id="forward">▲</button>
          <button id="left">◀</button>
          <button id="backward">▼</button>
          <button id="right">▶</button>
        </div>
      </div>
      <div id="score">0</div>
      <div id="result-container">
        <div id="result">
          <h1>Game Over!</h1>
          <p>Score: <span id="final-score">0</span></p>
          <button id="retry">Retry</button>
        </div>
      </div>
    </div>
  );
}
