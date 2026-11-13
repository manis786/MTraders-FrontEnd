import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiClient } from '../utils/apiClient';
import { 
  ArrowLeft, 
  Star, 
  ShoppingCart, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  MessageSquarePlus
} from 'lucide-react';

export const ProductScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Gallery Active Image State
  const [activeImage, setActiveImage] = useState('');
  
  // Cart Quantity State
  const [qty, setQty] = useState(1);

  // Review Form States
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  // Fetch Product Details
  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await apiClient(`/products/${id}`);
      setProduct(data);
      // Default to first image in images array or thumbnail
      if (data.images && data.images.length > 0) {
        setActiveImage(data.images[0]);
      } else {
        setActiveImage(data.image);
      }
    } catch (err) {
      setError(err.message || 'Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

const addToCartHandler = () => {
    const existingCart = JSON.parse(localStorage.getItem('cartItems')) || [];
    const itemPrice = product.discountPrice > 0 ? product.discountPrice : product.price;

    const newItem = {
      product: product._id || product.id,
      title: product.title,
      image: product.image || (product.images && product.images[0]),
      price: itemPrice,
      countInStock: product.countInStock,
      qty: Number(qty),
    };

    const existItemIndex = existingCart.findIndex((x) => x.product === newItem.product);

    let updatedCart;
    if (existItemIndex >= 0) {
      existingCart[existItemIndex].qty = newItem.qty;
      updatedCart = existingCart;
    } else {
      updatedCart = [...existingCart, newItem];
    }

    localStorage.setItem('cartItems', JSON.stringify(updatedCart));

    // 🚀 Dispatch Custom Event to notify Navbar instantly!
    window.dispatchEvent(new Event('cartUpdated'));

    navigate('/cart');
  };

  // Handle Submit Review
  const submitReviewHandler = async (e) => {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess('');
    setReviewLoading(true);

    try {
      await apiClient(`/products/${id}/reviews`, {
        method: 'POST',
        body: JSON.stringify({ rating: Number(rating), comment }),
      });
      setReviewSuccess('Review submitted successfully! Visible to all users.');
      setComment('');
      fetchProduct(); // Refresh product data to show new review
    } catch (err) {
      setReviewError(err.message || 'Failed to submit review');
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="animate-spin text-brandOrange" size={40} />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12 space-y-4">
        <AlertCircle className="mx-auto text-red-500" size={48} />
        <h2 className="text-xl font-bold text-white">{error || 'Product not found'}</h2>
        <Link to="/" className="inline-block bg-brandOrange text-white px-6 py-2.5 rounded-xl font-semibold">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16 px-4 sm:px-6 lg:px-8">
      
      {/* Back Button */}
      <Link to="/" className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition text-sm font-medium pt-4">
        <ArrowLeft size={18} />
        <span>Back to Store</span>
      </Link>

      {/* Main Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Multiple Images Gallery (5 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Big Image Preview */}
          <div className="w-full h-[380px] sm:h-[450px] bg-charcoal border border-charcoal-light rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center">
            <img src={activeImage} alt={product.title} className="w-full h-full object-cover transition duration-300" />
          </div>

          {/* Thumbnail Selector Row */}
          {product.images && product.images.length > 1 && (
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {product.images.map((imgUrl, index) => (
                <div 
                  key={index}
                  onClick={() => setActiveImage(imgUrl)}
                  className={`w-20 h-20 rounded-xl overflow-hidden cursor-pointer border-2 transition shrink-0 bg-charcoal ${
                    activeImage === imgUrl ? 'border-brandOrange scale-95 shadow-lg shadow-brandOrange/20' : 'border-gray-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt={`Thumb ${index}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Middle: Product Info (4 cols) */}
        <div className="lg:col-span-6 space-y-6 bg-charcoal border border-charcoal-light p-6 sm:p-8 rounded-2xl shadow-2xl">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider bg-brandOrange/10 text-brandOrange border border-brandOrange/20 px-3 py-1 rounded-full">
              {product.category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-3">{product.title}</h1>
            
            {/* Rating Stars Summary */}
            <div className="flex items-center space-x-3 mt-3">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    fill={i < Math.floor(product.rating || 0) ? 'currentColor' : 'none'} 
                    className={i < Math.floor(product.rating || 0) ? '' : 'text-gray-600'} 
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-gray-300">
                {(product.rating || 0).toFixed(1)} ({product.numReviews || 0} reviews)
              </span>
            </div>
          </div>

          {/* Price Tag */}
          <div className="flex items-baseline space-x-4 border-y border-gray-800 py-4">
            {product.discountPrice > 0 ? (
              <>
                <span className="text-3xl font-black text-brandOrange">PKR {product.discountPrice.toLocaleString()}</span>
                <span className="text-lg font-bold text-gray-500 line-through">PKR {product.price.toLocaleString()}</span>
              </>
            ) : (
              <span className="text-3xl font-black text-white">PKR {product.price.toLocaleString()}</span>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-300 text-sm leading-relaxed">{product.description}</p>

          {/* Stock Status & Quantity */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400 font-medium">Availability:</span>
              <span className={`font-bold px-3 py-1 rounded-full text-xs ${product.countInStock > 0 ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                {product.countInStock > 0 ? `In Stock (${product.countInStock} available)` : 'Out of Stock'}
              </span>
            </div>

            {product.countInStock > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm font-medium">Quantity:</span>
                <select
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="bg-charcoal-dark text-white border border-gray-700 rounded-xl px-4 py-2 focus:border-brandOrange focus:outline-none text-sm font-bold"
                >
                  {[...Array(Math.min(product.countInStock, 10))].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={addToCartHandler}
            disabled={product.countInStock === 0}
            className="w-full bg-brandOrange hover:bg-brandOrange-hover disabled:opacity-50 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-brandOrange/20 transition flex items-center justify-center space-x-2 text-sm"
          >
            <ShoppingCart size={18} />
            <span>Add to Shopping Cart</span>
          </button>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-800 text-center text-xs text-gray-400">
            <div className="flex flex-col items-center space-y-1">
              <ShieldCheck className="text-brandOrange" size={20} />
              <span>100% Genuine</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <Truck className="text-brandOrange" size={20} />
              <span>Fast Shipping</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <RotateCcw className="text-brandOrange" size={20} />
              <span>Easy Returns</span>
            </div>
          </div>

        </div>

      </div>

      {/* Reviews Section */}
      <div className="bg-charcoal border border-charcoal-light rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 mt-12">
        <h2 className="text-xl font-black text-white flex items-center space-x-2">
          <MessageSquarePlus className="text-brandOrange" size={24} />
          <span>Customer Reviews & Ratings ({product.reviews?.length || 0})</span>
        </h2>

        {/* Existing Reviews List */}
        <div className="space-y-4 divide-y divide-gray-800">
          {product.reviews?.length === 0 && (
            <p className="text-gray-400 text-sm italic py-2">No reviews yet for this product. Be the first to review!</p>
          )}

          {product.reviews?.map((review) => (
            <div key={review._id} className="pt-4 space-y-2 first:pt-0">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">{review.name}</span>
                <span className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={14} 
                    fill={i < review.rating ? 'currentColor' : 'none'} 
                    className={i < review.rating ? '' : 'text-gray-600'} 
                  />
                ))}
              </div>
              <p className="text-gray-300 text-sm">{review.comment}</p>
            </div>
          ))}
        </div>

        {/* Write a Review Form */}
        <div className="pt-6 border-t border-gray-800">
          <h3 className="text-lg font-bold text-white mb-4">Write a Customer Review</h3>

          {reviewError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl flex items-center space-x-2 text-sm mb-4">
              <AlertCircle size={18} />
              <span>{reviewError}</span>
            </div>
          )}

          {reviewSuccess && (
            <div className="bg-green-500/10 border border-green-500/30 text-green-400 p-3 rounded-xl flex items-center space-x-2 text-sm mb-4">
              <CheckCircle size={18} />
              <span>{reviewSuccess}</span>
            </div>
          )}

          <form onSubmit={submitReviewHandler} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                Rating
              </label>
              <select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="w-full sm:w-48 bg-charcoal-dark text-white border border-gray-700 rounded-xl px-4 py-2.5 focus:border-brandOrange focus:outline-none text-sm font-bold"
              >
                <option value="5">5 - Excellent</option>
                <option value="4">4 - Very Good</option>
                <option value="3">3 - Good</option>
                <option value="2">2 - Fair</option>
                <option value="1">1 - Poor</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                Comment / Feedback
              </label>
              <textarea
                rows={3}
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this product (visible to all users)..."
                className="w-full bg-charcoal-dark text-white rounded-xl p-4 border border-gray-700 focus:border-brandOrange focus:outline-none text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={reviewLoading}
              className="bg-brandOrange hover:bg-brandOrange-hover disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-xl text-sm shadow-lg shadow-brandOrange/20 transition flex items-center space-x-2"
            >
              {reviewLoading ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  <span>Submitting Review...</span>
                </>
              ) : (
                <span>Submit Review</span>
              )}
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};