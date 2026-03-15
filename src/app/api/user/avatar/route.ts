import mongoose from 'mongoose';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { getAuthUser } from '@lib/auth';
import User from '@models/User';
import { dropboxService } from 'src/shared/lib/dropbox';
import { processAvatarImage } from 'src/shared/lib/imageProcessor';
import connectToDatabase from 'src/shared/lib/mongodb';

export const maxDuration = 30;
export const dynamic = 'force-dynamic';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

async function abortSession(session: mongoose.ClientSession) {
  await session.abortTransaction();
  session.endSession();
}
function validateImageFile(file: File): { valid: boolean; errorKey?: string } {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, errorKey: 'invalidType' };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, errorKey: 'fileTooLarge' };
  }
  return { valid: true };
}

export async function POST(req: NextRequest) {
  await connectToDatabase();

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      await abortSession(session);
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }

    const user = await User.findById(authUser._id).session(session);

    if (!user) {
      await abortSession(session);
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
    }

    const formData = await req.formData();
    const file = formData.get('avatar');

    if (!(file instanceof File)) {
      await abortSession(session);
      return NextResponse.json({ error: 'Файл не предоставлен' }, { status: 400 });
    }

    const validation = validateImageFile(file);
    if (!validation.valid) {
      await abortSession(session);
      return NextResponse.json({ errorKey: validation.errorKey }, { status: 400 });
    }

    const processedImages = await processAvatarImage(file);

    const oldAvatarPath = user.avatarPath;
    const oldAvatarBlurPath = user.avatarBlurPath;

    const newAvatarPath = dropboxService.generateFilePath(
      user._id.toString(),
      processedImages.originalFileName
    );
    const newAvatarBlurPath = dropboxService.generateFilePath(
      user._id.toString(),
      processedImages.blurFileName
    );

    const [avatarUrl, avatarBlurUrl] = await Promise.all([
      dropboxService.uploadFile(processedImages.original, newAvatarPath),
      dropboxService.uploadFile(processedImages.blur, newAvatarBlurPath),
    ]);

    user.avatar = avatarUrl;
    user.avatarBlur = avatarBlurUrl;
    user.avatarPath = newAvatarPath;
    user.avatarBlurPath = newAvatarBlurPath;

    await user.save({ session });

    await session.commitTransaction();
    session.endSession();

    const deletePromises: Promise<void>[] = [];

    if (oldAvatarPath) {
      deletePromises.push(dropboxService.deleteFile(oldAvatarPath).catch(() => {}));
    }

    if (oldAvatarBlurPath) {
      deletePromises.push(dropboxService.deleteFile(oldAvatarBlurPath).catch(() => {}));
    }

    if (deletePromises.length > 0) {
      Promise.all(deletePromises).catch(() => {});
    }

    return NextResponse.json({
      message: 'Аватар успешно обновлен',
      user: {
        id: user._id.toString(),
        avatar: user.avatar,
        avatarBlur: user.avatarBlur,
      },
    });
  } catch (error) {
    await abortSession(session);

    return NextResponse.json(
      {
        error: 'Ошибка при загрузке аватара',
        details: error instanceof Error ? error.message : 'Неизвестная ошибка',
      },
      { status: 500 }
    );
  }
}
