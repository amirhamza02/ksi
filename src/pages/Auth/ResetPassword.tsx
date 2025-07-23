import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useParams } from "react-router-dom";
import  {authApi}  from "../../services/atuhApi";

const ResetPassword: React.FC = () => {
  const location = useLocation()
  const [error, setError] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Extract token from query parameters
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token") || ""; // Get token from ?token=...


  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      setFormData(prev => ({ ...prev, [name]: value }))
      if (error[name]) {
        setError(prev => ({ ...prev, [name]: '' }))
      }
    }

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!validateForm()) {
        return;
      }

      setIsLoading(true);

      if (!token) {
        setError({ general: "Invalid or missing token." });
        setIsLoading(false);
        return;
      }

      authApi
        .resetPassword({
          token: token,
          newPassword: formData.password,
          confirmPassword: formData.confirmPassword,
        })
        .then(() => {
          setSuccess("Password has been reset successfully.");
          setFormData({ password: "", confirmPassword: "" });
        })
        .catch((err) => {
          console.log("Reset password error:", err);
          setError({ general: err.message || "Failed to reset password" });
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl card-shadow p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-100 p-2">
                <img
                  src="./king-sejong.jpg"
                  alt="KSI Logo"
                  className="w-full h-full object-contain rounded"
                />
              </div>
              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-100 p-2">
                <img
                  src="./iub-logo.png"
                  alt="IUB Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-primary">
              Reset Your Password
            </h2>
            <p className="text-gray-600 mt-2">Enter your new password below</p>
          </div>

         <form onSubmit={handleSubmit} className="space-y-4">
              {/* Remove duplicate error.general rendering */}
              {error.general && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                  {error.general}
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
                  {success}
                </div>
              )}

              <div>
                <label className="form-label">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    name="password"
                    onChange={(e) => handleChange(e)}
                    className={`input-field ${error.password ? "border-red-500" : ""}`}
                    placeholder="Enter new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {error.password && (
                  <p className="text-red-500 text-sm mt-1">{error.password}</p>
                )}
              </div>

              <div>
                <label className="form-label">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange(e)}
                    className={`input-field ${
                      error.confirmPassword ? "border-red-500" : ""
                    }`}
                    placeholder="Confirm new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {error.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{error.confirmPassword}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Remember your password?{" "}
              <Link
                to="/login"
                className="text-primary hover:text-purple-700 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
