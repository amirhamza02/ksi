import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { authApi } from '../../services/atuhApi';


const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email: string): boolean => {
    if (!email.trim()) {
      setError('Email is required');
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) return;

    setIsLoading(true);
    setError('');

    try {
      await authApi.forgotPassword(email);
      setIsSuccess(true);
      
    } catch (error) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  if (isSuccess) {
    return (
      <SuccessState 
        email={email}
        onTryAnother={() => {
          setIsSuccess(false);
          setEmail('');
        }}
        onBackToLogin={handleBackToLogin}
      />
    );
  }

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl card-shadow p-8">
          <Header />
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <ErrorMessage message={error} />}

            <EmailInput 
              value={email}
              onChange={handleEmailChange}
              error={!!error}
              disabled={isLoading}
            />

            <SubmitButton 
              isLoading={isLoading}
              label="Send Reset Link"
            />
          </form>

          <BackToLoginLink onClick={handleBackToLogin} />
          <SupportInfo />
        </div>
      </div>
    </div>
  );
};

// Extracted Components for Better Readability
const SuccessState: React.FC<{
  email: string;
  onTryAnother: () => void;
  onBackToLogin: () => void;
}> = ({ email, onTryAnother, onBackToLogin }) => (
  <div className="min-h-screen gradient-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div className="bg-white rounded-2xl card-shadow p-8 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-8 h-8 text-green-600" />
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-4">Check Your Email</h2>
      
      <p className="text-gray-600 mb-6">
        We've sent a password reset link to <strong>{email}</strong>
      </p>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800">
          <strong>Didn't receive the email?</strong>
          <br />
          Check your spam folder or try again in a few minutes.
        </p>
      </div>

      <div className="space-y-4">
        <button
          onClick={onTryAnother}
          className="w-full btn-outline"
        >
          Try Another Email
        </button>
        
        <button 
          onClick={onBackToLogin}
          className="w-full btn-primary text-center"
        >
          Back to Login
        </button>
      </div>
    </div>
  </div>
);

const Header = () => (
  <div className="text-center mb-8">
    <div className="flex justify-center items-center space-x-4 mb-6">
      <Logo src="./king-sejong.jpg" alt="KSI Logo" />
      <Logo src="./iub-logo.png" alt="IUB Logo" />
    </div>
    <h2 className="text-3xl font-bold text-primary">Forgot Password?</h2>
    <p className="text-gray-600 mt-2">
      Enter your email address and we'll send you a link to reset your password.
    </p>
  </div>
);

const Logo: React.FC<{ src: string; alt: string }> = ({ src, alt }) => (
  <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-100 p-2">
    <img src={src} alt={alt} className="w-full h-full object-contain rounded" />
  </div>
);

const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
    {message}
  </div>
);

const EmailInput: React.FC<{
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error: boolean;
  disabled: boolean;
}> = ({ value, onChange, error, disabled }) => (
  <div>
    <label className="form-label">Email Address</label>
    <div className="relative">
      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input
        type="email"
        value={value}
        onChange={onChange}
        className={`input-field pl-33 ${error ? 'border-red-500' : ''}`}
        placeholder="Enter your email address"
        disabled={disabled}
      />
    </div>
  </div>
);

const SubmitButton: React.FC<{ isLoading: boolean; label: string }> = ({ isLoading, label }) => (
  <button
    type="submit"
    disabled={isLoading}
    className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {isLoading ? (
      <div className="flex items-center justify-center space-x-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
        <span>Sending Reset Link...</span>
      </div>
    ) : (
      label
    )}
  </button>
);

const BackToLoginLink: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <div className="mt-6">
    <button
      onClick={onClick}
      className="flex items-center justify-center space-x-2 text-gray-600 hover:text-primary transition-colors w-full"
    >
      <ArrowLeft className="w-4 h-4" />
      <span>Back to Login</span>
    </button>
  </div>
);

const SupportInfo = () => (
  <div className="mt-8 pt-6 border-t border-gray-200">
    <div className="text-center">
      <p className="text-sm text-gray-500 mb-2">Need help?</p>
      <p className="text-sm text-gray-600">
        Contact support at{' '}
        <a href="mailto:support@ksi.iub.edu.bd" className="text-primary hover:text-purple-700">
          +8809612939393 (Ext: 3810)
        </a>
      </p>
    </div>
  </div>
);

export default ForgotPasswordPage;