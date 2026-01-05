import * as THREE from "three";
import { tileSize } from "./constants";
import { multipliers } from "./runState";

export function StopBollard(rowIndex?: number) {
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

  // Add multiplier text if rowIndex is provided
  if (rowIndex !== undefined) {
    const multiplierIndex = Math.max(0, Math.min(rowIndex - 1, multipliers.length - 1));
    const multiplier = multipliers[multiplierIndex];
    
    // Create canvas for text
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    canvas.width = 256;
    canvas.height = 128;
    
    // Set text properties
    context.fillStyle = '#ffffff';
    context.font = 'bold 48px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    
    // Add text shadow for better visibility
    context.shadowColor = '#000000';
    context.shadowBlur = 4;
    context.shadowOffsetX = 2;
    context.shadowOffsetY = 2;
    
    // Draw text
    const text = multiplier >= 0 ? `${multiplier}x` : `${multiplier}x`;
    context.fillText(text, canvas.width / 2, canvas.height / 2);
    
    // Create texture from canvas
    const texture = new THREE.CanvasTexture(canvas);
    texture.generateMipmaps = false;
    texture.minFilter = THREE.LinearFilter;
    
    // Create sprite material
    const spriteMaterial = new THREE.SpriteMaterial({ 
      map: texture,
      transparent: true
    });
    
    // Create sprite
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(25, 12.5, 1); // Slightly larger for better visibility
    sprite.position.set(20, 0, 18); // Position further in front for better visibility
    
    stopBollard.add(sprite);
  }

  return stopBollard;
}