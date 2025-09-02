import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, AlertTriangle, Users, Train, Calendar, RefreshCw, Route, CalendarCheck2 } from "lucide-react";
import { Loading } from "@/components/ui/loading";
import { useToast } from "@/hooks/use-toast";
import { getBooking, cancelBooking } from "@/lib/api";
import { TrainLoader } from "@/components/ui/TrainLoader";

const CancelBooking = () => {
  const { toast } = useToast();
  const [pnrNumber, setPnrNumber] = useState<number | null>(null);
  const [searchResults, setSearchResults] = useState<any>(null);
  const [selectedPassengers, setSelectedPassengers] = useState<Number[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!pnrNumber) return;

    setLoading(true);
    setError(null);
    setSearchResults(null);

    try {
      const result = await getBooking(pnrNumber);
      setSearchResults(result);
    } catch (error) {
      // Error toast will be shown by the apiClient interceptor
      console.error('Error fetching booking:', error);
      setSearchResults(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePassengerSelection = (passengerId: Number, checked: boolean) => {
    setSelectedPassengers(prev =>
      checked
        ? [...prev, passengerId]
        : prev.filter(id => id !== passengerId)
    );
  };

  const calculateRefund = () => {
    if (!searchResults || selectedPassengers.length === 0) return 0;

    const selectedCount = selectedPassengers.length;
    const perPassengerAmount = searchResults.totalFare / searchResults.passengers.length;
    const cancellationFee = perPassengerAmount * 0.2; // 20% cancellation fee

    return (perPassengerAmount - cancellationFee) * selectedCount;
  };

  const handleCancellation = async() => {
    if (selectedPassengers.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one passenger to cancel",
        variant: "destructive"
      });
      return;
    }
    setIsCancelling(true);
    try {
      const cancellationRequest = {
        pnr: pnrNumber,
        passengerIds: selectedPassengers,
        reason: "User requested cancellation"
      };
      console.log(cancellationRequest)
      const refundAmount = calculateRefund();
      
      // Make the API call
      await cancelBooking(cancellationRequest);

      // Show success toast
      toast({
        title: "Cancellation Successful",
        description: `${selectedPassengers.length} passenger(s) cancelled. Refund of ₹${refundAmount.toFixed(2)} will be processed in 3-5 business days.`,
        variant: "default"
      });

      // Reset form
      setSearchResults(null);
      setSelectedPassengers([]);
      setPnrNumber(null);

    } catch (error) {
      // Error toast will be shown by the apiClient interceptor
      console.error("Cancellation error:", error);
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-8">
        {/* Search Section */}
        <Card className="mb-8 bg-gradient-card shadow-elevated">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="h-6 w-6 text-primary" />
              <span>Cancel Train Booking</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="pnr">PNR Number</Label>
                <Input
                  id="pnr"
                  placeholder="Enter 7-digit PNR number (try: 1000001)"
                  value={pnrNumber}
                  onChange={(e) => setPnrNumber(Number(e.target.value))}
                  className="font-mono tracking-wider"
                />
              </div>
              <Button
                onClick={handleSearch}
                variant="railway"
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Search Booking
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {loading && (
          <div className="flex flex-col items-center justify-center my-12 space-y-4">
            <TrainLoader size={40} />
            <p className="text-muted-foreground text-sm">Fetching booking details...</p>
          </div>
        )}
        {error && <div className="text-red-500">{error}</div>}

        {/* Booking Details */}
        {searchResults && (
          <div className="space-y-6">
            {/* Train Information */}
            <Card className="bg-white shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Train className="h-5 w-5 text-primary" />
                    <span>Booking Details</span>
                  </div>
                  <Badge
                    variant={searchResults.bookingStatus === "Confirmed" ? "default" : "secondary"}
                    className="bg-accent text-accent-foreground"
                  >
                    {searchResults.bookingStatus}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm text-primary">Train</Label>
                    <p className="font-medium flex items-center">
                      <Train className="h-4 w-4 mr-2 text-muted-foreground" />
                      {searchResults.trainName}
                    </p>
                    {/* <p className="text-sm text-muted-foreground">#{searchResults.train.number}</p> */}
                  </div>
                  <div>

                    <Label className="text-sm text-primary">Journey Date</Label>
                    <p className="font-medium flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      {searchResults.journeyDate}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm text-primary flex items-center gap-1">
                      Route
                    </Label>
                    <p className="font-medium flex items-center"><Route className="h-4 w-4 mr-1 text-muted-foreground" /> <span className="capitalize">{searchResults.fromStation} </span> - <span className="capitalize">{searchResults.toStation}</span> </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Passenger Selection */}
            <Card className="bg-gradient-to-br from-white via-blue-30 to-orange-40  border-2 border-primary/10 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span className="text-lg font-semibold tracking-wide">Select Passengers to Cancel</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`space-y-3 ${searchResults.passengers.length > 5
                      ? "max-h-96 overflow-y-auto pr-2 custom-scrollbar"
                      : ""
                    }`}
                >
                  {searchResults.passengers.map((passenger: any) => (
                    <div
                      key={passenger.passengerId}
                      className={`flex items-center space-x-3 p-4 border-2 rounded-xl bg-white/90 shadow-sm
                        ${selectedPassengers.includes(passenger.passengerId)
                          ? "border-primary/60 ring-2 ring-primary/20"
                          : "border-muted/30"}
                          ${passenger.bookingStatus === "Cancelled" ? "cursor-not-allowed opacity-70" : ""}
                        hover:border-primary/40`}
                    >
                      <Checkbox
                        id={passenger.passengerId}
                        checked={selectedPassengers.includes(passenger.passengerId)}
                        disabled={passenger.bookingStatus == "Cancelled"}
                        onCheckedChange={(checked) => handlePassengerSelection(passenger.passengerId, checked as boolean)}
                        className={`scale-125 accent-primary`}
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-base text-primary">{passenger.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {passenger.age} years • {passenger.gender}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge
                              variant="outline"
                              className="bg-gradient-to-r from-blue-100 to-orange-100 text-primary border-none shadow"
                            >
                              {passenger.seatNumber}
                            </Badge>
                            <p className={`text-xs mt-1 font-medium ${passenger.bookingStatus === "Cancelled"
                                ? "text-red-500"
                                : "text-green-600"
                              }`}>
                              {passenger.bookingStatus}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Cancellation Summary */}
            <Card className="bg-gradient-card shadow-elevated">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  <span>Cancellation Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row md:items-start md:gap-8 gap-6">
                  {/* Summary Details */}
                  <div className="flex-1 space-y-3">
                    <div className="flex justify-between">
                      <span>Passengers to cancel:</span>
                      <span className="font-medium">{selectedPassengers.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Original amount:</span>
                      <span>₹{searchResults.totalFare}</span>
                    </div>
                    <div className="flex justify-between text-red-600">
                      <span>Cancellation charges (20%):</span>
                      <span>
                        -₹
                        {(
                          ((searchResults.totalFare / searchResults.passengers.length) *
                            selectedPassengers.length) *
                          0.2
                        ).toFixed(2)}
                      </span>
                    </div>
                    <hr className="border-border" />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Refund amount:</span>
                      <span className="text-accent">₹{calculateRefund().toFixed(2)}</span>
                    </div>
                    {/* Button at the bottom of refund amount */}
                    <Button
                      onClick={handleCancellation}
                      variant="destructive"
                      size="lg"
                      className="mt-6"
                      disabled={selectedPassengers.length === 0 || isCancelling}
                    >
                        {isCancelling ? (
                          <>
                            <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                            Cancelling...
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="mr-2 h-5 w-5" />
                            Confirm Cancellation
                          </>
                        )}
                      </Button>
                  </div>
                  {/* Important Notes at right on desktop */}
                  <div className="md:w-1/2 w-full">
                    <div className="text-sm text-muted-foreground bg-muted/100 p-5 rounded mt-6 md:mt-0">
                      <p className="font-medium mb-2">Important Notes:</p>
                      <ul className="space-y-1">
                        <li>• Refund will be processed to your original payment method</li>
                        <li>• Processing time: 3-5 business days</li>
                        <li>• Cancellation charges are non-refundable</li>
                        <li>• Partially cancelled tickets cannot be re-booked</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* end Cancellation Summary */}
          </div>
        )}
      </div>
    </div>
  );
};

export default CancelBooking;