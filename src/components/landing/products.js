import React, { useState, useEffect, useCallback } from "react";
import { StarIcon, HeartIcon, ShoppingCartIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_BASE_URL;
const cdnUrl = process.env.REACT_APP_CDN_BASE_URL;


const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  
  const normalizeUrl = useCallback(
    (url) => {
      if (!url) return null;
  
      try {
        // Buat URL object untuk parsing
        const urlObj = new URL(url.replace(/\\/g, "/"));
  
        // Ambil pathname dari URL (bagian setelah host)
        const pathname = urlObj.pathname;
  
        // Gabungkan dengan CDN URL
        return new URL(pathname, cdnUrl).toString();
      } catch (e) {
        // Jika URL invalid, coba cara alternatif
        const cleanPath = url
          .replace(/^(?:https?:)?(?:\/\/)?[^/]+/, '') // Hapus protocol dan host (perbaikan escape character)
          .replace(/\\/g, "/")                         // Normalize slashes
          .replace(/^\/+/, '/');                       // Pastikan hanya ada satu leading slash
  
        return `${cdnUrl}${cleanPath}`;
      }
    },
    []
  );
  const price = product.price ? product.price.toLocaleString() : 'N/A';
  const originalPrice = product.originalPrice ? product.originalPrice.toLocaleString() : null;
  const shopAddress = product.shopId?.address;
  const fullAddress = shopAddress ? 
    `${shopAddress.province}` : 
    'Alamat tidak tersedia';

  return (
    <div
      className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <div className="aspect-w-1 aspect-h-1">
          <img
            src={normalizeUrl(product.cover?.url)}
            alt={product.name}
            className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        {/* Quick Action Buttons */}
        <div className={`absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10`}>
          <button 
            onClick={() => setIsFavorite(!isFavorite)}
            className="p-2 bg-white rounded-full hover:bg-gray-100 transform hover:scale-110 transition-all duration-300 shadow-lg"
          >
            <HeartIcon className={`h-5 w-5 ${isFavorite ? 'text-red-500' : 'text-gray-600'}`} />
          </button>
          <button className="p-2 bg-white rounded-full hover:bg-gray-100 transform hover:scale-110 transition-all duration-300 shadow-lg">
            <ShoppingCartIcon className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.discount && (
            <span className="px-2 py-1 text-xs font-medium text-white bg-red-500 rounded-lg shadow-lg">
              {product.discount}% OFF
            </span>
          )}
          {product.isNew && (
            <span className="px-2 py-1 text-xs font-medium text-white bg-[#4F46E5] rounded-lg shadow-lg">
              New
            </span>
          )}
          {product.stock <= 5 && (
            <span className="px-2 py-1 text-xs font-medium text-white bg-orange-500 rounded-lg shadow-lg">
              Stok Terbatas
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        {/* Category & Shop Info */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-[#4F46E5] bg-indigo-50 px-2 py-1 rounded-full">
            {product.categoryId?.name}
          </span>
          <span className="text-xs text-gray-500">
            Stok: {product.stock}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-[#4F46E5] transition-colors line-clamp-1">
          {product.name}
        </h3>

        {/* Shop Name */}
        <div className="flex items-center space-x-1 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span className="text-sm text-gray-600">{product.shopId?.name}</span>
        </div>

        {/* Location */}
        <div className="flex items-center space-x-1 mb-3">
          <MapPinIcon className="h-4 w-4 text-gray-400" />
          <span className="text-xs text-gray-500 line-clamp-1">{fullAddress}</span>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Price & Action */}
        <div className="flex items-center justify-between">
          <div>
            {originalPrice ? (
              <div className="space-y-0.5">
                <span className="text-xs text-gray-500 line-through">
                  Rp {originalPrice}
                </span>
                <div className="text-lg font-bold text-gray-900">
                  Rp {price}
                </div>
              </div>
            ) : (
              <div className="text-lg font-bold text-gray-900">
                Rp {price}
              </div>
            )}
          </div>
          <button className="bg-[#4F46E5] text-white px-4 py-2 rounded-lg hover:bg-[#4338CA] transform hover:scale-105 transition-all duration-300 shadow-lg">
            Beli
          </button>
        </div>
      </div>
    </div>
  );
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [loading, setLoading] = useState(true);

  // Definisikan kategori yang ingin ditampilkan untuk "Semua"
  const featuredCategories = [
    '6785f0775a994cdd532040ad', // Makanan
    '6785f09d5a994cdd532040b0', // Aksesoris
    '6785f0d35a994cdd532040b3',  // Souvenir
    '6785f0eb5a994cdd532040b6', // Kerajinan
    '6785f0fc5a994cdd532040b9', // Batik
    // Tambahkan ID kategori lain sesuai kebutuhan
  ];

  const normalizeUrl = useCallback(
    (url) => {
      if (!url) return null;

      try {
        // Buat URL object untuk parsing
        const urlObj = new URL(url.replace(/\\/g, "/"));

        // Ambil pathname dari URL (bagian setelah host)
        const pathname = urlObj.pathname;

        // Gabungkan dengan CDN URL
        return new URL(pathname, cdnUrl).toString();
      } catch (e) {
        // Jika URL invalid, coba cara alternatif
        const cleanPath = url
          .replace(/^(?:https?:)?(?:\/\/)?[^/]+/, '') // Hapus protocol dan host (perbaikan escape character)
          .replace(/\\/g, "/")                         // Normalize slashes
          .replace(/^\/+/, '/');                       // Pastikan hanya ada satu leading slash

        return `${cdnUrl}${cleanPath}`;
      }
    },
    []
  );

  useEffect(() => {
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${apiUrl}/category`);
        setCategories(response.data.categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, [apiUrl]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        if (activeCategory === 'Semua') {
          // Fetch products dari multiple kategori
          const responses = await Promise.all(
            featuredCategories.map(categoryId =>
              axios.get(`${apiUrl}/category/${categoryId}`)
            )
          );

          // Gabungkan semua produk dari berbagai kategori
          const allProducts = responses.flatMap(response => 
            response.data.products.map(product => ({
              ...product,
              cover: {
                ...product.cover,
                url: normalizeUrl(product.cover?.url)
              }
            }))
          );

          // Acak urutan produk dan ambil maksimal 12 produk
          const shuffledProducts = allProducts
            .sort(() => Math.random() - 0.5)
            .slice(0, 12);

          setProducts(shuffledProducts);
        } else {
          // Fetch products untuk kategori spesifik (kode yang sudah ada)
          const response = await axios.get(`${apiUrl}/category/${activeCategory}`);
          setProducts(response.data.products.map(product => ({
            ...product,
            cover: {
              ...product.cover,
              url: normalizeUrl(product.cover?.url)
            }
          })));
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeCategory, apiUrl, normalizeUrl]);

  return (
    <section id="products" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white rounded-full shadow-lg shadow-indigo-500/30">
            Produk Unggulan
          </span>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Koleksi Terbaik</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Temukan berbagai produk berkualitas dari pengrajin lokal terbaik. Dari makanan khas hingga kerajinan tangan tradisional.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
        <button
            onClick={() => setActiveCategory('Semua')} // Reset to show all products
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
              activeCategory === 'Semua'
                ? 'bg-[#4F46E5] text-white shadow-lg shadow-indigo-500/30'
                : 'bg-white text-gray-600 hover:bg-[#4F46E5] hover:text-white'
            }`}
          >
            Semua
          </button>
          {categories.map((category) => (
            <button
              key={category._id}
              onClick={() => setActiveCategory(category._id)} // Set active category to category ID
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === category._id
                  ? 'bg-[#4F46E5] text-white shadow-lg shadow-indigo-500/30'
                  : 'bg-white text-gray-600 hover:bg-[#4F46E5] hover:text-white'
              }`}
            >
              {category.name}
            </button>
          ))}
          
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4F46E5]"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <button className="inline-flex items-center justify-center space-x-2 bg-white text-[#4F46E5] font-medium px-6 py-3 rounded-lg border border-[#4F46E5] hover:bg-[#4F46E5] hover:text-white transition-all duration-300 shadow-lg shadow-indigo-500/10 group">
            <span>Lihat Semua Produk</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Products;
