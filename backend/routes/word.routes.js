import express from 'express';

import checkAuth from '../middleware/check-auth.js';
import { getAllWords, addWord, updateWord, deleteWords } from '../controllers/word.controller.js';

const wordRoutes = express.Router();

wordRoutes.get('', getAllWords);
wordRoutes.post('', checkAuth, addWord);
wordRoutes.put('/:id', checkAuth, updateWord);
wordRoutes.delete('', checkAuth, deleteWords);

export default wordRoutes;
