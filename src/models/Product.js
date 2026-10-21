import mongoose from 'mongoose';

// Read-only view of the products collection owned by the products service,
// used to populate a user's favorites.
const productSchema = new mongoose.Schema(
  { name: String, price: Number, image: String },
  { strict: false }
);

export default mongoose.models.Product || mongoose.model('Product', productSchema);
