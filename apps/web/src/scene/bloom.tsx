import { EffectComposer, EffectComposerContext, Select, SelectiveBloom, Selection } from '@react-three/postprocessing'
import { useContext, useLayoutEffect, useState, type ReactNode } from 'react'
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

function SceneLights() {
  const scene = useThree((s) => s.scene)
  const { composer } = useContext(EffectComposerContext)
  const [lights, setLights] = useState<Object3D[]>([])

  useFrame(() => {
    if (composer) composerPresents += 1
  })

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
    <SelectiveBloom
      lights={lights}
      selectionLayer={BLOOM_LAYER}
      intensity={1.7}
      luminanceThreshold={0.12}
      luminanceSmoothing={0.35}
      mipmapBlur
      radius={0.48}
      levels={5}
      ignoreBackground
    />
  )
}

export function ArenaBloom({ children }: { children: ReactNode }) {
  return (
    <Selection>
      <EffectComposer multisampling={0} stencilBuffer={false} autoClear={false}>
        <SceneLights />
      </EffectComposer>
      {children}
    </Selection>
  )
}
