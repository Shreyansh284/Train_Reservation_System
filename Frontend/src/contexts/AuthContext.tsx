import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '@/lib/api';
import { Loading } from "@/components/ui/loading";
import apiClient from '@/lib/apiClient';

export type UserRole = 'Admin' | 'Agent' | 'Customer';

export type User = {
    id: number;
    email: string;
    name?: string;
    role: UserRole;
};

type AuthContextType = {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    const fetchUserData = async (token: string) => {
        try {
            const response = await apiClient.get('/Auth/me');
            const userData = response.data;
            setUser({
                id: userData.userId,
                email: userData.email,
                name: userData.fullName || 'User',
                role: userData.userRole || 'Customer',
            });
        } catch (error) {
            console.error('Failed to fetch user:', error);
            // The error is already handled by the apiClient interceptor
            localStorage.removeItem('token');
            setUser(null);
            setToken(null);
        }
    };

    useEffect(() => {
        if (!token || user) {
            setIsLoading(false);
            return;
        }

        fetchUserData(token).finally(() => setIsLoading(false));
    }, [token, user]);

    const login = async (email: string, password: string): Promise<boolean> => {
        setIsLoading(true);
        try {
            const response = await loginUser({ userName: email, password });
            if (!response?.token) {
                throw new Error('No authentication token received');
            }

            const token = response.token;
            localStorage.setItem('token', token);
            setToken(token);
            await fetchUserData(token);
            return true;
        } catch (error) {
            // Error is already handled by the apiClient interceptor
            // Just rethrow to allow the calling component to handle it if needed
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
        setIsLoading(false);
        navigate('/login');
    };

    const isAuthenticated = !!user && !!token;

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated, isLoading }}>
            {isLoading ? (
                <div className="min-h-screen">
                    <Loading size={32} className="min-h-screen" />
                </div>
            ) : children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export { AuthContext };
