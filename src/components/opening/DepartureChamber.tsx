"use client";

import { MeshReflectorMaterial } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";
import { useExhibitPalette } from "./exhibitMaterials";
import { DOOR_Z } from "./sequence";

const DOOR_W = 8;
const DOOR_H = 15;

/** Soft vertical gradient, used for the haze inside the doorway and its floor reflection. */
function useGradient(stops: [number, string][]) {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 4;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    const g = ctx.createLinearGradient(0, 0, 0, 256);
    stops.forEach(([o, c]) => g.addColorStop(o, c));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 4, 256);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

function Outline({ w, h, t, color, opacity }: { w: number; h: number; t: number; color: THREE.Color; opacity: number }) {
  const bars: [number, number, number, number][] = [
    [-w / 2, h / 2, t, h],
    [w / 2, h / 2, t, h],
    [0, h, w + t, t],
  ];
  return (
    <>
      {bars.map(([x, y, bw, bh], i) => (
        <mesh key={i} position={[x, y, 0]}>
          <boxGeometry args={[bw, bh, t]} />
          <meshBasicMaterial color={color} transparent opacity={opacity} toneMapped={false} />
        </mesh>
      ))}
    </>
  );
}

/** Final zone: one reflective floor, one golden doorway, an infinite dark beyond. */
export function DepartureChamber({ presence, door }: { presence: number; door: number }) {
  const c = useExhibitPalette();
  const haze = useGradient([
    [0, "rgba(201,168,76,0)"],
    [0.65, "rgba(201,168,76,0.18)"],
    [1, "rgba(242,216,162,0.55)"],
  ]);
  const streak = useGradient([
    [0, "rgba(242,216,162,0.9)"],
    [0.35, "rgba(201,168,76,0.35)"],
    [1, "rgba(201,168,76,0)"],
  ]);

  return (
    <group position={[0, 0, DOOR_Z]}>
      {/* the only reflective plane mounted at this point of the journey */}
      <mesh position={[0, 0, 40]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[220, 200]} />
        <MeshReflectorMaterial
          resolution={256}
          blur={[220, 60]}
          mixBlur={0.8}
          mixStrength={10 * presence}
          mirror={0.85}
          color={c.ink}
          metalness={0.6}
          roughness={0.5}
          depthScale={0.15}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.2}
        />
      </mesh>

      {/* doorway: crisp inner outline + a quieter echo */}
      <Outline w={DOOR_W} h={DOOR_H} t={0.08} color={c.light} opacity={door} />
      <group position={[0, 0, -0.4]}>
        <Outline w={DOOR_W + 1.4} h={DOOR_H + 0.7} t={0.03} color={c.gold} opacity={door * 0.35} />
      </group>

      {/* warm haze rising from the threshold, dark depth beyond */}
      <mesh position={[0, DOOR_H / 2, -0.2]}>
        <planeGeometry args={[DOOR_W, DOOR_H]} />
        <meshBasicMaterial map={haze} transparent opacity={door * 0.8} depthWrite={false} toneMapped={false} />
      </mesh>

      {/* the light spilling across the floor toward the visitor */}
      <mesh position={[0, 0.02, 22]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[DOOR_W * 0.9, 44]} />
        <meshBasicMaterial
          map={streak}
          transparent
          opacity={door * 0.45}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      <pointLight position={[0, 1.5, 2]} color={c.light} intensity={60 * door} distance={70} decay={2} />
      <ambientLight color={c.light} intensity={0.08 * presence} />
    </group>
  );
}
