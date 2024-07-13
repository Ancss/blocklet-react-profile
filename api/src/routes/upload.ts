import express from 'express';
import multer from 'multer';
import path from 'path';

const fs = require('fs').promises;

const router = express.Router();

// 配置 multer
const upload = multer({ dest: 'public/uploads/' });

router.post('/', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file uploaded' });
  }

  const { filename, path: tempPath } = req.file;
  const targetPath = path.join('public', 'uploads', filename);

  try {
    await fs.rename(tempPath, targetPath);
    res.json({ success: true, path: `/uploads/${filename}` });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ success: false, error: 'Failed to upload file' });
  }
});

export default router;
