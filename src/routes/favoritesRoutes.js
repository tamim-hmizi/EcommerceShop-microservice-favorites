import express from 'express';
import {
  getFavorites,
  addFavorite,
  removeFavorite,
} from '../controllers/favoritesController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.get('/', getFavorites);
router.post('/add', addFavorite);
router.delete('/remove', removeFavorite);

export default router;
