export const DEFAULT_SAMPLE_RATE = 24000;
const BIT_DEPTH = 16;
const CHANNELS = 1;

export function parseSampleRate(mimeType) {
  const m = /rate=(\d+)/.exec(mimeType || "");
  return m ? Number(m[1]) : DEFAULT_SAMPLE_RATE;
}

export function pcmToWav(pcm, sampleRate = DEFAULT_SAMPLE_RATE) {
  const blockAlign = CHANNELS * (BIT_DEPTH / 8);
  const byteRate = sampleRate * blockAlign;
  const header = Buffer.alloc(44);

  header.write("RIFF", 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(CHANNELS, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(BIT_DEPTH, 34);
  header.write("data", 36);
  header.writeUInt32LE(pcm.length, 40);

  return Buffer.concat([header, pcm]);
}

export function ensureWav(buf, mimeType) {
  return buf.toString("ascii", 0, 4) === "RIFF"
    ? buf
    : pcmToWav(buf, parseSampleRate(mimeType));
}

export function getWavDuration(wav) {
  const byteRate = wav.readUInt32LE(28);
  let offset = 12;
  while (offset + 8 <= wav.length) {
    const id = wav.toString("ascii", offset, offset + 4);
    const size = wav.readUInt32LE(offset + 4);
    if (id === "data") {
      return Math.min(size, wav.length - offset - 8) / byteRate;
    }
    offset += 8 + size + (size % 2); // chunks are padded to even length
  }
  throw new Error("No data chunk found in WAV");
}
