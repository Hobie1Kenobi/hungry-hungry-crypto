import { EffectComposer, Select, SelectiveBloom, Selection } from '@react-three/postprocessing'
import { useLayoutEffect, useState, type ReactNode } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import type { Light, Object3D } from 'three'

/** Dedicated three.js layer for visor / golden chip / hopper spark meshes only. */
export const BLOOM_LAYER = 11

let composerPresents = 0

/** True after EffectComposer has presented a couple of frames (lobby warmup). */
export function composerPresented(): boolean {
  return composerPresents >= 2
}

export function BloomSelect({ children }: { children: ReactNode }) {
  return (
    <Select
      enabled
      onUpdate={(group) => {
        group.traverse((obj) => {
          const mesh = obj as { isMesh?: boolean }
          if (mesh.isMesh) obj.layers.enable(BLOOM_LAYER)
        })
      }}
    >
      {children}
    </Select>
  )
}

function BloomWarmup() {
  useFrame(() => {
    composerPresents += 1
  })
  return null
}

function SceneBloom() {
  const scene = useThree((s) => s.scene)
  const [lights, setLights] = useState<Object3D[]>([])

  useLayoutEffect(() => {
    const found: Object3D[] = []
    scene.traverse((obj) => {
      if ((obj as Light).isLight) {
        obj.layers.enable(BLOOM_LAYER)
        found.push(obj)
      }
    })
    setLights(found)
  }, [scene])

  return (
    <EffectComposer multisampling={0} stencilBuffer={false} autoClear={false}>
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
