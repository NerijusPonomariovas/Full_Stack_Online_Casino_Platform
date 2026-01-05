import * as THREE from "three";

export function ManholeCover() {
  const manholeCoverGroup = new THREE.Group();
    manholeCoverGroup.position.x = 0;
    
    // Manhole Cover (circular disk)
    const coverRadius = 10;
    const coverThickness = 3;

    // Create the disk for the cover
    const coverGeometry = new THREE.CylinderGeometry(coverRadius, coverRadius, coverThickness, 32);
    const coverMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 }); // Gray color for the cover
    const coverMesh = new THREE.Mesh(coverGeometry, coverMaterial);
    coverMesh.rotation.x = Math.PI / 2; // Rotate it so it's lying flat
    coverMesh.castShadow = true;
    coverMesh.receiveShadow = true;
    // Add the cover to the manhole cover group
    manholeCoverGroup.add(coverMesh);

    // Manhole Ring (the surrounding structure)
    const ringHeight = 2;
    const ringGeometry = new THREE.CylinderGeometry(coverRadius + 0.5, coverRadius + 0.5, ringHeight, 32);
    const ringMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 }); // Darker color for the ring
    const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.receiveShadow = true;
    ringMesh.castShadow = true;
    // Add the ring to the manhole cover group
    manholeCoverGroup.add(ringMesh);

    // Optional: Adding some details like holes on the cover (screw holes)
    const holeRadius = 1;
    const holeDepth = 3.2;

    // Create holes on the cover (four holes)
    const holeGeometry = new THREE.CylinderGeometry(holeRadius, holeRadius, holeDepth, 32);
    const holeMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 }); // Dark color for holes

    // Positions for the holes (around the edge of the cover)
    const holePositions = [
        [0, 7.5], [0, -7.5], [-7.5, 0], [7.5, 0],
        [5.5, 5.5], [5.5, -5.5], [-5.5, 5.5], [-5.5,-5.5]
    ];

    holePositions.forEach(position => {
        const holeMesh = new THREE.Mesh(holeGeometry, holeMaterial);
        holeMesh.rotation.x = Math.PI / 2;
        holeMesh.position.set(position[0], position[1], 0);
        manholeCoverGroup.add(holeMesh);
    });

    // Stripes on the manhole cover (horizontal and vertical stripes)

    const stripeMaterial = new THREE.MeshStandardMaterial({ color: 0x383838 }); // Darker stripes color
        const stripeMesh1 = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.75*coverRadius, 4), stripeMaterial);
        const stripeMesh2 = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.15*coverRadius, 4), stripeMaterial);
        const stripeMesh3 = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.75*coverRadius, 4), stripeMaterial);
        stripeMesh1.position.set(-4, 0, 0); // Position the stripes
        stripeMesh2.position.set(0, 0, 0); // Position the stripes        
        stripeMesh3.position.set(4, 0, 0); // Position the stripe
        stripeMesh1.name = 'stripeMesh1';
        stripeMesh2.name = 'stripeMesh2';
        stripeMesh3.name = 'stripeMesh3';
        manholeCoverGroup.add(stripeMesh1); // is virsaus i apacia eina 1 2 3 tie stripe'ai
        manholeCoverGroup.add(stripeMesh2);
        manholeCoverGroup.add(stripeMesh3);
    manholeCoverGroup.name="manholeCover";
    return manholeCoverGroup;
}