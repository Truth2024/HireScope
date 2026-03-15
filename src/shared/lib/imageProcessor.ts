import sharp from 'sharp';

export type ProcessedImages = {
  original: Buffer;
  blur: Buffer;
  originalFileName: string;
  blurFileName: string;
};

export async function processAvatarImage(file: File): Promise<ProcessedImages> {
  const buffer = Buffer.from(await file.arrayBuffer());

  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 10);
  const baseFileName = `${timestamp}_${random}`;

  const BLUR_SIZE = 60;

  const originalBuffer = await sharp(buffer)
    .resize(800, 800, {
      fit: 'cover',
      position: 'center',
      withoutEnlargement: true,
    })
    .jpeg({
      quality: 85,
      progressive: true,
      mozjpeg: true,
    })
    .toBuffer();

  const blurBuffer = await sharp(buffer)
    .resize(300, 300, {
      fit: 'cover',
      position: 'center',
    })

    .blur(2)

    .resize(BLUR_SIZE, BLUR_SIZE, {
      fit: 'cover',
      position: 'center',
    })
    .jpeg({
      quality: 75,
      progressive: true,
      mozjpeg: true,
    })
    .toBuffer();

  return {
    original: originalBuffer,
    blur: blurBuffer,
    originalFileName: `original_${baseFileName}.jpg`,
    blurFileName: `blur_${baseFileName}.jpg`,
  };
}

// Утилита для конвертации File в Buffer
export async function fileToBuffer(file: File): Promise<Buffer> {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
