import { useMemo } from 'react';
import * as THREE from 'three';

/** Three materials share the exhibition's CSS palette rather than owning colors. */
export function useExhibitPalette() {
  return useMemo(() => {
    const css = getComputedStyle(document.documentElement);
    const read = (name: string) => new THREE.Color(css.getPropertyValue(`--exhibit-${name}`).trim());
    return { gold: read('gold'), light: read('light'), metal: read('metal'), stone: read('stone'), ink: read('ink'), silver: read('silver') };
  }, []);
}
