import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Train, Search, Settings, Users, Clock, Shield } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/50 to-accent/5">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-hero p-4 rounded-full shadow-elevated">
                <Train className="h-12 w-12 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">
              RailReserve System
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Your comprehensive train reservation platform. Search trains, book tickets,
              and manage your journey with ease.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/search">
                <Button variant="railway" size="lg" className="w-full sm:w-auto">
                  <Search className="mr-2 h-5 w-5" />
                  Search Trains
                </Button>
              </Link>
              <Link to="/admin/add-train">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  <Settings className="mr-2 h-5 w-5" />
                  Admin Panel
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">System Features</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* User Features */}
          <Card className="bg-gradient-card shadow-card hover:shadow-elevated transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search className="h-6 w-6 text-primary" />
                <span>Train Search</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Search by source and destination</li>
                <li>• Real-time seat availability</li>
                <li>• Multiple class options</li>
                <li>• Journey date selection</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card hover:shadow-elevated transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-6 w-6 text-primary" />
                <span>Easy Booking</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Multi-passenger booking</li>
                <li>• Instant confirmation</li>
                <li>• PNR generation</li>
                <li>• Seat selection</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card hover:shadow-elevated transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-primary" />
                <span>Booking Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li>• PNR-based cancellation</li>
                <li>• Partial cancellations</li>
                <li>• Refund processing</li>
                <li>• Booking history</li>
              </ul>
            </CardContent>
          </Card>

          {/* Admin Features */}
          <Card className="bg-gradient-card shadow-card hover:shadow-elevated transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Train className="h-6 w-6 text-accent" />
                <span>Train Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Add new trains</li>
                <li>• Configure routes</li>
                <li>• Station sequences</li>
                <li>• Timing management</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card hover:shadow-elevated transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-6 w-6 text-accent" />
                <span>Coach Configuration</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Multiple coach types</li>
                <li>• Seat arrangements</li>
                <li>• Capacity management</li>
                <li>• Price configuration</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card hover:shadow-elevated transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-6 w-6 text-accent" />
                <span>Route Planning</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Station-wise timing</li>
                <li>• Distance calculation</li>
                <li>• Arrival/departure times</li>
                <li>• Route optimization</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-8">Get Started</h2>
            <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-2xl mx-auto">
              <Link to="/search" className="flex-1">
                <Card className="cursor-pointer hover:shadow-elevated transition-all duration-300 bg-card text-card-foreground">
                  <CardContent className="p-6 text-center">
                    <Search className="h-8 w-8 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Book a Ticket</h3>
                    <p className="text-sm text-muted-foreground">
                      Search and book train tickets
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/cancel" className="flex-1">
                <Card className="cursor-pointer hover:shadow-elevated transition-all duration-300 bg-card text-card-foreground">
                  <CardContent className="p-6 text-center">
                    <Shield className="h-8 w-8 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Cancel Booking</h3>
                    <p className="text-sm text-muted-foreground">
                      Cancel existing reservations
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/admin/add-train" className="flex-1">
                <Card className="cursor-pointer hover:shadow-elevated transition-all duration-300 bg-card text-card-foreground">
                  <CardContent className="p-6 text-center">
                    <Settings className="h-8 w-8 text-accent mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Admin Panel</h3>
                    <p className="text-sm text-muted-foreground">
                      Manage trains and routes
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
