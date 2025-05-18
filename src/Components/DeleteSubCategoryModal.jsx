import axios from "axios";

const API_URL = "https://ahadinash07-e-shop-backend2-for-admin-retailer.vercel.app";

const DeleteSubCategoryModal = ({
  showDeleteSubCategoryModal,
  setShowDeleteSubCategoryModal,
  subcategories,
  setCategories,
}) => {
  const handleDelete = () => {
    axios
      .delete(`${API_URL}/api/delete_subCategory/${subcategories.subCatId}`)
      .then((res) => {
        setShowDeleteSubCategoryModal(false);
        // Correctly filter out the deleted subcategory
        setCategories((prevSubCategories) =>
          prevSubCategories.filter((subCat) => subCat.subCatId !== subcategories.subCatId)
        );
      })
      .catch((err) => {
        alert(err.response?.data.error || "Failed to delete SubCategory");
      });
  };

  if (!showDeleteSubCategoryModal) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-700 bg-opacity-50 z-20">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-xl font-semibold mb-4">Delete SubCategory</h2>
        <p className="mb-4">Are you sure you want to delete this SubCategory?</p>
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => setShowDeleteSubCategoryModal(false)}
            className="px-4 py-2 bg-gray-800 text-white rounded"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteSubCategoryModal;