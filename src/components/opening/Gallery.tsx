import { MeshReflectorMaterial } from "@react-three/drei";
import type {} from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";
import { Portals } from "./Portals";
import { LightStrip } from "./LightStrip";

export const WALL_X = 11;
const HALL_START = 52;
const HALL_END = -76;
const HALL_LEN = HALL_START - HALL_END;
const HALL_Z = (HALL_START + HALL_END) / 2;
const WALL_H = 11;

function WallSeams({ side, reveal }: { side: -1 | 1; reveal: number }) {
  const zs = useMemo(() => {
    const out: number[] = [];
    for (let z = HALL_START; z > HALL_END; z -= 4.5) out.push(z);
    return out;
  }, []);

  return (
    <group>
      {zs.map((z) => (
        <mesh key={z} position={[side * (WALL_X - 0.06), WALL_H / 2, z]}>
          <boxGeometry args={[0.02, WALL_H, 0.04]} />
          <meshStandardMaterial
            color="#1a2230"
            emissive="#2a3648"
            emissiveIntensity={0.35 * reveal}
            roughness={0.5}
            metalness={0.6}
          />
        </mesh>
      ))}
    </group>
  );
}

export function Gallery({ reveal, floor }: { reveal: number; floor: number }) {
  return (
    <group>
      {/* reflective floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, HALL_Z]}>
        <planeGeometry args={[WALL_X * 2, HALL_LEN]} />
        <MeshReflectorMaterial
          resolution={512}
          mixBlur={1}
          mixStrength={5 * floor}
          blur={[300, 90]}
          mirror={0.6}
          depthScale={0}
          minDepthThreshold={0.3}
          maxDepthThreshold={1.3}
          color="#05070b"
          metalness={0.85}
          roughness={0.32}
        />
      </mesh>

      {/* side walls — dark mirror panelling */}
      {([-1, 1] as const).map((side) => (
        <group key={side}>
          <mesh
            position={[side * WALL_X, WALL_H / 2, HALL_Z]}
            rotation={[0, side === -1 ? Math.PI / 2 : -Math.PI / 2, 0]}
          >
            <planeGeometry args={[HALL_LEN, WALL_H]} />
            <meshStandardMaterial
              color="#05070c"
              metalness={0.92}
              roughness={0.28}
              emissive="#0b1119"
              emissiveIntensity={0.25 * reveal}
              side={THREE.DoubleSide}
            />
          </mesh>
          <WallSeams side={side} reveal={reveal} />
        </group>
      ))}

      {/* ceiling — faint cold wash, like light through deep water */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, WALL_H, HALL_Z]}>
        <planeGeometry args={[WALL_X * 2, HALL_LEN]} />
        <meshStandardMaterial
          color="#060a12"
          metalness={0.4}
          roughness={0.85}
          emissive="#0b1a2e"
          emissiveIntensity={0.5 * reveal}
        />
      </mesh>
      <pointLight
        position={[0, WALL_H - 1.2, -20]}
        color="#4f7fb8"
        intensity={6 * reveal}
        distance={70}
        decay={2}
      />

      <LightStrip wallX={WALL_X} intensity={floor} length={HALL_LEN} zCenter={HALL_Z} />
      <Portals wallX={WALL_X} reveal={reveal} />

      {/* far end wall + distant focal aperture */}
      <mesh position={[0, WALL_H / 2, HALL_END]}>
        <planeGeometry args={[WALL_X * 2, WALL_H]} />
        <meshStandardMaterial color="#05070c" metalness={0.8} roughness={0.4} />
      </mesh>
    </group>
  );
}

export function FocalPoint({ glow }: { glow: number }) {
  return (
    <group position={[0, 3.2, HALL_END + 0.6]}>
      <mesh>
        <circleGeometry args={[1.55, 64]} />
        <meshBasicMaterial color="#FFF3D6" toneMapped={false} transparent opacity={glow} />
      </mesh>
      <mesh position={[0, 0, 0.08]}>
        <torusGeometry args={[1.9, 0.05, 12, 96]} />
        <meshBasicMaterial color="#C9A84C" toneMapped={false} transparent opacity={glow} />
      </mesh>
      <pointLight color="#FFE3AC" intensity={30 * glow} distance={60} decay={2} />
    </group>
  );
}
