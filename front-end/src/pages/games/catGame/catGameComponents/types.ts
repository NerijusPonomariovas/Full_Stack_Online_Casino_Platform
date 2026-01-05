import * as THREE from "three";

export type RowType = "car" | "truck" | "stopBollard";

export type Row =
  | {
    type: "stopBollard";
  }
  | {
      type: "car";
      direction: boolean;
      speed: number;
      vehicles: {
        initialTileIndex: number;
        color: THREE.ColorRepresentation;
        ref?: THREE.Object3D;
      }[];
    }
  | {
      type: "truck";
      direction: boolean;
      speed: number;
      vehicles: {
        initialTileIndex: number;
        color: THREE.ColorRepresentation;
        ref?: THREE.Object3D;
      }[];
    };

export type MoveDirection = "forward" | "backward" /* | "left" | "right" */;