import axios from "axios";

const API_URL = 'https://ahadinash07-e-shop-backend2-for-admin-retailer.vercel.app';

const DeleteRoleModal = ({ showModal, setShowModal, role, setRoles }) => {

    const handleDelete = () => {
        axios.delete(`${API_URL}/delete_admin_role/${role.roleId}`)
        .then((res) => {
            setShowModal(false);
            setRoles((prevRoles) => prevRoles.filter((u) => u.roleId !== role.roleId));
        })
        .catch((err) => {
            alert(err.response?.data.error || "Failed to delete Role")
        });
    };

    if(!showModal) return null;

    return(
        <div className="fixed inset-0 flex justify-center items-center bg-gray-700 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                <h2 className="text-xl font-semibold mb-4">Delete Role</h2>
                <p className="mb-4">Are you sure you want to delete this role?</p>
                <div className="flex justify-end gap-4">
                    <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-800 text-white rounded">Cancel</button>
                    <button type="button" onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded">Delete</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteRoleModal;