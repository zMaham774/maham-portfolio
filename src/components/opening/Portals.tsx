import { useMemo } from "react";
import type {} from "@react-three/fiber";
import * as THREE from "three";

const GOLD = "#C9A84C";
const RIM = "#F7E7BE";

export type PortalDef = {
  z: number;
  side: -1 | 1;
  radius: number;
  y: number;
};

/** Non-uniform rhythm down both walls so the hall never reads as a loop. */
export const PORTALS: PortalDef[] = [
  { z: 26, side: -1, radius: 2.6, y: 3.1 },
  { z: 19, side: 1, radius: 1.5, y: 2.6 },
  { z: 12, side: -1, radius: 1.9, y: 2.8 },
  { z: 6, side: 1, radius: 2.7, y: 3.2 },
  { z: -2, side: -1, radius: 2.9, y: 3.3 },
  { z: -8, side: 1, radius: 1.6, y: 2.5 },
  { z: -16, side: -1, radius: 1.7, y: 2.7 },
  { z: -22, side: 1, radius: 2.5, y: 3.0 },
  { z: -31, side: -1, radius: 2.2, y: 2.9 },
  { z: -38, side: 1, radius: 2.8, y: 3.2 },
  { z: -48, side: -1, radius: 1.8, y: 2.7 },
  { z: -56, side: 1, radius: 2.1, y: 2.9 },
];

function Portal({
  def,
  wallX,
  reveal,
}: {
  def: PortalDef;
  wallX: number;
  reveal: number;
}) {
  const { z, side, radius, y } = def;
  const rot: [number, number, number] = [0, side === -1 ? Math.PI / 2 : -Math.PI / 2, 0];
  const x = side * (wallX - 0.05);

  // Portals nearer the camera start fade in slightly earlier.
  const local = THREE.MathUtils.clamp(reveal * 1.15 - (1 - (z + 60) / 120) * 0.25, 0, 1);

  return (
    <group position={[x, y, z]} rotation={rot} scale={[1, 0.86, 1]}>
      {/* recessed aperture — dark, faintly reflective */}
      <mesh position={[0, 0, -0.55]}>
        <circleGeometry args={[radius * 0.82, 64]} />
        <meshStandardMaterial
          color="#10161f"
          metalness={0.9}
          roughness={0.22}
          emissive="#1b2a3d"
          emissiveIntensity={0.3 * local}
        />
      </mesh>

      {/* glowing scoop / inner sleeve */}
      <mesh position={[0, 0, -0.28]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[radius * 0.9, radius * 0.98, 0.62, 64, 1, true]} />
        <meshStandardMaterial
          color={RIM}
          emissive={RIM}
          emissiveIntensity={1.7 * local}
          roughness={0.42}
          side={THREE.BackSide}
        />
      </mesh>

      {/* thick outer rim */}
      <mesh position={[0, 0, 0.04]}>
        <torusGeometry args={[radius, radius * 0.13, 20, 96]} />
        <meshStandardMaterial
          color={RIM}
          emissive={RIM}
          emissiveIntensity={1.15 * local}
          roughness={0.35}
          metalness={0.15}
        />
      </mesh>

      {/* thin gold accent ring */}
      <mesh position={[0, 0, 0.16]}>
        <torusGeometry args={[radius * 1.14, radius * 0.018, 12, 96]} />
        <meshStandardMaterial
          color={GOLD}
          emissive={GOLD}
          emissiveIntensity={1.6 * local}
          roughness={0.3}
        />
      </mesh>

    </group>
  );
}

export function Portals({ wallX, reveal }: { wallX: number; reveal: number }) {
  const list = useMemo(() => PORTALS, []);
  return (
    <group>
      {list.map((d, i) => (
        <Portal key={i} def={d} wallX={wallX} reveal={reveal} />
      ))}
    </group>
  );
}
