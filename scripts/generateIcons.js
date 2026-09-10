import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createCRC32Table() {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  return table;
}

const crcTable = createCRC32Table();
function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);
  
  const crcBuf = Buffer.alloc(4);
  const toCrc = Buffer.concat([typeBuf, data]);
  crcBuf.writeUInt32BE(crc32(toCrc), 0);
  
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

function generatePNG(width, height, r, g, b) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8); // bit depth
  ihdr.writeUInt8(6, 9); // RGBA
  ihdr.writeUInt8(0, 10);
  ihdr.writeUInt8(0, 11);
  ihdr.writeUInt8(0, 12);
  const ihdrChunk = createChunk('IHDR', ihdr);
  
  const rowBytes = width * 4;
  const rawData = Buffer.alloc((rowBytes + 1) * height);
  
  const cx = width / 2;
  const cy = height / 2;
  const radius = width * 0.42;
  
  let offset = 0;
  for (let y = 0; y < height; y++) {
    rawData.writeUInt8(0, offset++); // filter type none
    for (let x = 0; x < width; x++) {
      const dist = Math.hypot(x - cx, y - cy);
      if (dist <= radius) {
        // Deep teal icon with white cross/heart detail
        const isCross = (Math.abs(x - cx) < width * 0.08 && Math.abs(y - cy) < height * 0.22) ||
                        (Math.abs(y - cy) < height * 0.08 && Math.abs(x - cx) < width * 0.22);
        if (isCross) {
          rawData.writeUInt8(255, offset++);
          rawData.writeUInt8(255, offset++);
          rawData.writeUInt8(255, offset++);
          rawData.writeUInt8(255, offset++);
        } else {
          rawData.writeUInt8(r, offset++);
          rawData.writeUInt8(g, offset++);
          rawData.writeUInt8(b, offset++);
          rawData.writeUInt8(255, offset++);
        }
      } else {
        // Transparent
        rawData.writeUInt8(0, offset++);
        rawData.writeUInt8(0, offset++);
        rawData.writeUInt8(0, offset++);
        rawData.writeUInt8(0, offset++);
      }
    }
  }
  
  const compressed = zlib.deflateSync(rawData);
  const idatChunk = createChunk('IDAT', compressed);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));
  
  return Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk]);
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate 192x192, 512x512, apple-touch-icon, and favicon
const pwa192 = generatePNG(192, 192, 14, 107, 98); // #0E6B62
const pwa512 = generatePNG(512, 512, 14, 107, 98);
const appleIcon = generatePNG(180, 180, 14, 107, 98);
const favicon32 = generatePNG(32, 32, 14, 107, 98);

fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), pwa192);
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), pwa512);
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), appleIcon);
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), favicon32);

// SVG Icons
const maskIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="#0E6B62">
  <rect width="512" height="512" rx="128" fill="#0E6B62"/>
  <path d="M256 120 L300 220 L400 220 L320 280 L350 380 L256 320 L162 380 L192 280 L112 220 L212 220 Z" fill="#FFFFFF"/>
</svg>`;
fs.writeFileSync(path.join(publicDir, 'mask-icon.svg'), maskIconSvg);

console.log('PWA assets generated successfully in public/');
