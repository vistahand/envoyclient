import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import toast from "react-hot-toast";
import { GoPerson } from "react-icons/go";

const SettingsPage = () => {
  const { user, updateProfile, updatePassword, updateProfileImage } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");
  const [country, setCountry] = useState(user?.country || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [previewImage, setPreviewImage] = useState(user?.profileImage || "");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileError, setFileError] = useState("");

  // Handle profile image selection and upload
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Clear previous errors
    setFileError("");
    
    // Check file size (10MB = 10 * 1024 * 1024 bytes)
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      setFileError("File size exceeds 10MB limit. Please choose a smaller image.");
      return;
    }

    setPreviewImage(URL.createObjectURL(file));
    setUploading(true);

    try {
      await updateProfileImage(file);
      toast.success("Profile image updated successfully!");
    } catch (error) {
      toast.error(error || "Profile image update failed.");
    }

    setUploading(false);
  };

  // Handle profile information update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({ phone: phoneNumber, address, country });
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Profile update failed!");
    }
  };

  // Handle password update
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      await updatePassword(currentPassword, newPassword);
      toast.success("Password updated successfully");
      // Clear password fields after successful update
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error("Password update failed");
    }
  };

  return (
    <div className="w-full mx-auto rounded-lg p-2 mt-6 flex flex-col gap-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Profile Image Section */}
        <div className="w-full md:w-1/3 bg-[#F7F7F7] p-6 rounded-tr-lg rounded-br-lg flex flex-col items-center">
          <img
            src={previewImage || ""}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-gray-300 shadow-md object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = <GoPerson className="w-5 h-5 text-gray-500" />;
            }}
          />
          <label
            htmlFor="profileImage"
            disabled={uploading}
            className={`mt-4 cursor-pointer bg-primary text-white px-4 py-2 rounded-lg ${
              uploading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {uploading ? "Uploading..." : "Add New Photo"}
          </label>
          <input
            type="file"
            id="profileImage"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          <div className="py-5">
            <p className="text-sm text-gray-600 text-center bg-gray-100 border border-gray-300 rounded-lg p-3">
              Upload a new avatar. Larger image will be resized automatically.
              Maximum upload size is <span className="font-semibold">10mb</span>
            </p>
          </div>
          {fileError && (
            <div className="mt-2 p-2 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              <p className="text-sm">{fileError}</p>
            </div>
          )}
        </div>

        {/* Profile Settings Form */}
        <div className="w-full md:w-2/3">
          <h2 className="text-3xl font-bold text-primary mb-10">
            Edit Profile
          </h2>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium">Email</label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full p-3 border rounded-lg bg-gray-100 text-gray-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">
                  Country
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium">Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-3 border rounded-lg"
              />
            </div>

            <button
              type="submit"
              className="w-[50%] bg-primary hover:bg-primary-dark text-white py-3 rounded-lg font-semibold transition"
            >
              Update Profile
            </button>
          </form>
        </div>
      </div>

      {/* Update Password Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-primary mb-4">
          Update Password
        </h2>
        <form onSubmit={handlePasswordUpdate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <label className="block text-gray-700 font-medium">
                Current Password
              </label>
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full p-3 border rounded-lg"
              />
              <div
                className="absolute right-3 top-10 cursor-pointer"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? (
                  <AiOutlineEyeInvisible />
                ) : (
                  <AiOutlineEye />
                )}
              </div>
            </div>
            <div className="relative">
              <label className="block text-gray-700 font-medium">
                New Password
              </label>
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-3 border rounded-lg"
              />
              <div
                className="absolute right-3 top-10 cursor-pointer"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </div>
            </div>
            <div className="relative">
              <label className="block text-gray-700 font-medium">
                Confirm New Password
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 border rounded-lg"
              />
              <div
                className="absolute right-3 top-10 cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <AiOutlineEyeInvisible />
                ) : (
                  <AiOutlineEye />
                )}
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="w-[50%] bg-primary hover:bg-primary-dark text-white py-3 rounded-lg font-semibold transition"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;