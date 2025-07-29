import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Train, Search, Ticket, Settings, Calendar, User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    return email ? email[0].toUpperCase() : 'U';
  };

  return (
    <nav className="bg-white border-b border-border shadow-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2">
              <Train className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                RailReserve
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/search">
              <Button
                variant={isActive("/search") ? "railway" : "ghost"}
                className="flex items-center space-x-2"
              >
                <Search className="h-4 w-4" />
                <span>Search Trains</span>
              </Button>
            </Link>

            <Link to="/pnr">
              <Button
                variant={isActive("/pnr") ? "railway" : "ghost"}
                className="flex items-center space-x-2"
              >
                <Calendar className="h-4 w-4" />
                <span>Check PNR</span>
              </Button>
            </Link>

            {isAuthenticated && (
              <Link to="/cancel">
                <Button
                  variant={isActive("/cancel") ? "railway" : "ghost"}
                  className="flex items-center space-x-2"
                >
                  <Ticket className="h-4 w-4" />
                  <span>My Bookings</span>
                </Button>
              </Link>
            )}

            {user?.role === 'Admin' && (
              <Link to="/admin/add-train">
                <Button
                  variant={isActive("/admin/add-train") ? "railway" : "ghost"}
                  className="flex items-center space-x-2"
                >
                  <Settings className="h-4 w-4" />
                  <span>Admin</span>
                </Button>
              </Link>
            )}

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {getInitials(user?.name, user?.email)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name || 'User'}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="space-x-2">
                    <User className="h-4 w-4" />
                    <span>Sign in</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48" align="end">
                  <Link to="/login" state={{ from: location }}>
                    <DropdownMenuItem className="cursor-pointer">
                      Sign in
                    </DropdownMenuItem>
                  </Link>
                  <Link to="/register" state={{ from: location }}>
                    <DropdownMenuItem className="cursor-pointer">
                      Create Account
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;