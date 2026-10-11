export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;
export const PAD_SEC = 0.5; // silent breathing room after each scene's narration

export const sceneFrames = (scene) => Math.ceil((scene.durationSec + PAD_SEC) * FPS);
