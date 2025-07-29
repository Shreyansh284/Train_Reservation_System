import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { registerUser } from '@/lib/api';

type FormData = {
    fullName: string;
    email: string;
    mobile: string;
    password: string;
    confirmPassword: string;
};

export default function Register() {
    const [formData, setFormData] = useState<FormData>({
        fullName: '',
        email: '',
        mobile: '',
        password: '',
        confirmPassword: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Partial<FormData>>({});
    const { toast } = useToast();
    const navigate = useNavigate();

    const validate = (): boolean => {
        const newErrors: Partial<FormData> = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        } else if (formData.fullName.length > 200) {
            newErrors.fullName = 'Full name must be less than 200 characters';
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        } else if (formData.email.length > 200) {
            newErrors.email = 'Email must be less than 200 characters';
        }

        if (!formData.mobile) {
            newErrors.mobile = 'Mobile number is required';
        } else if (!/^\+?[0-9\s-]{10,15}$/.test(formData.mobile)) {
            newErrors.mobile = 'Please enter a valid mobile number';
        } else if (formData.mobile.length > 15) {
            newErrors.mobile = 'Mobile number must be less than 15 characters';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        } else if (formData.password.length > 256) {
            newErrors.password = 'Password must be less than 256 characters';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        setIsLoading(true);

        try {
            await registerUser({
                fullName: formData.fullName,
                email: formData.email,
                mobile: formData.mobile,
                password: formData.password,
                confirmPassword: formData.confirmPassword
            });
            
            toast({
                title: 'Registration successful!',
                description: 'You can now log in with your credentials.',
            });
            
            // Redirect to login page
            navigate('/login');
        } catch (error: any) {
            let errorMessage = 'An error occurred during registration';
            
            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data?.message || error.message;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
            
            toast({
                title: 'Registration failed',
                description: errorMessage,
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));

        // Clear error when user starts typing
        if (errors[name as keyof FormData]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined,
            }));
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)] p-4">
            <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Create an account</h1>
                    <p className="text-muted-foreground">Enter your details to register as a customer</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                            id="fullName"
                            name="fullName"
                            type="text"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="John Doe"
                            required
                            maxLength={200}
                        />
                        {errors.fullName && <p className="text-sm text-red-500">{errors.fullName}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="name@example.com"
                            required
                            maxLength={200}
                        />
                        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="mobile">Mobile Number</Label>
                        <Input
                            id="mobile"
                            name="mobile"
                            type="tel"
                            value={formData.mobile}
                            onChange={handleChange}
                            placeholder="+1234567890"
                            required
                            maxLength={15}
                        />
                        {errors.mobile && <p className="text-sm text-red-500">{errors.mobile}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            maxLength={256}
                        />
                        {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            maxLength={256}
                        />
                        {errors.confirmPassword && (
                            <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                        )}
                    </div>



                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? 'Creating account...' : 'Create Account'}
                    </Button>
                </form>

                <div className="text-center text-sm">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-primary hover:underline">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
}
