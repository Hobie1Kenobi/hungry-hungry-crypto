import { EffectComposer, SelectiveBloom } from '@react-three/postprocessing'
import { useLayoutEffect, useRef, useSyncExternalStore, type ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group, Object3D } from 'three'

/** Dedicated postprocessing selection layer. Range is [2, 31]. */
export const BLOOM_LAYER = 10

let composerPresents = 0
let bloomLights: Object3D[] = []
let bloomMeshes: Object3D[] = []
const lightListeners = new Set<() => void>()
const meshListeners = new Set<() => void>()

/** True after EffectComposer has presented a couple of frames (lobby warmup). */
export function composerPresented(): boolean {
  return composerPresents >= 2
}

export function registerBloomLight(light: Object3D | null) {
  if (!light || bloomLights.includes(light)) return
  bloomLights = bloomLights.concat(light)
  lightListeners.forEach((fn) => fn())
}

function registerBloomMesh(obj: Object3D) {
  obj.layers.enable(BLOOM_LAYER)
  if (bloomMeshes.includes(obj)) return
  bloomMeshes = bloomMeshes.concat(obj)
  meshListeners.forEach((fn) => fn())
}

function unregisterBloomMesh(obj: Object3D) {
  if (!bloomMeshes.includes(obj)) return
  bloomMeshes = bloomMeshes.filter((item) => item !== obj)
  meshListeners.forEach((fn) => fn())
}

function useBloomLights(): Object3D[] {
  return useSyncExternalStore(
    (onStoreChange) => {
      lightListeners.add(onStoreChange)
      return () => lightListeners.delete(onStoreChange)
    },
    () => bloomLights,
    () => bloomLights,
  )
}

function useBloomMeshes(): Object3D[] {
  return useSyncExternalStore(
    (onStoreChange) => {
      meshListeners.add(onStoreChange)
      return () => meshListeners.delete(onStoreChange)
    },
    () => bloomMeshes,
    () => bloomMeshes,
  )
}

export function BloomSelect({ children }: { children: ReactNode }) {
  const group = useRef<Group>(null)

  useLayoutEffect(() => {
    const root = group.current
    if (!root) return
    const found: Object3D[] = []
    root.traverse((obj) => {
      const mesh = obj as { isMesh?: boolean }
      if (!mesh.isMesh) return
      registerBloomMesh(obj)
      found.push(obj)
    })
    return () => found.forEach(unregisterBloomMesh)
  }, [])

  useFrame(() => {
    const root = group.current
    if (!root) return
    root.traverse((obj) => {
      const mesh = obj as { isMesh?: boolean }
      if (mesh.isMesh) obj.layers.enable(BLOOM_LAYER)
    })
  })

  return <group ref={group}>{children}</group>
}

function BloomWarmup() {
  useFrame(() => {
    composerPresents += 1
  })
  return null
}

function SceneBloom() {
  const lights = useBloomLights()
  const selection = useBloomMeshes()
  return (
    <EffectComposer multisampling={0} stencilBuffer={false} autoClear={false}>
      <SelectiveBloom
        lights={lights}
        selection={selection}
        selectionLayer={BLOOM_LAYER}
        intensity={3.4}
        luminanceThreshold={0}
        luminanceSmoothing={0.2}
        mipmapBlur
        radius={0.7}
        levels={6}
      />
    </EffectComposer>
  )
}

export function ArenaBloom({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <BloomWarmup />
      <SceneBloom />
    </>
  )
}
