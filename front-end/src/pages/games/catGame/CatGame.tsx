import { useEffect } from "react";
import * as THREE from "three";
import { Renderer } from "./catGameComponents/Renderer";
import { Camera } from "./catGameComponents/Camera";
import { player, initializePlayer } from "./catGameComponents/Player";
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

    const camera = Camera();
    player.add(camera);

    const scoreDOM = document.getElementById("score");
    const resultDOM = document.getElementById("result-container");

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
      animatePlayer();
      hitTest();
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
    <div>
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
    </div>
  );
}
