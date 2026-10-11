import { WIDTH as W, HEIGHT as H } from "../config.js";

const BOX = { w: 360, h: 120 };
const ICON = { w: 220, h: 210 };
const sizeOf = (el) => (el.type === "box" ? BOX : ICON);

// Place n nodes in a grid inside a region; last row is centered.
const placeGrid = (nodes, cols, region, rects) => {
  const rows = Math.ceil(nodes.length / cols);
  const cellW = region.w / cols;
  const cellH = region.h / rows;
  nodes.forEach((el, i) => {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const inRow = Math.min(cols, nodes.length - row * cols);
    const offset = ((cols - inRow) * cellW) / 2;
    const cx = region.x + offset + col * cellW + cellW / 2;
    const cy = region.y + row * cellH + cellH / 2;
    const s = sizeOf(el);
    rects[el.id] = { x: cx - s.w / 2, y: cy - s.h / 2, w: s.w, h: s.h };
  });
};

// First node in the middle, the rest on an ellipse around it.
const placeHub = (nodes, region, rects) => {
  const cx = region.x + region.w / 2;
  const cy = region.y + region.h / 2;
  const [hub, ...rest] = nodes;
  const hs = sizeOf(hub);
  rects[hub.id] = { x: cx - hs.w / 2, y: cy - hs.h / 2, w: hs.w, h: hs.h };
  const rx = region.w * 0.36;
  const ry = region.h * 0.36;
  rest.forEach((el, i) => {
    const ang = ((-90 + (i * 360) / rest.length) * Math.PI) / 180;
    const s = sizeOf(el);
    rects[el.id] = { x: cx + rx * Math.cos(ang) - s.w / 2, y: cy + ry * Math.sin(ang) - s.h / 2, w: s.w, h: s.h };
  });
};

/** Returns { [elementId]: {x,y,w,h} } for everything except lines. */
export const layoutScene = (elements, layout) => {
  const rects = {};
  const title = elements.find((e) => e.type === "title");
  const texts = elements.filter((e) => e.type === "text");
  const nodes = elements.filter((e) => e.type === "box" || e.type === "icon");

  let y = 40;
  if (title) { rects[title.id] = { x: 80, y, w: W - 160, h: 130 }; y += 150; }
  texts.forEach((t) => { rects[t.id] = { x: 80, y, w: W - 160, h: 75 }; y += 85; });

  if (nodes.length) {
    const region = { x: 120, y: y + 20, w: W - 240, h: H - 60 - (y + 20) };
    if (layout === "hub" && nodes.length > 1) placeHub(nodes, region, rects);
    else if (layout === "grid") placeGrid(nodes, 3, region, rects);
    else if (layout === "list") placeGrid(nodes, 1, region, rects);
    else placeGrid(nodes, Math.min(nodes.length, 4), region, rects); // flow (default)
  }
  return rects;
};
