import type { } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";

export const CHAMBER_Z = -128;
/** angular half-gap in the drum where the corridor enters (facing +Z) */
const ENTRY_GAP = 0.5;
export const CHAMBER_R = 30;
const CHAMBER_H = 17;

const GOLD = "#C9A84C";
const WARM = "#FFE3AC";

/** Thin vertical light lines + heavier ribs, arranged in radial layers. */
function RadialStructure({ p }: { p: number }) {
    const lines = useMemo(() => {
        const out: { a: number; r: number; h: number; w: number }[] = [];
        const layers = [
            { r: CHAMBER_R - 0.7, count: 56, h: CHAMBER_H * 0.86, w: 0.05 },
            { r: CHAMBER_R - 4.5, count: 24, h: CHAMBER_H * 0.55, w: 0.035 },
            { r: CHAMBER_R - 9.5, count: 16, h: CHAMBER_H * 0.34, w: 0.03 },
        ];
        for (const l of layers) {
            for (let i = 0; i < l.count; i++) {
                const a = (i / l.count) * Math.PI * 2;
                const off = Math.abs(Math.atan2(Math.sin(a), Math.cos(a)));
                if (l.r > CHAMBER_R - 6 && off < ENTRY_GAP) continue; // leave the entry open
                out.push({ a, r: l.r, h: l.h, w: l.w });
            }
        }
        return out;
    }, []);

    const ribs = useMemo(() => {
        const out: number[] = [];
        for (let i = 0; i < 18; i++) {
            const a = (i / 18) * Math.PI * 2;
            if (Math.abs(Math.atan2(Math.sin(a), Math.cos(a))) < ENTRY_GAP + 0.15) continue;
            out.push(a);
        }
        return out;
    }, []);

    return (
        <group>
            {ribs.map((a) => (
                <mesh
                    key={`rib-${a}`}
                    position={[Math.sin(a) * (CHAMBER_R - 0.2), CHAMBER_H / 2, Math.cos(a) * (CHAMBER_R - 0.2)]}
                    rotation={[0, a, 0]}
                >
                    <boxGeometry args={[1.5, CHAMBER_H, 0.9]} />
                    <meshStandardMaterial
                        color="#0a0d13"
                        metalness={0.85}
                        roughness={0.35}
                        emissive="#141a24"
                        emissiveIntensity={0.4 * p}
                    />
                </mesh>
            ))}

            {lines.map((l, i) => (
                <mesh
                    key={`ln-${i}`}
                    position={[Math.sin(l.a) * l.r, l.h / 2 + 0.25, Math.cos(l.a) * l.r]}
                    rotation={[0, l.a, 0]}
                >
                    <boxGeometry args={[l.w, l.h, l.w]} />
                    <meshBasicMaterial color={WARM} toneMapped={false} transparent opacity={0.55 * p} />
                </mesh>
            ))}
        </group>
    );
}

/** Engraved-looking archive panel: recessed slab, hairline engraving, markers. */
function ArchivePanel({ side, p }: { side: -1 | 1; p: number }) {
    const rows = [0, 1, 2, 3];
    return (
        <group
            position={[side * 20.5, 5.4, 5]}
            rotation={[0, side === -1 ? Math.PI / 2.6 : -Math.PI / 2.6, 0]}
        >
            <mesh>
                <boxGeometry args={[15, 10.5, 0.5]} />
                <meshStandardMaterial
                    color="#080b11"
                    metalness={0.9}
                    roughness={0.3}
                    emissive="#10161f"
                    emissiveIntensity={0.5 * p}
                />
            </mesh>
            {/* engraved border hairline */}
            <mesh position={[side * -6.6, 0, 0.28]}>
                <boxGeometry args={[0.03, 9.4, 0.02]} />
                <meshBasicMaterial color={GOLD} toneMapped={false} transparent opacity={0.85 * p} />
            </mesh>
            {rows.map((r) => (
                <group key={r} position={[side * -6.6, 3.4 - r * 2.3, 0.3]}>
                    <mesh>
                        <sphereGeometry args={[0.085, 12, 12]} />
                        <meshBasicMaterial color={WARM} toneMapped={false} transparent opacity={p} />
                    </mesh>
                    <mesh position={[side * 0.9, 0, 0]}>
                        <boxGeometry args={[1.5, 0.015, 0.01]} />
                        <meshBasicMaterial color={GOLD} toneMapped={false} transparent opacity={0.5 * p} />
                    </mesh>
                </group>
            ))}
            <pointLight
                position={[0, 0, 2.4]}
                color={WARM}
                intensity={5 * p}
                distance={22}
                decay={2}
            />
        </group>
    );
}

/** Tall, gently curved translucent monolith at the heart of the room. */
function Monolith({ p }: { p: number }) {
    return (
        <group position={[0, 0, 0]}>
            {/* podium */}
            <mesh position={[0, 0.3, 0]}>
                <cylinderGeometry args={[11, 11.4, 0.6, 96]} />
                <meshStandardMaterial color="#0a0d12" metalness={0.9} roughness={0.25} />
            </mesh>
            <mesh position={[0, 0.68, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[10.5, 11.1, 96]} />
                <meshBasicMaterial color={WARM} toneMapped={false} transparent opacity={0.9 * p} />
            </mesh>

            {/* curved glass monolith */}
            <mesh position={[0, 7.4, 0]}>
                <cylinderGeometry args={[9.2, 9.2, 13.2, 96, 1, true, Math.PI * 0.72, Math.PI * 0.56]} />
                <meshPhysicalMaterial
                    color="#0d1219"
                    transparent
                    opacity={0.5 * p}
                    transmission={0.55}
                    thickness={1.4}
                    roughness={0.14}
                    metalness={0.05}
                    ior={1.35}
                    emissive="#1d2634"
                    emissiveIntensity={0.6 * p}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* vertical fluting across the glass */}
            {Array.from({ length: 26 }, (_, i) => {
                const a = Math.PI * 0.74 + (i / 25) * Math.PI * 0.52;
                return (
                    <mesh
                        key={i}
                        position={[Math.sin(a) * 9.24, 7.4, Math.cos(a) * 9.24]}
                        rotation={[0, a, 0]}
                    >
                        <boxGeometry args={[0.025, 13.2, 0.02]} />
                        <meshBasicMaterial color={GOLD} toneMapped={false} transparent opacity={0.22 * p} />
                    </mesh>
                );
            })}

            {/* crown light following the top edge */}
            <mesh position={[0, 14.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[9.05, 9.35, 96, 1, Math.PI * 0.72, Math.PI * 0.56]} />
                <meshBasicMaterial
                    color={WARM}
                    toneMapped={false}
                    transparent
                    opacity={0.95 * p}
                    side={THREE.DoubleSide}
                />
            </mesh>

            <pointLight position={[0, 8, 6]} color={WARM} intensity={22 * p} distance={48} decay={2} />
        </group>
    );
}

export function Chamber({ p }: { p: number }) {
    // Always mounted so shaders/geometry are compiled long before the reveal —
    // mounting this much geometry mid-scroll is what caused the entry hitch.
    return (
        <group position={[0, 0, CHAMBER_Z]} visible={p > 0.002}>
            {/* dark polished floor continuing the corridor material (no second
          reflection pass here — the corridor already pays for one) */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
                <circleGeometry args={[CHAMBER_R, 96]} />
                <meshStandardMaterial color="#05070b" metalness={0.92} roughness={0.22} />
            </mesh>

            {/* outer drum */}
            <mesh position={[0, CHAMBER_H / 2, 0]}>
                <cylinderGeometry
                    args={[CHAMBER_R, CHAMBER_R, CHAMBER_H, 96, 1, true, ENTRY_GAP, Math.PI * 2 - ENTRY_GAP * 2]}
                />
                <meshStandardMaterial
                    color="#05070c"
                    metalness={0.9}
                    roughness={0.32}
                    emissive="#0b1119"
                    emissiveIntensity={0.35 * p}
                    side={THREE.BackSide}
                />
            </mesh>

            {/* ceiling disc + cove light */}
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, CHAMBER_H, 0]}>
                <circleGeometry args={[CHAMBER_R, 96]} />
                <meshStandardMaterial
                    color="#060a12"
                    metalness={0.4}
                    roughness={0.9}
                    emissive="#0d1420"
                    emissiveIntensity={0.45 * p}
                />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, CHAMBER_H - 0.4, 0]}>
                <ringGeometry args={[CHAMBER_R - 11, CHAMBER_R - 7, 96]} />
                <meshBasicMaterial color={WARM} toneMapped={false} transparent opacity={0.5 * p} />
            </mesh>
            <pointLight
                position={[0, CHAMBER_H - 2, 0]}
                color={WARM}
                intensity={16 * p}
                distance={90}
                decay={2}
            />

            {/* floor cove tracing the drum */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.14, 0]}>
                <ringGeometry args={[CHAMBER_R - 3.4, CHAMBER_R - 2.6, 96]} />
                <meshBasicMaterial color="#E8CE92" toneMapped={false} transparent opacity={0.65 * p} />
            </mesh>

            <RadialStructure p={p} />
            <ArchivePanel side={-1} p={p} />
            <ArchivePanel side={1} p={p} />
            <Monolith p={p} />
        </group>
    );
}
