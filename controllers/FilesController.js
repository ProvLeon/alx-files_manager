import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';
import redisClient from '../utils/redis';
import dbClient from '../utils/db';

const FilesController = {
  async postUpload(req, res) {
    const token = req.headers['X-Token'];
    const {
      name, type, parentId = 0, isPublic = false, data,
    } = req.body;

    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const tokenKey = `auth_${token}`;
    const userId = await redisClient.get(tokenKey);

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    if (!name) return res.status(400).json({ error: 'Missing name' });

    if (!type || !['folder', 'file', 'image'].includes(type)) {
      return res.status(400).json({ error: 'Missing type' });
    }

    if (type !== 'folder' && !data) {
      return res.status(400).json({ error: 'Missing data' });
    }

    const parent = parentId !== 0 ? await dbClient
      .db.collection('files')
      .findOne({ _id: parentId }) : null;

    if (parentId !== 0 && !parent) {
      return res.status(400).json({ error: 'Parent not found' });
    }

    if (parent && parent.type !== 'folder') {
      return res.status(400).json({ error: 'Parent is not a folder' });
    }

    const fileDocument = {
      userId,
      name,
      type,
      isPublic,
      parentId,
    };

    if (type !== 'folder') {
      const result = await dbClient.db.collection('files').insertOne(fileDocument);
      return res.status(201).json({ id: result.insertedId, ...fileDocument });
    }

    const FOLDER_PATH = process.env.FOLDER_PATH || '/tmp/files_manager';
    await fs.mkdir(FOLDER_PATH, { recursive: true });

    const localPath = path.join(FOLDER_PATH, uuidv4());
    await fs.writeFile(localPath, Buffer.from(data, 'base64'));

    fileDocument.localPath = localPath;

    const result = await dbClient
      .db.collection('files').insertOne(fileDocument);

    return res.status(201).json({ id: result.insertedId, ...fileDocument });
  },
};

export default FilesController;
