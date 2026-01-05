import * as THREE from "three";
import { tilesPerRow, tileSize } from "./constants";
import { ManholeCover } from "./manholeCover";

export function Road(rowIndex: number) {
  const road = new THREE.Group();
  road.position.y = rowIndex * tileSize;
  road.name="road";
  const foundation = new THREE.Mesh(
    new THREE.PlaneGeometry(tilesPerRow * tileSize, tileSize),
    new THREE.MeshLambertMaterial({ color: 0x102c56 })
  );
  foundation.receiveShadow = true;
  road.add(ManholeCover());
  road.add(foundation);

  return road;
}