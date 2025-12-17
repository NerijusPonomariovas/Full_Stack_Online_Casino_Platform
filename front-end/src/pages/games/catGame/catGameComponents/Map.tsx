import type { Row } from "./types";
import * as THREE from "three";
import { generateRows } from "./generateRows";
import { Grass } from "./Grass";
import { Road } from "./Road";
import { Car } from "./Car";
import { Truck } from "./Truck";
import { StopBollard } from "./StopBollard";
import { tileSize } from "./constants";
export const metadata: Row[] = [];

export const updatedRows = new Set<number>();

export const map = new THREE.Group();

export function initializeMap() {
  // Remove all rows
  metadata.length = 0;
  updatedRows.clear();
  updatedRows.add(0);
  map.remove(...map.children);

  for (let rowIndex = 0; rowIndex > -1; rowIndex--) {
    const grass = Grass({rowIndex});
    map.add(grass);
  }
  addRows();
}

export function addRows() {
  const newMetadata = generateRows(20);

  const startIndex = metadata.length;
  metadata.push(...newMetadata);

  newMetadata.forEach((rowData, index) => {
    const rowIndex = startIndex + index + 1;

    if (rowData.type === "car") {
      const row = Road(rowIndex);

      rowData.vehicles.forEach((vehicle) => {
        const car = Car(
          vehicle.initialTileIndex,
          rowData.direction,
          vehicle.color
        );
        vehicle.ref = car;
        row.add(car);
      });

      map.add(row);
    }

    if (rowData.type === "truck") {
      const row = Road(rowIndex);

      rowData.vehicles.forEach((vehicle) => {
        const truck = Truck(
          vehicle.initialTileIndex,
          rowData.direction,
          vehicle.color
        );
        vehicle.ref = truck;
        row.add(truck);
      });

      map.add(row);
    }
  });
}

function hasVehicles(row: Row): row is (
  | { type: "car"; direction: boolean; speed: number; vehicles: { initialTileIndex: number; color: THREE.ColorRepresentation; ref?: THREE.Object3D }[] }
  | { type: "truck"; direction: boolean; speed: number; vehicles: { initialTileIndex: number; color: THREE.ColorRepresentation; ref?: THREE.Object3D }[] }
) {
  return row.type === "car" || row.type === "truck";
}

export function updateRow(rowData: any, rowIndex: number) {
  // Check if the row has already been updated
  if (updatedRows.has(rowIndex)) return;

  // Remove the old row if it exists
  const existingRow = map.children.find((child: any) => child.position.y === rowIndex * tileSize);
  if (existingRow) {
    map.remove(existingRow);  // Remove the existing row
  }
  // Check if the row has vehicles before attempting to access `vehicles`
  const row = metadata[rowIndex-1];
  if (hasVehicles(row)) {
  row.vehicles.forEach(vehicle => {
    if(vehicle.ref){
      map.remove(vehicle.ref);
      vehicle.ref = undefined;
      console.log("removed!");
    }
  });
}

  metadata[rowIndex-1].type = "stopBollard";
  // Create a new road row
  const newRow = Road(rowIndex);

  // Add stop bollard to the new row
  const stopBollard = StopBollard();
  stopBollard.position.set(-42, 0, 0); // Adjust position of stop bollard
  newRow.add(stopBollard);

  // Add the new row to the map
  map.add(newRow);

  // Mark this row as updated
  updatedRows.add(rowIndex);
}