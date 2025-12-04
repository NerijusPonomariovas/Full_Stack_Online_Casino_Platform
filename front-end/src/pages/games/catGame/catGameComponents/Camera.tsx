import * as THREE from "three";

export function Camera() {
  const size = 200;
  const viewRatio = window.innerWidth / window.innerHeight;
  const width = viewRatio < 1 ? size : size * viewRatio;
  const height = viewRatio < 1 ? size / viewRatio : size;

  const camera = new THREE.OrthographicCamera(
    width / -2, // left
    width / 2, // right
    height / 2, // top
    height / -2, // bottom
    0, // near
    1280 // far
  );

  camera.up.set(0, 0, 1);
  camera.position.set(200, 0, 100);
  camera.lookAt(0, 0, 0);

  return camera;
}