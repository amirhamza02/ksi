export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
}

export interface LoginData {
  userName: string;
  password: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface AuthContextType {
  user: User | null;
  login: (userName: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  changePassword: (data: ChangePasswordData) => Promise<boolean>;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}