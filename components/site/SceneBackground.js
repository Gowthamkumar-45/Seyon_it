'use client'
import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const bgVertex = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy,0.0,1.0);} `
const bgFragment = `
  precision highp float; varying vec2 vUv;
  uniform float uTime; uniform vec2 uMouse; uniform vec2 uRes; uniform float uScroll;
  uniform vec3 uA; uniform vec3 uB; uniform vec3 uC; uniform float uVig;
  vec3 hash3(vec2 p){ vec3 q=vec3(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3)),dot(p,vec2(419.2,371.9))); return fract(sin(q)*43758.5453);}
  float noise(vec2 p){ vec2 i=floor(p); vec2 f=fract(p); vec2 u=f*f*(3.0-2.0*f);
    float a=hash3(i).x,b=hash3(i+vec2(1.0,0.0)).x,c=hash3(i+vec2(0.0,1.0)).x,d=hash3(i+vec2(1.0,1.0)).x;
    return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);}
  float fbm(vec2 p){ float v=0.0,amp=0.5; for(int i=0;i<5;i++){ v+=amp*noise(p); p*=2.02; amp*=0.5;} return v;}
  void main(){
    vec2 uv=vUv; float aspect=uRes.x/uRes.y; vec2 p=uv; p.x*=aspect; p+=uMouse*0.08; p.y+=uScroll*0.12;
    float t=uTime*0.03; float f=fbm(p*2.2+vec2(t,t*0.6)); f+=0.5*fbm(p*4.0-vec2(t*0.8,t));
    vec3 col=mix(uA,uB,smoothstep(0.15,0.85,f)); col=mix(col,uC,smoothstep(0.55,0.98,f)*0.5);
    float d=distance(uv,vec2(0.5,0.42)); col*=1.0-smoothstep(0.25,1.0,d)*uVig;
    gl_FragColor=vec4(col,1.0);
  }`

function ShaderBackground({ scrollRef, colors }) {
  const mouse = useRef(new THREE.Vector2(0, 0))
  const uniforms = useMemo(() => ({
    uTime: { value: 0 }, uMouse: { value: new THREE.Vector2(0, 0) }, uRes: { value: new THREE.Vector2(1, 1) }, uScroll: { value: 0 },
    uA: { value: new THREE.Color(colors.a) }, uB: { value: new THREE.Color(colors.b) }, uC: { value: new THREE.Color(colors.c) }, uVig: { value: colors.vig },
  }), [colors])
  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime
    mouse.current.lerp(state.pointer, 0.04); uniforms.uMouse.value.copy(mouse.current)
    uniforms.uRes.value.set(state.size.width, state.size.height)
    uniforms.uScroll.value = scrollRef.current
  })
  return (<mesh frustumCulled={false}><planeGeometry args={[2, 2]} /><shaderMaterial uniforms={uniforms} vertexShader={bgVertex} fragmentShader={bgFragment} depthTest={false} depthWrite={false} /></mesh>)
}

function ParticleGlobe({ count, scrollRef, color, opacity }) {
  const ref = useRef()
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3); const r = 2.15
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(1 - 2 * (i + 0.5) / count); const theta = Math.PI * (1 + Math.sqrt(5)) * i; const j = 0.94 + Math.random() * 0.12
      arr[i * 3] = r * j * Math.sin(phi) * Math.cos(theta); arr[i * 3 + 1] = r * j * Math.sin(phi) * Math.sin(theta); arr[i * 3 + 2] = r * j * Math.cos(phi)
    }
    return arr
  }, [count])
  useFrame((state, delta) => {
    if (!ref.current) return
    ref.current.rotation.y += delta * 0.05
    ref.current.rotation.x = scrollRef.current * 0.6 + (-state.pointer.y * 0.22)
    ref.current.rotation.z += (state.pointer.x * 0.1 - ref.current.rotation.z) * 0.03
  })
  return (<points ref={ref}><bufferGeometry><bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} /></bufferGeometry><pointsMaterial size={0.026} color={color} transparent opacity={opacity} sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} /></points>)
}

function NodeNetwork({ nodeCount, scrollRef, line, lineOpacity, nodeA, nodeB }) {
  const group = useRef()
  const { nodes, linePositions } = useMemo(() => {
    const nodes = []; const r = 2.5
    for (let i = 0; i < nodeCount; i++) { const phi = Math.acos(1 - 2 * (i + 0.5) / nodeCount); const theta = Math.PI * (1 + Math.sqrt(5)) * i; nodes.push(new THREE.Vector3(r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi))) }
    const lines = []
    for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) if (nodes[i].distanceTo(nodes[j]) < 2.4) lines.push(nodes[i].x, nodes[i].y, nodes[i].z, nodes[j].x, nodes[j].y, nodes[j].z)
    return { nodes, linePositions: new Float32Array(lines) }
  }, [nodeCount])
  useFrame((state, delta) => { if (!group.current) return; group.current.rotation.y -= delta * 0.035; group.current.rotation.x = -scrollRef.current * 0.5 + (-state.pointer.y * 0.18) })
  return (
    <group ref={group}>
      <lineSegments><bufferGeometry><bufferAttribute attach="attributes-position" count={linePositions.length / 3} array={linePositions} itemSize={3} /></bufferGeometry><lineBasicMaterial color={line} transparent opacity={lineOpacity} blending={THREE.AdditiveBlending} depthWrite={false} /></lineSegments>
      {nodes.map((n, i) => (<mesh key={i} position={n}><sphereGeometry args={[0.038, 10, 10]} /><meshBasicMaterial color={i % 3 === 0 ? nodeB : nodeA} /></mesh>))}
    </group>
  )
}

function Rig() {
  useFrame((state) => {
    const tx = state.pointer.x * 0.3, ty = state.pointer.y * 0.2
    state.camera.position.x += (tx - state.camera.position.x) * 0.03
    state.camera.position.y += (ty - state.camera.position.y) * 0.03
    state.camera.lookAt(0, 0, 0)
  })
  return null
}

export default function SceneBackground({ lowPower = false, dark = false, scrollRef }) {
  const localRef = useRef(0); const sref = scrollRef || localRef
  const particleCount = lowPower ? 800 : 2200
  const nodeCount = lowPower ? 9 : 15
  const theme = dark
    ? { colors: { a: '#060c18', b: '#0b2144', c: '#123a5c', vig: 0.85 }, particle: '#7dd3fc', pOpacity: 0.85, line: '#22d3ee', lOpacity: 0.2, nodeA: '#38bdf8', nodeB: '#22d3ee' }
    : { colors: { a: '#ffffff', b: '#e8f1ff', c: '#d6e6fb', vig: 0.12 }, particle: '#2563eb', pOpacity: 0.4, line: '#3b82f6', lOpacity: 0.14, nodeA: '#2563eb', nodeB: '#0ea5e9' }
  return (
    <Canvas dpr={lowPower ? [1, 1.3] : [1, 1.8]} camera={{ position: [0, 0, 6.4], fov: 45 }} gl={{ antialias: !lowPower, alpha: true, powerPreference: 'high-performance' }}>
      <ShaderBackground scrollRef={sref} colors={theme.colors} />
      <ParticleGlobe count={particleCount} scrollRef={sref} color={theme.particle} opacity={theme.pOpacity} />
      <NodeNetwork nodeCount={nodeCount} scrollRef={sref} line={theme.line} lineOpacity={theme.lOpacity} nodeA={theme.nodeA} nodeB={theme.nodeB} />
      <Rig />
    </Canvas>
  )
}
