import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Train, Search, Ticket, Settings, Calendar } from "lucide-react";

const Navigation = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
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
            
            <Link to="/cancel">
              <Button 
                variant={isActive("/cancel") ? "railway" : "ghost"}
                className="flex items-center space-x-2"
              >
                <Ticket className="h-4 w-4" />
                <span>Cancel Booking</span>
              </Button>
            </Link>
            
            <Link to="/admin/add-train">
              <Button 
                variant={isActive("/admin/add-train") ? "railway" : "ghost"}
                className="flex items-center space-x-2"
              >
                <Settings className="h-4 w-4" />
                <span>Admin</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;