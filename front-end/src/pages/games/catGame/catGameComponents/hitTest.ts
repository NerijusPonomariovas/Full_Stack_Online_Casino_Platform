import * as THREE from "three";
import { metadata as rows } from "./Map";
import { player, position } from "./Player";
import { updateWalletBalance } from "../../../../api/auth";

//let resultDOM: HTMLElement | null = null;
//let finalScoreDOM: HTMLElement | null = null;

export function hitTest() {
  const resultDOM = document.getElementById("result-container");
  const finalScoreDOM = document.getElementById("final-score");

  const row = rows[position.currentRow - 1];
  if (!row) return;

  // Check if the row has vehicles (and if they are visible)
  if (row.type === "car" || row.type === "truck") {
    const playerBoundingBox = new THREE.Box3();
    playerBoundingBox.setFromObject(player);

    row.vehicles.forEach(({ ref }) => {
      if (!ref || !ref.visible) return;  // Skip invisible vehicles

      const vehicleBoundingBox = new THREE.Box3();
      vehicleBoundingBox.setFromObject(ref);
      if (playerBoundingBox.intersectsBox(vehicleBoundingBox)) {
        if (!resultDOM || !finalScoreDOM) return;
        resultDOM.style.visibility = "visible";
        finalScoreDOM.innerText = position.currentRow.toString();
        const addScore = position.currentRow.toString();
        updateWalletBalance(addScore, "win");
        setTimeout(() => {
          window.dispatchEvent(new Event("balance:refresh"));
        }, 50);
        console.log(position.currentRow)
        console.log("hit!");
      }
    });
  }
}
