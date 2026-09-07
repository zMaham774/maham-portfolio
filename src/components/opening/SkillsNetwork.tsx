import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { CLUSTERS, NODES, setSelectedSkill, useSelectedSkill } from "./skillsData";

/** World Z of the lattice centre — the camera ends up in front of it. */
export const NETWORK_Z = -250;
/** Lattice is lifted well clear of the floor so nothing sinks into it. */
export const NETWORK_Y = 11.2;

const GOLD = new THREE.Color("#C9A84C");
const GOLD_HEX = "#C9A84C";
const WARM = "#FFE3AC";

const vec = (a: [number, number, number]) => new THREE.Vector3(a[0], a[1], a[2]);

/** Depth weight: far strands sink into the void, near ones stay crisp. */
const depth = (z: number, near = 6, far = -34) =>
    Math.pow(THREE.MathUtils.clamp((z - far) / (near - far), 0, 1), 1.6);

function buildEdges() {
    const byName = new Map(NODES.map((n) => [n.name, vec(n.at)]));
    const pairs: [string, string][] = [
        ["C#", "C++"],
        ["C#", "Data Structures"],
        ["C++", "Algorithms"],
        ["Data Structures", "Algorithms"],
        ["Algorithms", "React"],
        ["HTML", "CSS"],
        ["CSS", "JavaScript"],
        ["HTML", "JavaScript"],
        ["JavaScript", "React"],
        ["JavaScript", "Next.js"],
        ["React", "Next.js"],
        ["React", "Tailwind CSS"],
        ["CSS", "Tailwind CSS"],
        ["React", "React Three Fiber"],
        ["Three.js", "React Three Fiber"],
        ["React Three Fiber", "Drei"],
        ["React Three Fiber", "GSAP"],
        ["GSAP", "Lenis"],
        ["Lenis", "Drei"],
        ["Three.js", "GSAP"],
    ];
    const out: [THREE.Vector3, THREE.Vector3][] = [];
    pairs.forEach(([a, b]) => {
        const va = byName.get(a);
        const vb = byName.get(b);
        if (va && vb) out.push([va, vb]);
    });
    // cluster headers tether to their own nodes
    CLUSTERS.forEach((c) => {
        const head = vec(c.at);
        NODES.filter((n) => n.cluster === c.id).forEach((n) => out.push([head, vec(n.at)]));
    });
    return out;
}

const rng = (i: number, k: number) => {
    const v = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453;
    return v - Math.floor(v);
};

/**
 * Depth-graded line field: brightness is baked per vertex from Z, and the
 * material blends additively, so distant strands read as soft haze while the
 * ones nearest the camera stay sharp.
 */
function DepthLines({
    segments,
    opacity,
    strength = 1,
}: {
    segments: [THREE.Vector3, THREE.Vector3][];
    opacity: number;
    strength?: number;
}) {
    const geom = useMemo(() => {
        const pos = new Float32Array(segments.length * 6);
        const col = new Float32Array(segments.length * 6);
        segments.forEach(([a, b], i) => {
            pos.set([a.x, a.y, a.z, b.x, b.y, b.z], i * 6);
            const ca = depth(a.z) * strength;
            const cb = depth(b.z) * strength;
            col.set([GOLD.r * ca, GOLD.g * ca, GOLD.b * ca, GOLD.r * cb, GOLD.g * cb, GOLD.b * cb], i * 6);
        });
        const g = new THREE.BufferGeometry();
        g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
        g.setAttribute("color", new THREE.BufferAttribute(col, 3));
        return g;
    }, [segments, strength]);

    return (
        <lineSegments geometry={geom}>
            <lineBasicMaterial
                vertexColors
                toneMapped={false}
                transparent
                opacity={opacity}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </lineSegments>
    );
}

/** Sparse constellation dust well behind the named lattice. */
function Constellation({ p }: { p: number }) {
    const { points, strands } = useMemo(() => {
        const pts: THREE.Vector3[] = Array.from({ length: 90 }, (_, i) =>
            new THREE.Vector3(
                (rng(i, 1) - 0.5) * 120,
                (rng(i, 2) - 0.5) * 52,
                -8 - rng(i, 3) * 30
            )
        );
        const strands: [THREE.Vector3, THREE.Vector3][] = [];
        pts.forEach((a, i) => {
            const near = pts
                .map((b, j) => ({ b, j, d: a.distanceTo(b) }))
                .filter((o) => o.j !== i)
                .sort((x, y) => x.d - y.d)[0];
            if (near && near.d < 15) strands.push([a, near.b]);
        });
        const pg = new THREE.BufferGeometry();
        const arr = new Float32Array(pts.length * 3);
        const col = new Float32Array(pts.length * 3);
        pts.forEach((v, i) => {
            arr.set([v.x, v.y, v.z], i * 3);
            const d = depth(v.z);
            col.set([1 * d, 0.89 * d, 0.67 * d], i * 3);
        });
        pg.setAttribute("position", new THREE.BufferAttribute(arr, 3));
        pg.setAttribute("color", new THREE.BufferAttribute(col, 3));
        return { points: pg, strands };
    }, []);

    return (
        <group>
            <points geometry={points}>
                <pointsMaterial
                    vertexColors
                    size={0.3}
                    sizeAttenuation
                    toneMapped={false}
                    transparent
                    opacity={0.55 * p}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </points>
            <DepthLines segments={strands} opacity={0.3 * p} strength={0.7} />
        </group>
    );
}

/** A ringed skill marker with its name set beneath it, like an engraved plate. */
function Node({
    node,
    p,
    active,
}: {
    node: (typeof NODES)[number];
    p: number;
    active: boolean;
}) {
    const [hover, setHover] = useState(false);
    const ring = useRef<THREE.Mesh>(null);
    const hot = hover || active;
    const d = 0.55 + 0.45 * depth(node.at[2], 3, -3);

    useFrame((state) => {
        const t = state.clock.elapsedTime;
        const pulse = 1 + Math.sin(t * 1.4 + node.at[0]) * 0.035;
        ring.current?.scale.setScalar((hot ? 1.22 : 1) * pulse);
    });

    return (
        <group position={vec(node.at)}>
            <group
                onPointerOver={(e) => {
                    e.stopPropagation();
                    setHover(true);
                    document.body.style.cursor = "pointer";
                }}
                onPointerOut={() => {
                    setHover(false);
                    document.body.style.cursor = "";
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSkill(active ? null : node.name);
                }}
            >
                {/* generous invisible hit area */}
                <mesh visible={false}>
                    <sphereGeometry args={[2.4, 8, 8]} />
                </mesh>
                <mesh ref={ring}>
                    <torusGeometry args={[1.45, 0.03, 10, 64]} />
                    <meshBasicMaterial
                        color={hot ? WARM : GOLD_HEX}
                        toneMapped={false}
                        transparent
                        opacity={p * (hot ? 1 : 0.5 + 0.35 * d)}
                    />
                </mesh>
                <mesh>
                    <circleGeometry args={[1.42, 48]} />
                    <meshBasicMaterial color="#05050a" toneMapped={false} transparent opacity={p * 0.9} />
                </mesh>
                <mesh>
                    <circleGeometry args={[0.3, 24]} />
                    <meshBasicMaterial
                        color={hot ? WARM : GOLD_HEX}
                        toneMapped={false}
                        transparent
                        opacity={p * (hot ? 1 : d)}
                    />
                </mesh>
            </group>
            {hot && <pointLight color={WARM} intensity={5 * p} distance={14} decay={2} />}

            <Html
                center
                position={[0, -2.5, 0]}
                distanceFactor={34}
                zIndexRange={[8, 0]}
                style={{ pointerEvents: "none" }}
            >
                <div className="whitespace-nowrap text-center" style={{ opacity: p * (0.62 + 0.38 * d) }}>
                    <p
                        className="font-sans text-[0.74rem] tracking-[0.18em]"
                        style={{
                            color: hot ? "#FFF6E2" : "#E8E2D2",
                            textShadow: "0 1px 6px rgba(0,0,0,0.95), 0 0 14px rgba(0,0,0,0.9)",
                        }}
                    >
                        {node.label}
                    </p>
                </div>
            </Html>
        </group>
    );
}

function SectionTitle({ p }: { p: number }) {
    return (
        <Html
            position={[0, 22, 0]}
            center
            distanceFactor={34}
            zIndexRange={[6, 0]}
            style={{ pointerEvents: "none" }}
        >
            <div className="whitespace-nowrap text-center" style={{ opacity: p }}>
                <h2
                    className="font-display text-[1.4rem] uppercase tracking-[0.5em]"
                    style={{
                        color: "#F2F0EA",
                        textShadow: "0 0 24px rgba(201,168,76,0.5)",
                    }}
                >
                    Skills & Technologies
                </h2>
            </div>
        </Html>
    );
}

/** Framed cluster header — a thin gold rectangle with the group name inside. */
function ClusterLabel({ c, p }: { c: (typeof CLUSTERS)[number]; p: number }) {
    return (
        <group position={vec(c.at)}>
            <Html center distanceFactor={34} zIndexRange={[6, 0]} style={{ pointerEvents: "none" }}>
                <div
                    className="whitespace-nowrap px-6 py-2"
                    style={{
                        opacity: p,
                        border: "1px solid rgba(201,168,76,0.7)",
                        background: "rgba(5,5,5,0.72)",
                        boxShadow: "0 0 26px rgba(201,168,76,0.16)",
                    }}
                >
                    <h3
                        className="font-display text-[0.9rem] uppercase tracking-[0.4em]"
                        style={{ color: "#F2F0EA" }}
                    >
                        {c.label}
                    </h3>
                </div>
            </Html>
        </group>
    );
}

/** Lit stage far beneath the lattice so the room never reads as an empty void. */
function Stage({ p }: { p: number }) {
    return (
        <group position={[0, -0.02, NETWORK_Z + 4]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[240, 240]} />
                <meshStandardMaterial
                    color="#0a0906"
                    metalness={0.9}
                    roughness={0.28}
                    emissive="#1a1206"
                    emissiveIntensity={0.45 * p}
                />
            </mesh>
            <group position={[0, 0.4, -2]}>
                {[0.55, 0.78, 1].map((r) => (
                    <mesh key={r} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]} scale={[1, 0.42, 1]}>
                        <ringGeometry args={[24 * r - 0.06, 24 * r, 96]} />
                        <meshBasicMaterial
                            color={GOLD_HEX}
                            toneMapped={false}
                            transparent
                            opacity={0.4 * p}
                            side={THREE.DoubleSide}
                        />
                    </mesh>
                ))}
                <pointLight color={WARM} intensity={8 * p} distance={70} decay={2} position={[0, 6, 0]} />
            </group>
            <pointLight color="#FFD9A0" intensity={6 * p} distance={170} decay={2} position={[0, 18, -30]} />
        </group>
    );
}

/**
 * Skills lattice. `threads` fades in the constellation dust, `nodes` the skill
 * markers, `links` the connections — all plain numbers off the shared state.
 */
export function SkillsNetwork({
    threads,
    nodes: nodesP,
    links,
}: {
    threads: number;
    nodes: number;
    links: number;
}) {
    const selected = useSelectedSkill();
    const edges = useMemo(() => buildEdges(), []);
    const visible = threads > 0.002 || nodesP > 0.002;
    const p = Math.max(threads, nodesP);

    return (
        <group visible={visible}>
            <Stage p={p} />
            <group position={[0, NETWORK_Y, NETWORK_Z]}>
                <Constellation p={threads} />
                {nodesP > 0.002 && (
                    <>
                        <DepthLines segments={edges} opacity={0.75 * links} />
                        {NODES.map((n) => (
                            <Node key={n.name} node={n} p={nodesP} active={selected === n.name} />
                        ))}
                        <SectionTitle p={nodesP} />
                        {CLUSTERS.map((c) => (
                            <ClusterLabel key={c.id} c={c} p={nodesP * links} />
                        ))}
                    </>
                )}
            </group>
        </group>
    );
}
