export const SAMPLE_RATE = 24000; // Gemini TTS output verify each time it changes
export const BIT_DEPTH = 16;
export const CHANNELS = 1;

export function getPcmDuration(pcm) {
  const bytesPerSecond = SAMPLE_RATE * (BIT_DEPTH / 8) * CHANNELS;
  return pcm.length / bytesPerSecond;
}

export function pcmToWav(pcm) {
  const blockAlign = CHANNELS * (BIT_DEPTH / 8);
  const byteRate = SAMPLE_RATE * blockAlign;
  const header = Buffer.alloc(44);

  header.write("RIFF", 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16); // fmt chunk size
  header.writeUInt16LE(1, 20); // PCM format
  header.writeUInt16LE(CHANNELS, 22);
  header.writeUInt32LE(SAMPLE_RATE, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(BIT_DEPTH, 34);
  header.write("data", 36);
  header.writeUInt32LE(pcm.length, 40);

  return Buffer.concat([header, pcm]);
}

// Works for both cases: already WAV, or raw PCM
export function ensureWav(buf) {
  return buf.toString("ascii", 0, 4) === "RIFF" ? buf : pcmToWav(buf);
}

export function getWavDuration(wav) {
  const byteRate = wav.readUInt32LE(28);
  let offset = 12; // skip "RIFF....WAVE"
  while (offset + 8 <= wav.length) {
    const id = wav.toString("ascii", offset, offset + 4);
    let size = wav.readUInt32LE(offset + 4);
    if (id === "data") {
      size = Math.min(size, wav.length - offset - 8); // guard bad sizes
      return size / byteRate;
    }
    offset += 8 + size;
  }
  throw new Error("No data chunk found in WAV");
}
