// import { Dropbox } from 'dropbox';
// import type { NextRequest } from 'next/server';
// import { NextResponse } from 'next/server';
// import fetch from 'node-fetch'; // 👈 импортируем fetch для Node

// const dbx = new Dropbox({
//   accessToken: process.env.DROPBOX_TOKEN,
//   fetch, // 👈 передаём SDK функцию fetch
// });
// export const POST = async (req: NextRequest) => {
//   try {
//     const fileBuffer = Buffer.from(await req.arrayBuffer());

//     const fileName = `/avatars/${Date.now()}-avatar.png`;

//     const uploadRes = await dbx.filesUpload({
//       path: fileName,
//       contents: fileBuffer,
//       mode: { '.tag': 'add' },
//     });

//     const sharedLink = await dbx.sharingCreateSharedLinkWithSettings({
//       path: uploadRes.result.path_lower!,
//     });

//     const publicUrl = sharedLink.result.url.replace('?dl=0', '?raw=1');

//     return NextResponse.json({ url: publicUrl });
//   } catch (err) {
//     return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
//   }
// };
