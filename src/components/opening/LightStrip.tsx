import type {} from "@react-three/fiber";

/** Continuous emissive ribbon where the walls meet the floor. */
export function LightStrip({
  wallX,
  intensity,
  length = 190,
  zCenter = -20,
}: {
  wallX: number;
  intensity: number;
  length?: number;
  zCenter?: number;
}) {
  const lights = [16, -22, -60];

  return (
    <group>
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh
            position={[side * (wallX - 0.12), 0.2, zCenter]}
            rotation={[0, side === -1 ? Math.PI / 2 : -Math.PI / 2, 0]}
          >
            <planeGeometry args={[length, 0.16]} />
            <meshBasicMaterial
              color="#E8CE92"
              toneMapped={false}
              opacity={0.5 * intensity}
              transparent
            />
          </mesh>
          {lights.map((z) => (
            <pointLight
              key={z}
              position={[side * (wallX - 1.2), 0.6, z]}
              color="#FFDFA6"
              intensity={7 * intensity}
              distance={20}
              decay={2}
            />
          ))}
        </group>
      ))}
    </group>
  );
}
