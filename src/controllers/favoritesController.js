import User from '../models/User.js';
import '../models/Product.js';

const getFavorites = async (req, res) => {
  const user = await User.findById(req.user._id).populate('favorites');
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(user.favorites);
};

const addFavorite = async (req, res) => {
  const { productId } = req.body;
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (!user.favorites.some((fav) => fav.toString() === productId)) {
    user.favorites.push(productId);
    await user.save();
  }

  res.status(200).json(user.favorites);
};

const removeFavorite = async (req, res) => {
  const { productId } = req.body;
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  user.favorites = user.favorites.filter((fav) => fav.toString() !== productId);
  await user.save();

  res.status(200).json(user.favorites);
};

export { getFavorites, addFavorite, removeFavorite };
