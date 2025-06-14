import User from '../models/User.js';

const getFavorites = async (req, res) => {
  const user = await User.findById(req.user._id).populate('favorites');
  if (user) {
    res.json(user.favorites);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

const addFavorite = async (req, res) => {
  const { productId } = req.body;
  const user = await User.findById(req.user._id);

  if (!user.favorites.includes(productId)) {
    user.favorites.push(productId);
    await user.save();
  }

  res.status(200).json(user.favorites);
};

const removeFavorite = async (req, res) => {
  const { productId } = req.body;
  const user = await User.findById(req.user._id);

  user.favorites = user.favorites.filter(
    (fav) => fav.toString() !== productId
  );
  await user.save();

  res.status(200).json(user.favorites);
};

export { getFavorites, addFavorite, removeFavorite };
