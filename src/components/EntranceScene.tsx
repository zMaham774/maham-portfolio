"use client";

import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

function VoidLight() {
  const lightRef = useRef<THREE.PointLight>(null);

  return (
    <>
      <fog attach="fog" args={["#0a0a0d", 2, 15]} />
      <pointLight
        ref={lightRef}
        position={[0, 0, 0]}
        intensity={0}
        distance={10}
        color="#c9a84c"
      />
    </>
  );
}

export default function EntranceScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 50 }}
      style={{ background: "#0a0a0d" }}
    >
      <VoidLight />
    </Canvas>
  );
}