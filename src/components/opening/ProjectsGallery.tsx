"use client";

import { Html, MeshReflectorMaterial, RoundedBox, useTexture } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { Suspense, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { PROJECTS } from './projectsData';
import { useExhibitPalette } from './exhibitMaterials';
import marbleImg from '@/assets/exhibition-marble.jpg';
import aurelImg from '@/assets/aurel-exhibit.jpg';

export const EXHIBITION_Z = -375;

function roundedPath(w: number, h: number, radius: number) {
  const p = new THREE.Shape();
  p.moveTo(-w/2 + radius, 0); p.lineTo(w/2-radius,0);
  p.quadraticCurveTo(w/2,0,w/2,radius); p.lineTo(w/2,h-radius);
  p.quadraticCurveTo(w/2,h,w/2-radius,h); p.lineTo(-w/2+radius,h);
  p.quadraticCurveTo(-w/2,h,-w/2,h-radius); p.lineTo(-w/2,radius);
  p.quadraticCurveTo(-w/2,0,-w/2+radius,0);
  return p;
}

function Case({ width, height, depth }: { width: number; height: number; depth: number }) {
  const c = useExhibitPalette();
  const { frame, line, glass } = useMemo(() => {
    const shape = roundedPath(width,height,1.1);
    const inner = roundedPath(width-.44,height-.44,.94);
    shape.holes.push(new THREE.Path(inner.getPoints(48).map(p => new THREE.Vector2(p.x, p.y + .22))));
    const frame = new THREE.ExtrudeGeometry(shape,{depth:.42,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.06,bevelThickness:.06});
    const points=roundedPath(width-.12,height-.12,1.03).getPoints(96).map(p=>new THREE.Vector3(p.x,p.y+.06,0));
    return { frame, line: new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points,true),128,.021,5,true), glass:new THREE.ShapeGeometry(roundedPath(width-.55,height-.55,.9)) };
  },[width,height]);
  return <group>
    {[0,-depth].map((z)=><group key={z} position={[0,.6,z]}>
      <mesh geometry={frame}><meshStandardMaterial color={c.metal} metalness={.85} roughness={.22} emissive={c.gold} emissiveIntensity={.025}/></mesh>
      <mesh geometry={line} position={[0,0,.5]}><meshBasicMaterial color={c.gold} toneMapped={false}/></mesh>
    </group>)}
    <mesh geometry={glass} position={[0,.86,-.05]}><meshPhysicalMaterial color={c.light} transparent opacity={.025} roughness={.12} metalness={.1} side={THREE.DoubleSide} depthWrite={false}/></mesh>
    {[-1,1].map(side=><group key={side}>
      <mesh position={[side*(width/2-.15),height/2,-depth/2]}><boxGeometry args={[.15,height-1.8,depth]}/><meshStandardMaterial color={c.metal} metalness={.85} roughness={.25}/></mesh>
      <mesh position={[side*(width/2-.35),height/2,-depth/2]}><boxGeometry args={[.018,height-1.5,depth]}/><meshPhysicalMaterial color={c.light} transparent opacity={.035} depthWrite={false} side={THREE.DoubleSide}/></mesh>
    </group>)}
    <RoundedBox args={[width+1.1,.65,depth+1.8]} radius={.3} position={[0,.28,-depth/2]}><meshStandardMaterial color={c.stone} metalness={.65} roughness={.19}/></RoundedBox>
    <mesh position={[0,.7,-depth/2]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[width,depth]}/><meshStandardMaterial color={c.stone} metalness={.8} roughness={.16}/></mesh>
  </group>;
}

function Orbit({ radius=6, height=0 }: { radius?: number; height?: number }) {
  const orbit=useRef<THREE.Group>(null);
  const c=useExhibitPalette();
  useFrame(({clock})=>{ if(orbit.current) orbit.current.rotation.y=clock.elapsedTime*.09; });
  return <group ref={orbit} position={[0,height,0]} rotation={[0,0,.24]}>
    {[0,1].map(i=><mesh key={i} rotation={[-Math.PI/(2.8+i*.6),0,i*.8]}><torusGeometry args={[radius-i*.55,.018,6,96]}/><meshBasicMaterial color={c.gold} toneMapped={false} transparent opacity={.8}/></mesh>)}
    {[0,1.8,3.6,5.1].map((a)=><group key={a} position={[Math.cos(a)*radius,Math.sin(a)*radius*.38,Math.sin(a)*radius*.75]}>
      <mesh><sphereGeometry args={[.13,16,16]}/><meshStandardMaterial color={c.light} metalness={.6} roughness={.1} emissive={c.light} emissiveIntensity={2}/></mesh>
      <pointLight color={c.light} intensity={2} distance={3}/>
    </group>)}
  </group>;
}

function CrystalCluster() {
  const c=useExhibitPalette();
  const forms=useMemo(()=>Array.from({length:46},(_,i)=>{ const a=i*2.399; const r=Math.sqrt(i/46)*5.2; return {x:Math.cos(a)*r,z:Math.sin(a)*r*.6,y:3.1+(i%7)*.37,size:.65+(i%5)*.32,a}; }),[]);
  return <group position={[0,1.1,-2.8]}>
    {forms.map((f,i)=><mesh key={i} position={[f.x,f.y,f.z]} rotation={[f.a*.3,f.a,.24]} scale={[f.size,f.size*.8,f.size*1.1]}>
      <icosahedronGeometry args={[1,1]}/><meshStandardMaterial color={i%4===0?c.metal:c.silver} metalness={.95} roughness={.24} emissive={c.gold} emissiveIntensity={i%5===0?.16:.015} flatShading/>
    </mesh>)}
    <pointLight position={[0,1,2]} color={c.gold} intensity={30} distance={18}/>
  </group>;
}

function Laptop({selected}:{selected:number}) {
  const float=useRef<THREE.Group>(null);
  const c=useExhibitPalette();
  useFrame(({clock})=>{if(float.current){float.current.position.y=10.1+Math.sin(clock.elapsedTime*.65)*.13;float.current.rotation.y=-.18+Math.sin(clock.elapsedTime*.18)*.035;}});
  return <group ref={float} position={[0,10.1,-1.5]} rotation={[.03,-.18,-.05]}>
    <RoundedBox args={[9.4,.19,5.7]} radius={.12} position={[0,-2.7,1.2]}><meshStandardMaterial color={c.silver} metalness={.9} roughness={.24}/></RoundedBox>
    {Array.from({length:6},(_,row)=>Array.from({length:14},(_,col)=><mesh key={`${row}-${col}`} position={[(col-6.5)*.51,-2.585,-.4+row*.43]}><boxGeometry args={[.43,.025,.32]}/><meshStandardMaterial color={c.ink} metalness={.5} roughness={.3}/></mesh>))}
    <mesh position={[0,-2.575,2.95]}><boxGeometry args={[2.7,.015,1.35]}/><meshStandardMaterial color={c.metal} metalness={.65} roughness={.22}/></mesh>
    <group position={[0,.12,-1.38]} rotation={[-.14,0,0]}>
      <RoundedBox args={[9.3,5.9,.22]} radius={.15}><meshStandardMaterial color={c.silver} metalness={.9} roughness={.22}/></RoundedBox>
      <mesh position={[0,0,.125]}><planeGeometry args={[8.83,5.43]}/><meshBasicMaterial color={c.ink}/></mesh>
      <Html transform position={[0,0,.145]} distanceFactor={3.5} style={{pointerEvents:'none'}}>
        <div className="exhibit-screen">
          {PROJECTS.map((project,i)=>(
            <div key={project.slug} className={`exhibit-screen-page exhibit-screen-page--${i} ${selected===i?'is-active':''}`}>
              <div className="exhibit-screen-top"><span>{project.name}</span><span>{i===0?'COLLECTION 2026':'OVERVIEW'}</span></div>
              {i===0 ? (
                <div className="exhibit-fashion">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={aurelImg.src} width={1280} height={768} alt="Luxury sneaker editorial concept"/>
                  <div><span>THE ART OF EVERYDAY</span><strong>AUREL</strong></div>
                </div>
              ) : i===1 ? (
                <div className="exhibit-solar">
                  <span>POWERING A BRIGHTER TOMORROW</span>
                  <strong>Energy.<br/>Reimagined.</strong>
                  <div className="solar-panels">{Array.from({length:12},(_,j)=><span key={j}/>)}</div>
                </div>
              ) : (
                <div className="exhibit-dashboard">
                  <aside>OVERVIEW<br/><br/>Faculty<br/><br/>Attendance<br/><br/>Timetables<br/><br/>Reports</aside>
                  <div>
                    <h4>Faculty overview</h4>
                    <div className="dashboard-metrics">
                      <span>124<small>FACULTY</small></span>
                      <span>96%<small>ATTENDANCE</small></span>
                      <span>12<small>DEPARTMENTS</small></span>
                    </div>
                    <div className="dashboard-chart">{[40,68,55,85,71,94,62,78,90,75].map((v,j)=><span key={j} className={`chart-bar chart-bar-${v}`}/>)}</div>
                  </div>
                </div>
              )}
              <div className="exhibit-screen-bottom"><strong>{i===0?'DESIGNED TO STAND APART':project.category}</strong><span>{project.number} / 04</span></div>
            </div>
          ))}
        </div>
      </Html>
    </group>
  </group>;
}

function SmallExhibit({index,selected,onSelect,position}:{index:number;selected:number;onSelect:(i:number)=>void;position:[number,number,number]}) {
  const p=PROJECTS[index]; const c=useExhibitPalette();
  if(!p)return null;
  return <group position={position}>
    <Case width={7} height={14} depth={3}/>
    <Html center position={[0,11.7,.8]} distanceFactor={12}>
      <button
        type="button"
        className={`exhibit-mini-label ${selected===index?'is-selected':''}`}
        onClick={()=>onSelect(index)}
        aria-label={`Feature ${p.name}, ${p.category}`}
      >
        <span>{p.number} / 04</span>
        <strong>{index>1?'FACULTY SYSTEM':p.name}</strong>
        <small>{p.category}</small>
      </button>
    </Html>
    <group position={[0,6,-1.5]}>
      {index===1?<><mesh><sphereGeometry args={[1.35,24,24]}/><meshStandardMaterial color={c.gold} metalness={.8} roughness={.22} emissive={c.gold} emissiveIntensity={.15}/></mesh><Orbit radius={2.4}/></>:index===2?Array.from({length:17},(_,i)=><mesh key={i} position={[(i%5-2)*.65,(i%3)*.3,-Math.floor(i/5)*.5]}><boxGeometry args={[.06,1.2+(i%5)*.55,.06]}/><meshStandardMaterial color={c.gold} emissive={c.gold} emissiveIntensity={.8} metalness={.8}/></mesh>):<><mesh rotation={[.2,.4,.2]}><icosahedronGeometry args={[2,1]}/><meshStandardMaterial color={c.silver} wireframe metalness={.9} emissive={c.gold} emissiveIntensity={.5}/></mesh><Orbit radius={2.4}/></>}
    </group>
    <mesh position={[0,1.15,-1.5]}><cylinderGeometry args={[2.7,2.9,.65,48]}/><meshStandardMaterial color={c.stone} metalness={.8} roughness={.2}/></mesh>
    <mesh position={[0,1.5,-1.5]} rotation={[-Math.PI/2,0,0]}><torusGeometry args={[2.65,.025,6,64]}/><meshBasicMaterial color={c.gold} toneMapped={false}/></mesh>
    <pointLight position={[0,8,2]} color={c.light} intensity={22} distance={22}/>
  </group>;
}

function Room() {
  const c=useExhibitPalette(); const texture=useTexture(marbleImg.src);
  const map=useMemo(()=>{const t=texture.clone();t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(5,5);t.colorSpace=THREE.SRGBColorSpace;return t;},[texture]);
  return <group>
    <mesh position={[0,-.12,-20]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[130,140]}/><MeshReflectorMaterial resolution={256} blur={[120,40]} mixBlur={.6} mixStrength={14} mirror={.7} map={map} color={c.silver} metalness={.65} roughness={.27} depthScale={.2} minDepthThreshold={.4} maxDepthThreshold={1.4}/></mesh>
    <mesh position={[0,14,-48]}><planeGeometry args={[120,30]}/><meshStandardMaterial map={map} color={c.silver} roughness={.42} metalness={.55}/></mesh>
    {Array.from({length:13},(_,i)=><group key={i} position={[(i-6)*9,0,-47]}><mesh position={[0,14,0]}><boxGeometry args={[.32,28,.5]}/><meshStandardMaterial color={c.metal} metalness={.85} roughness={.24}/></mesh><mesh position={[.25,14,.32]}><boxGeometry args={[.025,28,.025]}/><meshBasicMaterial color={c.gold} transparent opacity={.28} toneMapped={false}/></mesh></group>)}
    {[25,34].map(radius=><group key={radius} position={[8,26,-23]}><mesh rotation={[Math.PI/2,0,0]}><torusGeometry args={[radius,.16,8,128]}/><meshStandardMaterial color={c.metal} metalness={.8} roughness={.25}/></mesh><mesh position={[0,-.18,0]} rotation={[Math.PI/2,0,0]}><torusGeometry args={[radius,.025,6,128]}/><meshBasicMaterial color={c.gold} toneMapped={false}/></mesh></group>)}
    <mesh position={[0,27,-20]} rotation={[Math.PI/2,0,0]}><planeGeometry args={[125,140]}/><meshStandardMaterial map={map} color={c.silver} metalness={.6} roughness={.35} side={THREE.DoubleSide}/></mesh>
    <group position={[21,0,9]} rotation={[0,-.2,0]}><RoundedBox args={[17,2.1,4]} radius={.7} position={[0,1.4,0]}><meshStandardMaterial color={c.ink} roughness={.58}/></RoundedBox><RoundedBox args={[17,2.6,1]} radius={.4} position={[0,3,-1.5]}><meshStandardMaterial color={c.ink} roughness={.5}/></RoundedBox></group>
    <mesh position={[19,1,16]}><cylinderGeometry args={[4.3,4.3,1.8,64]}/><meshStandardMaterial map={map} color={c.silver} metalness={.7} roughness={.2}/></mesh>
    <ambientLight color={c.light} intensity={.45}/>
    <pointLight position={[-9,19,12]} color={c.light} intensity={160} distance={80} decay={2}/>
    <pointLight position={[24,21,-15]} color={c.light} intensity={200} distance={90} decay={2}/>
  </group>;
}

export function ProjectsGallery({transition,gallery,selected,onSelect}:{transition:number;gallery:number;selected:number;onSelect:(i:number)=>void}) {
  const {size}=useThree(); const mobile=size.width<800; const c=useExhibitPalette();

  // Warm the texture cache now so mounting the room mid-scroll doesn't stall on a download.
  useEffect(()=>{ useTexture.preload(marbleImg.src); },[]);

  return <>
    <group visible={transition>.002 && gallery<.99}>{Array.from({length:14},(_,i)=><mesh key={i} position={[(i-6.5)*4.2,i%3===0?20:.15,-280-transition*30]}><boxGeometry args={[.025,.025,8+transition*140]}/><meshBasicMaterial color={c.gold} transparent opacity={transition*.2*(1-gallery)} toneMapped={false}/></mesh>)}</group>
    {gallery>.002 && <group position={[0,0,EXHIBITION_Z]}>
      <Suspense fallback={null}><Room/></Suspense>
      <group position={[mobile?0:-6,mobile?8:0,0]} scale={mobile?.55:1}>
        <Case width={18} height={23} depth={6}/>
        <mesh position={[0,1.2,-2.5]}><cylinderGeometry args={[6.3,6.7,1,64]}/><meshStandardMaterial color={c.stone} metalness={.8} roughness={.22}/></mesh>
        {[5.1,5.7,6.3].map(r=><mesh key={r} position={[0,1.73,-2.5]} rotation={[-Math.PI/2,0,0]}><torusGeometry args={[r,.018,6,80]}/><meshBasicMaterial color={c.gold} transparent opacity={.65} toneMapped={false}/></mesh>)}
        <CrystalCluster/><Orbit radius={6.5} height={8}/><Laptop selected={selected}/>
        <pointLight position={[0,13,4]} color={c.light} intensity={100} distance={30} decay={2}/>
        <pointLight position={[-6,6,0]} color={c.light} intensity={70} distance={22} decay={2}/>
      </group>
      {!mobile&&PROJECTS.map((_,i)=>i===selected?null:<SmallExhibit key={i} index={i} selected={selected} onSelect={onSelect} position={[13+i*8,0,-12-i*5]}/>)}
    </group>}
  </>;
}