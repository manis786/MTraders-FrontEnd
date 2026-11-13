import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiClient } from '../utils/apiClient';
import { 
  PackagePlus, 
  ArrowLeft, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  DollarSign, 
  Layers, 
  Upload,
  Boxes,
  Tag,
  Image as ImageIcon,
  X
} from 'lucide-react';

// Amazon & Daraz Style Professional Categories
const CATEGORIES = [
  'Electronics & Gadgets',
  'Computers & Laptops',
  'Mobile Phones & Tablets',
  'Mobile Accessories',
  'Home & Kitchen Appliances',
  'Gaming Consoles & Accessories',
  'Smart Watches & Wearables',
  'Audio, Headphones & Speakers',
  'Cameras & Photography',
  'Men\'s Fashion & Clothing',
  'Women\'s Fashion & Clothing',
  'Health & Beauty Skincare',
  'Sports & Fitness Equipment',
  'Groceries & Supermarket',
  'Books, Office & Stationery',
  'Automotive & Bike Accessories',
  'Toys, Baby & Kids',
  'Tools, Hardware & DIY'
];

export const ProductCreateScreen = () => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    discountPrice: '',
    description: '',
    category: CATEGORIES[0],
    countInStock: '',
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Multiple local files selection handler with instant previews
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    console.log("1. [DEBUG] Selected file objects:", files);
    if (files.length > 0) {
      setImageFiles(files);
      const previews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(previews);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      let uploadedImageUrls = [];

      // Agar user ne local files select ki hain toh sab ko Cloudinary par upload karo
      if (imageFiles.length > 0) {
        setUploadingImage(true);
        console.log("2. [DEBUG] Preparing to upload multiple images to Cloudinary...");

        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dwpixlcle';

        for (let i = 0; i < imageFiles.length; i++) {
          const data = new FormData();
          data.append('file', imageFiles[i]);
          data.append('upload_preset', 'memon_traders_preset');

          const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
          console.log(`3. [DEBUG] Uploading image ${i + 1} to:`, cloudinaryUrl);

          const cloudinaryRes = await fetch(cloudinaryUrl, {
            method: 'POST',
            body: data,
          });

          const uploadResult = await cloudinaryRes.json();
          console.log(`4. [DEBUG] Cloudinary Response for image ${i + 1}:`, uploadResult);

          if (!cloudinaryRes.ok) {
            throw new Error(uploadResult.error?.message || `Cloudinary upload failed for image ${i + 1}`);
          }

          if (uploadResult.secure_url) {
            uploadedImageUrls.push(uploadResult.secure_url);
          }
        }
        setUploadingImage(false);
        console.log("5. [DEBUG] All images uploaded successfully:", uploadedImageUrls);
      } else {
        uploadedImageUrls = ['https://via.placeholder.com/300?text=No+Image'];
      }

      const payload = {
        title: formData.name,
        price: Number(formData.price),
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : 0,
        description: formData.description,
        images: uploadedImageUrls, // Array of all image URLs
        image: uploadedImageUrls[0], // Main thumbnail as primary image
        category: formData.category,
        countInStock: Number(formData.countInStock),
      };

      console.log("6. [DEBUG] Sending Product Payload to Backend API:", payload);

      const apiRes = await apiClient('/products', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      console.log("7. [DEBUG] Backend product creation response:", apiRes);

      setSuccess(true);
      setTimeout(() => {
        navigate('/admin');
      }, 1500);
    } catch (err) {
      console.error("8. [DEBUG ERROR] Catch block error:", err);
      setError(err.message || 'Failed to create product in database');
    } finally {
      setLoading(false);
      setUploadingImage(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link 
          to="/admin" 
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition text-sm font-medium"
        >
          <ArrowLeft size={18} />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      <div className="bg-charcoal border border-charcoal-light rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center space-x-2">
            <PackagePlus className="text-brandOrange" size={28} />
            <span>Add New <span className="text-brandOrange">Product Catalog</span></span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Publish items with multiple gallery images, sale discounts, and professional categories.
          </p>
        </div>

        {/* Status Alerts */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl flex items-center space-x-3 text-sm">
            <AlertCircle size={20} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 p-4 rounded-xl flex items-center space-x-3 text-sm">
            <CheckCircle2 size={20} className="shrink-0" />
            <span>Product successfully published with image gallery!</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
              Product Title *
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. T900 Ultra Smart Watch Series 8"
              className="w-full bg-charcoal-dark text-white rounded-xl px-4 py-3 border border-gray-700 focus:border-brandOrange focus:outline-none focus:ring-1 focus:ring-brandOrange text-sm transition"
            />
          </div>

          {/* Pricing & Sale Discount */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                Regular Price (PKR) *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="number"
                  name="price"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="3500"
                  className="w-full bg-charcoal-dark text-white rounded-xl pl-10 pr-4 py-3 border border-gray-700 focus:border-brandOrange focus:outline-none focus:ring-1 focus:ring-brandOrange text-sm transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                Sale / Discount Price (Optional)
              </label>
              <div className="relative">
                <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brandOrange" size={18} />
                <input
                  type="number"
                  name="discountPrice"
                  min="0"
                  step="0.01"
                  value={formData.discountPrice}
                  onChange={handleChange}
                  placeholder="2800 (For Sale Badge)"
                  className="w-full bg-charcoal-dark text-white rounded-xl pl-10 pr-4 py-3 border border-gray-700 focus:border-brandOrange focus:outline-none focus:ring-1 focus:ring-brandOrange text-sm transition"
                />
              </div>
            </div>
          </div>

          {/* Custom Dropdown & Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Category Dropdown */}
            <div className="relative">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                Category *
              </label>
              <div 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full bg-charcoal-dark text-white rounded-xl px-4 py-3 border border-gray-700 flex items-center justify-between cursor-pointer hover:border-brandOrange transition text-sm"
              >
                <div className="flex items-center space-x-3">
                  <Layers size={18} className="text-gray-500" />
                  <span className="truncate">{formData.category}</span>
                </div>
                <span className="text-xs text-gray-400">&#9660;</span>
              </div>

              {isDropdownOpen && (
                <div className="absolute left-0 right-0 mt-2 bg-charcoal border border-gray-700 rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto divide-y divide-gray-800">
                  {CATEGORIES.map((cat, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setFormData({ ...formData, category: cat });
                        setIsDropdownOpen(false);
                      }}
                      className="px-4 py-3 text-sm text-gray-200 hover:bg-brandOrange hover:text-white cursor-pointer transition flex items-center"
                    >
                      {cat}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Stock */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                Initial Stock Count *
              </label>
              <div className="relative">
                <Boxes className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="number"
                  name="countInStock"
                  required
                  min="0"
                  value={formData.countInStock}
                  onChange={handleChange}
                  placeholder="50"
                  className="w-full bg-charcoal-dark text-white rounded-xl pl-10 pr-4 py-3 border border-gray-700 focus:border-brandOrange focus:outline-none focus:ring-1 focus:ring-brandOrange text-sm transition"
                />
              </div>
            </div>
          </div>

          {/* Multiple File Selector & Previews */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
              Product Images Gallery (Select Multiple from Computer) *
            </label>
            <label className="flex items-center justify-center px-4 py-3 bg-charcoal-dark border border-gray-700 rounded-xl cursor-pointer hover:border-brandOrange transition text-sm text-gray-300">
              <Upload size={18} className="mr-2 text-brandOrange" />
              <span>{imageFiles.length > 0 ? `${imageFiles.length} image(s) selected` : 'Choose local image files...'}</span>
              <input 
                type="file" 
                accept="image/*" 
                multiple
                onChange={handleFileChange} 
                className="hidden" 
              />
            </label>
            
            {/* Previews Grid */}
            {imagePreviews.length > 0 && (
              <div className="flex space-x-3 overflow-x-auto mt-3 pb-2">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="w-16 h-16 rounded-xl overflow-hidden border border-gray-700 shrink-0 bg-charcoal-dark relative">
                    <img src={preview} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                    {index === 0 && (
                      <span className="absolute bottom-0 inset-x-0 bg-brandOrange/80 text-[9px] text-white text-center font-bold py-0.5">
                        Main
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
            <p className="text-[11px] text-gray-400 mt-1">
              All selected images will automatically upload to Cloudinary and store as a gallery.
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
              Product Overview & Specifications *
            </label>
            <textarea
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="Write detailed specs, features, and warranty details..."
              className="w-full bg-charcoal-dark text-white rounded-xl p-4 border border-gray-700 focus:border-brandOrange focus:outline-none focus:ring-1 focus:ring-brandOrange text-sm transition"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-gray-800 flex justify-end space-x-3">
            <Link
              to="/admin"
              className="px-5 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 font-semibold text-sm transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading || uploadingImage}
              className="bg-brandOrange hover:bg-brandOrange-hover disabled:opacity-50 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-brandOrange/20 transition flex items-center space-x-2"
            >
              {loading || uploadingImage ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>{uploadingImage ? 'Uploading Gallery to Cloudinary...' : 'Publishing Product...'}</span>
                </>
              ) : (
                <span>Publish Product</span>
              )}
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};