'use client'
import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const bgVertex = `
  varying vec2 vUv;
  void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`
const bgFragment = `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime; uniform vec2 uMouse; uniform vec2 uRes; uniform float uScroll;
  vec3 hash3(vec2 p){ vec3 q = vec3(dot(p, vec2(127.1,311.7)), dot(p, vec2(269.5,183.3)), dot(p, vec2(419.2,371.9))); return fract(sin(q)*43758.5453); }
  float noise(vec2 p){ vec2 i=floor(p); vec2 f=fract(p); vec2 u=f*f*(3.0-2.0*f);
    float a=hash3(i).x; float b=hash3(i+vec2(1.0,0.0)).x; float c=hash3(i+vec2(0.0,1.0)).x; float d=hash3(i+vec2(1.0,1.0)).x;
    return mix(mix(a,b,u.x), mix(c,d,u.x), u.y); }
  float fbm(vec2 p){ float v=0.0; float amp=0.5; for(int i=0;i<5;i++){ v+=amp*noise(p); p*=2.02; amp*=0.5; } return v; }
  void main(){
    vec2 uv = vUv; float aspect = uRes.x/uRes.y; vec2 p = uv; p.x *= aspect;
    p += uMouse * 0.10; p.y += uScroll * 0.15;
    float t = uTime * 0.035;
    float f = fbm(p*2.2 + vec2(t, t*0.6)); f += 0.5*fbm(p*4.0 - vec2(t*0.8, t));
    vec3 navy = vec3(0.008, 0.02, 0.06);
    vec3 royal = vec3(0.045, 0.15, 0.42);
    vec3 cyan = vec3(0.09, 0.55, 0.68);
    vec3 col = mix(navy, royal, smoothstep(0.2, 0.85, f));
    col = mix(col, cyan, smoothstep(0.6, 0.98, f)*0.45);
    float d = distance(uv, vec2(0.5, 0.42));
    col *= 1.0 - smoothstep(0.3, 1.0, d)*0.85;
    col += 0.02;
    gl_FragColor = vec4(col, 1.0);
  }
`

function ShaderBackground({ scrollRef }) {
  const mouse = useRef(new THREE.Vector2(0, 0))
  const uniforms = useMemo(() => ({
    uTime: { value: 0 }, uMouse: { value: new THREE.Vector2(0, 0) }, uRes: { value: new THREE.Vector2(1, 1) }, uScroll: { value: 0 },
  }), [])
  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime
    mouse.current.lerp(state.pointer, 0.04)
    uniforms.uMouse.value.copy(mouse.current)
    uniforms.uRes.value.set(state.size.width, state.size.height)
    uniforms.uScroll.value = scrollRef.current
  })
  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial uniforms={uniforms} vertexShader={bgVertex} fragmentShader={bgFragment} depthTest={false} depthWrite={false} />
    </mesh>
  )
}

function ParticleGlobe({ count, scrollRef }) {
  const ref = useRef()
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3); const r = 2.15
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(1 - 2 * (i + 0.5) / count)
      const theta = Math.PI * (1 + Math.sqrt(5)) * i
      const j = 0.94 + Math.random() * 0.12
      arr[i * 3] = r * j * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = r * j * Math.sin(phi) * Math.sin(theta)
      arr[i * 3 + 2] = r * j * Math.cos(phi)
    }
    return arr
  }, [count])
  useFrame((state, delta) => {
    if (!ref.current) return
    ref.current.rotation.y += delta * 0.05
    ref.current.rotation.x = scrollRef.current * 0.6 + (-state.pointer.y * 0.25)
    ref.current.rotation.z += (state.pointer.x * 0.1 - ref.current.rotation.z) * 0.03
  })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.026} color="#7dd3fc" transparent opacity={0.85} sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  )
}

function NodeNetwork({ nodeCount, scrollRef }) {
  const group = useRef()
  const { nodes, linePositions } = useMemo(() => {
    const nodes = []; const r = 2.5
    for (let i = 0; i < nodeCount; i++) {
      const phi = Math.acos(1 - 2 * (i + 0.5) / nodeCount)
      const theta = Math.PI * (1 + Math.sqrt(5)) * i
      nodes.push(new THREE.Vector3(r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi)))
    }
    const lines = []
    for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
      if (nodes[i].distanceTo(nodes[j]) < 2.4) lines.push(nodes[i].x, nodes[i].y, nodes[i].z, nodes[j].x, nodes[j].y, nodes[j].z)
    }
    return { nodes, linePositions: new Float32Array(lines) }
  }, [nodeCount])
  useFrame((state, delta) => {
    if (!group.current) return
    group.current.rotation.y -= delta * 0.035
    group.current.rotation.x = -scrollRef.current * 0.5 + (-state.pointer.y * 0.2)
  })
  return (
    <group ref={group}>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={linePositions.length / 3} array={linePositions} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial color="#22d3ee" transparent opacity={0.2} blending={THREE.AdditiveBlending} depthWrite={false} />
      </lineSegments>
      {nodes.map((n, i) => (
        <mesh key={i} position={n}>
          <sphereGeometry args={[0.04, 10, 10]} />
          <meshBasicMaterial color={i % 3 === 0 ? '#22d3ee' : '#38bdf8'} />
        </mesh>
      ))}
    </group>
  )
}

function Rig({ scrollRef }) {
  useFrame((state) => {
    const tx = state.pointer.x * 0.3
    const ty = state.pointer.y * 0.2
    state.camera.position.x += (tx - state.camera.position.x) * 0.03
    state.camera.position.y += (ty - state.camera.position.y) * 0.03
    state.camera.lookAt(0, 0, 0)
  })
  return null
}

export default function SceneBackground({ lowPower = false, scrollRef }) {
  const localRef = useRef(0)
  const sref = scrollRef || localRef
  const particleCount = lowPower ? 900 : 2400
  const nodeCount = lowPower ? 9 : 15
  return (
    <Canvas dpr={lowPower ? [1, 1.3] : [1, 1.8]} camera={{ position: [0, 0, 6.4], fov: 45 }} gl={{ antialias: !lowPower, alpha: true, powerPreference: 'high-performance' }}>
      <ShaderBackground scrollRef={sref} />
      <ParticleGlobe count={particleCount} scrollRef={sref} />
      <NodeNetwork nodeCount={nodeCount} scrollRef={sref} />
      <Rig scrollRef={sref} />
    </Canvas>
  )
}
