import { useState, useEffect } from "react";
import axios from "axios";

const ProductDetailsModal = ({ showModal, setShowModal, product }) => {
  const [productDetails, setProductDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProductDetails = async () => {
      if (product && showModal) {
        setLoading(true);
        setError(null);
        try {
          const response = await axios.get(
            `https://ahadinash07-e-shop-backend2-for-admin-retailer.vercel.app/products/${product.productId}`
          );
          if (isMounted) {
            console.log("Product details response:", response.data.data);
            setProductDetails(response.data.data);
          }
        } catch (error) {
          if (isMounted) {
            setError("Failed to fetch product details.");
            console.error("Error fetching product details:", error);
          }
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      }
    };

    fetchProductDetails();

    return () => {
      isMounted = false;
    };
  }, [product, showModal]);

  // Helper function to safely parse JSON
  const safeParseJSON = (value) => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (typeof value === "string") {
      try {
        return JSON.parse(value) || [];
      } catch (e) {
        console.error("Failed to parse JSON:", value, e);
        return [];
      }
    }
    return [];
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 sm:p-6 transition-opacity duration-300">
      <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Product Details</h2>
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-600 hover:text-gray-900 text-xl sm:text-2xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-full w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {loading ? (
          <p className="text-gray-600 text-base sm:text-lg animate-pulse">Loading product details...</p>
        ) : error ? (
          <p className="text-red-600 text-base sm:text-lg font-medium">{error}</p>
        ) : productDetails ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Product Images */}
            <div className="space-y-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Images</h3>
              {safeParseJSON(productDetails.images).length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {safeParseJSON(productDetails.images).map((image, index) => (
                    <div
                      key={index}
                      className="relative overflow-hidden rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-200 group"
                    >
                      <img
                        src={image}
                        alt={`Product ${index + 1}`}
                        className="w-full aspect-square object-contain p-2 sm:p-3 transition-transform duration-200 group-hover:scale-105"
                        onError={(e) => (e.target.src = "https://via.placeholder.com/300")}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm sm:text-base italic">No images available.</p>
              )}
            </div>

            {/* Product Information */}
            <div className="space-y-5">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{productDetails.productName}</h3>
                <p className="text-gray-500 text-sm sm:text-base mt-1">{productDetails.brand || "N/A"}</p>
              </div>

              <div>
                <h4 className="text-base sm:text-lg font-semibold text-gray-800">Price</h4>
                <p className="text-xl sm:text-2xl font-bold text-blue-700">
                  {isNaN(parseFloat(productDetails.price))
                    ? "N/A"
                    : `₹${parseFloat(productDetails.price).toFixed(2)}`}
                </p>
              </div>

              <div>
                <h4 className="text-base sm:text-lg font-semibold text-gray-800">Description</h4>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed line-clamp-4">
                  {productDetails.description || "No description available"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-base sm:text-lg font-semibold text-gray-800">Category</h4>
                  <p className="text-gray-600 text-sm sm:text-base">{productDetails.category || "N/A"}</p>
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-semibold text-gray-800">Subcategory</h4>
                  <p className="text-gray-600 text-sm sm:text-base">{productDetails.subcategory || "N/A"}</p>
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-semibold text-gray-800">Quantity Available</h4>
                  <p className="text-gray-600 text-sm sm:text-base">{productDetails.quantity || "0"}</p>
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-semibold text-gray-800">Added On</h4>
                  <p className="text-gray-600 text-sm sm:text-base">
                    {productDetails.addedAt
                      ? new Date(productDetails.addedAt).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>

              {/* Colors */}
              {safeParseJSON(productDetails.colors).length > 0 && (
                <div>
                  <h4 className="text-base sm:text-lg font-semibold text-gray-800">Colors</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {safeParseJSON(productDetails.colors).map((color, index) => (
                      <span
                        key={index}
                        className="flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors duration-200"
                      >
                        <span
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: color.toLowerCase() }}
                        ></span>
                        {color}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {safeParseJSON(productDetails.sizes).length > 0 && (
                <div>
                  <h4 className="text-base sm:text-lg font-semibold text-gray-800">Sizes</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {safeParseJSON(productDetails.sizes).map((size, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors duration-200"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Features */}
              {safeParseJSON(productDetails.features).length > 0 && (
                <div>
                  <h4 className="text-base sm:text-lg font-semibold text-gray-800">Features</h4>
                  <ul className="list-disc pl-5 mt-2 text-gray-600 text-sm sm:text-base space-y-1">
                    {safeParseJSON(productDetails.features).map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ) : (
          <p className="text-gray-600 text-base sm:text-lg italic">No product details available.</p>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsModal;