import fs from "fs";
const buf = fs.readFileSync(process.argv[2]);
const byteRate = buf.readUInt32LE(28);
console.log(((buf.length - 44) / byteRate).toFixed(3));
