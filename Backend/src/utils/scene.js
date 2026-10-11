// ONE place to adapt to your script JSON. Change these if your keys differ.
export const getNarration = (scene) =>
  scene.narration ?? scene.narration_text ?? scene.script ?? scene.voiceover ?? "";
export const getTitle = (scene) => scene.title ?? scene.scene_title ?? `Scene ${scene.scene ?? ""}`.trim();
export const getVisualHint = (scene) => scene.visual_hint ?? "";
