import express from 'express';
import {
  getFavorites,
  addFavorite,
  removeFavorite,
} from '../controllers/favoritesController.js';


const router = express.Router();

router.get('/', getFavorites);
router.post('/add', addFavorite);
router.delete('/remove', removeFavorite);

export default router;
