import { Router } from 'express';

import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'file:./dev.db'
    }
  }
});

router.get('/', async (_, res) => {
  try {
    const profile = await prisma.profile.findFirst();
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

router.get('/:did', async (req, res) => {
  try {
    const { did } = req.params;
    const profile = await prisma.profile.findUnique({ where: { did } });
    if (profile) {
      res.json(profile);
    } else {
      res.status(404).json({ error: 'Profile not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});


router.post('/', async (req, res) => {
  try {
    const { did, username, email, phone, avatar, language, theme } = req.body;

    // 验证必要的字段
    if (!did || !username || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const profile = await prisma.profile.findUnique({
      where: { did: did }
    });

    if (profile) {
      // 如果记录存在，直接返回
      return res.json(profile);
    } else {
      // 如果记录不存在，创建新记录
      const newProfile = await prisma.profile.create({
        data: {
          did,
          username,
          email,
          phone: phone || null,
          avatar: avatar || null,
          language: language || 'en',
          theme: theme || 'light',
        },
      });
      // 根据操作结果返回相应的状态码
      const statusCode = newProfile.createdAt === newProfile.updatedAt ? 201 : 200;
      res.status(statusCode).json(newProfile);
      return res.json(newProfile);
    }

  } catch (error) {
    console.error('Error upserting profile:', error);
    res.status(500).json({ error: 'Failed to upsert profile' });
  }
});

router.put('/', async (req, res) => {
  try {
    const data: ProfileData = req.body;
    // @ts-ignore
    const updatedProfile: Profile | null = await prisma.profile.update({
      // @ts-ignore
      where: { id: data.id },
      data: {
        username: data.username,
        email: data.email,
        phone: data.phone,
        avatar: data.avatar,
        language: data.language,
        theme: data.theme,
      },
    })!;
    res.json(updatedProfile);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

interface ProfileData {
  id: string;
  did: string;
  username: string;
  email: string;
  phone: string;
  avatar?: string;
  language?: string;
  theme?: string;
}

interface Profile {
  id: string;
  did: string;
  username: string;
  email: string;
  phone: string;
  avatar: string;
  language: string;
  theme: string;
}

export default router;
