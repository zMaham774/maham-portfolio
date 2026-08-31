"use client";

import { Canvas } from "@react-three/fiber";
import { type RefObject } from "react";
import * as THREE from "three";

type LightsVoidSceneProps = {
  lightRef: RefObject<THREE.SpotLight | null>;
  fogRef: RefObject<THREE.Fog | null>;
};

function VoidStage({ lightRef, fogRef }: LightsVoidSceneProps) {
  return (
    <>
      <color attach="background" args={["#050505"]} />
      <fog ref={fogRef} attach="fog" args={["#0d0b09", 8, 18]} />

      <ambientLight intensity={0.08} color="#17130d" />

      <spotLight
        ref={lightRef}
        position={[0, 1.8, 5.5]}
        angle={0.8}
        penumbra={1.1}
        intensity={0}
        distance={22}
        decay={2}
        color="#d7b16a"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0002}
      />

      <mesh position={[0, -1.2, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[42, 42]} />
        <meshStandardMaterial color="#090909" roughness={1} metalness={0.08} />
      </mesh>
    </>
  );
}

export default function LightsVoidScene({ lightRef, fogRef }: LightsVoidSceneProps) {
  return (
    <div className="absolute inset-0">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 1.5, 7], fov: 34 }}
      >
        <VoidStage lightRef={lightRef} fogRef={fogRef} />
      </Canvas>
    </div>
  );
}
