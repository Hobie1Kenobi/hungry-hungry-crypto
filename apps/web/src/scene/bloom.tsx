import { EffectComposer, Select, SelectiveBloom, Selection } from '@react-three/postprocessing'
import { useSyncExternalStore, type ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Object3D } from 'three'

/** Dedicated postprocessing selection layer. Range is [2, 31]. */
export const BLOOM_LAYER = 10

let composerPresents = 0
let bloomLights: Object3D[] = []
const lightListeners = new Set<() => void>()

/** True after EffectComposer has presented a couple of frames (lobby warmup). */
export function composerPresented(): boolean {
  return composerPresents >= 2
}

export function registerBloomLight(light: Object3D | null) {
  if (!light || bloomLights.includes(light)) return
  bloomLights = bloomLights.concat(light)
  lightListeners.forEach((fn) => fn())
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

export function BloomSelect({ children }: { children: ReactNode }) {
  return <Select enabled>{children}</Select>
}

function BloomWarmup() {
  useFrame(() => {
    composerPresents += 1
  })
  return null
}

function SceneBloom() {
  const lights = useBloomLights()
  return (
    <EffectComposer multisampling={0} stencilBuffer={false}>
      <SelectiveBloom
        lights={lights}
        selectionLayer={BLOOM_LAYER}
        intensity={2.2}
        luminanceThreshold={0.08}
        luminanceSmoothing={0.3}
        mipmapBlur
        radius={0.52}
        levels={5}
        ignoreBackground
      />
    </EffectComposer>
  )
}

export function ArenaBloom({ children }: { children: ReactNode }) {
  return (
    <Selection>
      {children}
      <BloomWarmup />
      <SceneBloom />
    </Selection>
  )
}
