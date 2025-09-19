import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Train, Search, Ticket, Settings, Calendar, User, LogOut, FileText, Database, Menu } from "lucide-react";
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
import ThemeToggle from "@/components/ThemeToggle";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

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
    <nav className="bg-background border-b border-border shadow-card sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-14 gap-2">
          <div className="flex items-center space-x-2 min-w-0">
            <Link to="/" className="flex items-center space-x-2">
              <Train className="h-8 w-8 text-primary" />
              <span className="hidden sm:inline text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                RailReserve
              </span>
            </Link>
          </div>
          {/* Right actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Desktop nav buttons (show only on very wide screens to avoid overlap) */}
            <div className="hidden xl:flex items-center gap-2">
              <Link to="/search">
                <Button
                  variant={isActive("/search") ? "railway" : "ghost"}
                  className="flex items-center gap-2"
                >
                  <Search className="h-4 w-4" />
                  <span>Search Trains</span>
                </Button>
              </Link>

              {isAuthenticated && (
                <Link to="/pnr">
                  <Button
                    variant={isActive("/pnr") ? "railway" : "ghost"}
                    className="flex items-center gap-2"
                  >
                    <Calendar className="h-4 w-4" />
                    <span>PNR Status</span>
                  </Button>
                </Link>
              )}

              {isAuthenticated && (
                <Link to="/cancel">
                  <Button
                    variant={isActive("/cancel") ? "railway" : "ghost"}
                    className="flex items-center gap-2"
                  >
                    <Ticket className="h-4 w-4" />
                    <span>Cancel Booking</span>
                  </Button>
                </Link>
              )}

              {user?.role === 'Admin' && (
                <>
                  <Link to="/admin/add-train">
                    <Button
                      variant={isActive("/admin/add-train") ? "railway" : "ghost"}
                      className="flex items-center gap-2"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Add Train</span>
                    </Button>
                  </Link>
                  <Link to="/admin/booking-report">
                    <Button
                      variant={isActive("/admin/booking-report") ? "railway" : "ghost"}
                      className="flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      <span>Booking Report</span>
                    </Button>
                  </Link>
                  <Link to="/admin/trains">
                    <Button
                      variant={isActive("/admin/trains") ? "railway" : "ghost"}
                      className="flex items-center gap-2"
                    >
                      <Database className="h-4 w-4" />
                      <span>Trains</span>
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Theme toggle always visible */}
            <ThemeToggle />

            {/* Auth avatar / Sign in */}
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
                  <Button variant="outline" className="hidden sm:flex items-center gap-2">
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

            {/* Mobile hamburger menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="xl:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 sm:max-w-xs p-0">
                <div className="p-4 border-b">
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>
                </div>
                <div className="p-3 space-y-1">
                  <Link to="/search">
                    <Button variant={isActive("/search") ? "railway" : "ghost"} className="w-full justify-start">
                      <Search className="h-4 w-4 mr-2" /> Search Trains
                    </Button>
                  </Link>
                  {isAuthenticated && (
                    <Link to="/pnr">
                      <Button variant={isActive("/pnr") ? "railway" : "ghost"} className="w-full justify-start">
                        <Calendar className="h-4 w-4 mr-2" /> PNR Status
                      </Button>
                    </Link>
                  )}
                  {isAuthenticated && (
                    <Link to="/cancel">
                      <Button variant={isActive("/cancel") ? "railway" : "ghost"} className="w-full justify-start">
                        <Ticket className="h-4 w-4 mr-2" /> Cancel Booking
                      </Button>
                    </Link>
                  )}
                  {user?.role === 'Admin' && (
                    <>
                      <Link to="/admin/add-train">
                        <Button variant={isActive("/admin/add-train") ? "railway" : "ghost"} className="w-full justify-start">
                          <Settings className="h-4 w-4 mr-2" /> Add Train
                        </Button>
                      </Link>
                      <Link to="/admin/booking-report">
                        <Button variant={isActive("/admin/booking-report") ? "railway" : "ghost"} className="w-full justify-start">
                          <FileText className="h-4 w-4 mr-2" /> Booking Report
                        </Button>
                      </Link>
                      <Link to="/admin/trains">
                        <Button variant={isActive("/admin/trains") ? "railway" : "ghost"} className="w-full justify-start">
                          <Database className="h-4 w-4 mr-2" /> Trains
                        </Button>
                      </Link>
                    </>
                  )}

                  {!isAuthenticated && (
                    <>
                      <Link to="/login" state={{ from: location }}>
                        <Button variant="outline" className="w-full justify-start">
                          <User className="h-4 w-4 mr-2" /> Sign in
                        </Button>
                      </Link>
                      <Link to="/register" state={{ from: location }}>
                        <Button variant="outline" className="w-full justify-start">
                          <User className="h-4 w-4 mr-2" /> Create Account
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;