import * as THREE from "three";
import { tileSize } from "./constants";

export function StopBollard() {
  const stopBollard = new THREE.Group();
  stopBollard.position.x = -tileSize;
  
  // Create the large wooden beam (horizontal part)
  const beam = new THREE.Mesh(
    new THREE.BoxGeometry(2, 20, 5), // Length, Height, Depth
    new THREE.MeshLambertMaterial({
      color: 0x8b4513, // Brown color to simulate wood
      flatShading: true,
    })
  );
  beam.position.set(0, 0, 11); // Positioned in the middle
  beam.castShadow = true;
  stopBollard.add(beam);

  // Create the support pillars (vertical parts)
  const pillarGeometry = new THREE.BoxGeometry(2, 2, 15); // Thickness, Height, Depth
  const pillarMaterial = new THREE.MeshLambertMaterial({
    color: 0x8b4513, // Same wood color
    flatShading: true,
  });

  // Left Pillar
  const leftPillar = new THREE.Mesh(pillarGeometry, pillarMaterial);
  leftPillar.position.set(5, -10, 10); // Adjust position for left pillar
  leftPillar.castShadow = true;
  stopBollard.add(leftPillar);

  // Right Pillar
  const rightPillar = new THREE.Mesh(pillarGeometry, pillarMaterial);
  rightPillar.position.set(5, 10, 10); // Adjust position for right pillar
  rightPillar.castShadow = true;
  stopBollard.add(rightPillar);

  return stopBollard;
}