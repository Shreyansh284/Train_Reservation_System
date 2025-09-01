import { useLocation, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Train, Users, Calendar, MapPin, Download, Search, ArrowLeft } from "lucide-react";
import { downloadTicketPdf } from "@/utils/ticketPdf";

const Confirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state;

  const handleDownload = () => {
    if (bookingData) {
      downloadTicketPdf(bookingData);
    }
  };

  const handleBack = () => {
    // Clear the booking data from state when going back
    navigate(-1);
  };

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">No booking data found</p>
            <Link to="/search">
              <Button variant="railway">
                <Search className="mr-2 h-4 w-4" />
                Search Trains
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const {
    pnr,
    trainName,
    fromStation,
    toStation,
    journeyDate,
    totalFare,
    passengers,
  } = bookingData;
  // Build rebooking URL if train info is available
  const rebookUrl = bookingData.trainId
    ? `/book/${bookingData.trainId}?fromStationId=${bookingData.fromStationId}&toStationId=${bookingData.toStationId}&dateOfBooking=${bookingData.dateOfBooking}`
    : "/search";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={handleBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        {/* Success Header */}
        <Card className="mb-6 bg-gradient-card shadow-elevated">
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-16 w-16 text-accent mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Booking Confirmed!</h1>
            <p className="text-muted-foreground">Your train ticket has been successfully booked</p>
          </CardContent>
        </Card>

        {/* PNR & Quick Actions */}
        <Card className="mb-6 bg-white shadow-card">
          <CardHeader>
            <CardTitle className="text-center">
              <div className="text-sm text-muted-foreground">PNR Number</div>
              <div className="text-3xl font-bold text-primary tracking-wider">{pnr}</div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="outline"
                className="flex-1 sm:flex-initial"
                onClick={handleDownload}
              >
                <Download className="mr-2 h-4 w-4" />
                Download Ticket
              </Button>
              <Link to="/cancel" className="flex-1 sm:flex-initial">
                <Button variant="outline" className="w-full">
                  Cancel Booking
                </Button>
              </Link>
              <Link to={rebookUrl} className="flex-1 sm:flex-initial">
                <Button variant="railway" className="w-full">
                  <Search className="mr-2 h-4 w-4" />
                  Book Another
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Train Details */}
          <Card className="bg-white shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Train className="h-5 w-5 text-primary" />
                <span>Journey Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Train</Label>
                  <p className="font-medium">{trainName}</p>
                  {/* <Badge variant="secondary" className="mt-1">#{pnr}</Badge> */}
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Class</Label>
                  {/* <p className="font-medium">{coach}</p> */}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Date</Label>
                  <p className="font-medium flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    {new Date(journeyDate).toLocaleDateString()}
                  </p>

                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Route</Label>
                  <p className="font-medium flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground capitalize" />
                    {fromStation} → {toStation}
                  </p>

                </div>
              </div>

              {/* <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Departure</Label>
                  <p className="font-medium">{train.departure}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Arrival</Label>
                  <p className="font-medium">{train.arrival}</p>
                </div>
              </div> */}
            </CardContent>
          </Card>

          {/* Passenger Details */}
          <Card className="bg-white shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-primary" />
                <span>Passenger Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {passengers.map((passenger: any, index: number) => (
                  <div key={passenger.id} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">{passenger.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {passenger.age} years • {passenger.gender}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">
                        Seat: {passenger.seatNumber}
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-1">{passenger.bookingStatus}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Summary */}
        <Card className="mt-6 bg-gradient-card shadow-elevated">
          <CardHeader>
            <CardTitle>Payment Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Base Fare ({passengers.length} passengers)</span>
                <span>₹{totalFare}</span>
              </div>
              <div className="flex justify-between">
                <span>Booking Fee</span>
                <span>₹0</span>
              </div>
              <div className="flex justify-between">
                <span>GST (0%)</span>
                <span>₹{(totalFare)}</span>
              </div>
              <hr className="border-border" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total Paid</span>
                <span className="text-primary">₹{totalFare}</span>
              </div>
              <div className="text-center text-sm text-muted-foreground">
                <Badge variant="secondary" className="bg-accent/10 text-accent">
                  ✓ Payment Successful
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Notes */}
        <Card className="mt-6 bg-white shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Important Information</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Please carry a valid photo ID during your journey</li>
              <li>• Arrive at the station at least 30 minutes before departure</li>
              <li>• Cancellation charges apply as per railway rules</li>
              <li>• Keep your PNR number safe for future reference</li>
              <li>• You can track your train status using the PNR number</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const Label = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <label className={`text-sm font-medium ${className}`}>{children}</label>
);

export default Confirmation;