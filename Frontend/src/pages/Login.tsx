import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        // Show success toast
        toast({ title: 'Success', description: 'Logged in successfully.' });
        // Check for redirect in location state (can be either a string or Location object)
        const from = location.state?.from;
        if (typeof from === 'string') {
          // If it's a string, it already contains the full path with search params
          navigate(from, { replace: true });
        } else if (from?.pathname) {
          // If it's a Location object, combine pathname and search
          const redirectTo = from.pathname + (from.search || '');
          navigate(redirectTo, { replace: true });
        } else {
          // Default to home if no redirect specified
          navigate('/', { replace: true });
        }
      }
    } catch (error) {
      // For 401 (invalid credentials), the global interceptor suppresses the toast,
      // so show the backend message here. Other errors are already toasted globally.
      const err = error as { status?: number; message?: string; data?: unknown };
      if (err?.status === 401) {
        const backendMsg = typeof err?.data === 'string' ? err.data : err?.message || 'Invalid credentials';
        toast({ title: 'Login failed', description: backendMsg, variant: 'destructive' });
      }
      // Just log for debugging
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Sign in to your account</h1>
          <p className="text-muted-foreground">Enter your credentials below</p>
        </div>

        {/* Error messages are now shown via toast notifications */}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <div className="text-sm text-center text-muted-foreground">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
