import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getBooking } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search, Users, Train, MapPin, Calendar, Download } from "lucide-react";
import { TrainLoader } from "@/components/ui/TrainLoader";
import { downloadTicketPdf } from "@/utils/ticketPdf";

interface Passenger {
  id: number;
  name: string;
  age: number;
  gender: string;
  seatNumber: string;
  bookingStatus: string;
}

interface BookingData {
  pnr: string;
  trainName: string;
  fromStation: string;
  toStation: string;
  journeyDate: string;
  totalFare: number;
  passengers: Passenger[];
}

const PNRStatus = () => {
  const { pnr: pnrParam } = useParams<{ pnr?: string }>();
  const navigate = useNavigate();
  const [pnr, setPnr] = useState(pnrParam ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [booking, setBooking] = useState<BookingData | null>(null);

  useEffect(() => {
    if (pnrParam) {
      fetchBooking(pnrParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pnrParam]);

  const fetchBooking = async (pnrValue: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBooking(Number(pnrValue));
      setBooking(data);
      // If no booking found, the error will be shown by the apiClient interceptor
    } catch (error) {
      // Error is already shown by the apiClient interceptor
      console.error('Error fetching booking:', error);
      setBooking(null); // Clear any previous booking data on error
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    const pnrValue = pnr.trim();
    if (!pnrValue) return;

    // Instead of navigating, fetch the data directly
    await fetchBooking(pnrValue);
  };

  const handleDownload = () => {
    if (booking) {
      // @ts-ignore – booking fits util interface shape
      downloadTicketPdf(booking);
    }
  }

  // ---------------- Render ----------------
  // Always show the search form, and conditionally show results below it
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-8">
        <Card className="bg-gradient-card shadow-elevated mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="h-6 w-6 text-primary" />
              <span>Check PNR Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Enter your 7-digit PNR to view ticket details</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="pnr">PNR Number</Label>
                <Input
                  id="pnr"
                  placeholder="Enter 7-digit PNR number"
                  value={pnr}
                  onChange={(e) => setPnr(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={loading || !pnr.trim()}
                className="w-full md:w-auto"
              >
                {loading ? 'Searching...' : 'Check Status'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Show loading indicator */}
        {loading && (
          <div className="flex flex-col items-center justify-center my-12 space-y-4">
            <TrainLoader size={40} />
            <p className="text-muted-foreground text-sm">Fetching booking details...</p>
          </div>
        )}

        {/* Show error if any */}
        {error && (
          <Card className="shadow-card mb-6">
            <CardContent className="p-6 text-center text-red-500">{error}</CardContent>
          </Card>
        )}

        {/* Show booking details if available */}
        {booking && (
          <Card className="shadow-card bg-card text-card-foreground">
            <CardHeader>
              <CardTitle className="text-center">
                <div className="text-sm text-muted-foreground">PNR Number</div>
                <div className="text-3xl font-bold text-primary tracking-wider">{booking.pnr}</div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Journey section */}
              <Card className="bg-muted/40">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Train className="h-5 w-5 text-primary" /> Journey Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Train</span>
                    <p className="font-medium">{booking.trainName}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Date</span>
                    <p className="font-medium flex items-center gap-1">
                      <Calendar className="h-4 w-4" /> {booking.journeyDate}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-4 w-4" /> From
                    </span>
                    <p className="font-medium capitalize">{booking.fromStation}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-4 w-4" /> To
                    </span>
                    <p className="font-medium capitalize">{booking.toStation}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Passenger list */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Users className="h-5 w-5 text-primary" /> Passengers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`grid gap-3 ${booking.passengers.length > 4 ? 'sm:grid-cols-2 lg:grid-cols-3' : 'space-y-3'} overflow-y-auto max-h-80 pr-2`}>
                    {booking.passengers.map((p, idx) => (
                      <div key={p.id} className="flex flex-col justify-between p-4 bg-muted/50 rounded-xl hover:shadow-card transition-shadow text-sm space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                            {p.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium">{idx + 1}. {p.name}</p>
                            <p className="text-muted-foreground text-xs">{p.age} yrs • {p.gender}</p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <Badge variant="secondary">Seat {p.seatNumber}</Badge>
                          <span className="text-muted-foreground">{p.bookingStatus}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Fare */}
              <div className="flex justify-between text-lg font-bold">
                <span>Total Fare</span>
                <span className="text-primary">₹{booking.totalFare}</span>
              </div>

              <div className="flex justify-end">
                <Button variant="railway" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" /> Download Ticket
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
};

export default PNRStatus;
