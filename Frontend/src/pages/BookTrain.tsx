import { useEffect, useState, useMemo, useContext } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Train, Users, User, Plus, Trash2, CreditCard, Armchair } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getTrainDetailsBySearch, bookTrain } from "@/lib/api";
import { AuthContext } from "@/contexts/AuthContext.tsx";
import { TrainLoader } from "@/components/ui/TrainLoader";

interface Passenger {
  id: string;
  name: string;
  age: string;
  gender: string;
}

const BookTrain = () => {
  const { trainId } = useParams();
  const [searchParams] = useSearchParams();

  const fromStationId = searchParams.get("fromStationId");
  const toStationId = searchParams.get("toStationId");
  const dateOfBooking = searchParams.get("dateOfBooking")
  const navigate = useNavigate();
  const { toast } = useToast();
  const authContext = useContext(AuthContext);
  const { user, isAuthenticated } = authContext;

  // Handle unauthenticated users
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', {
        replace: true,
        state: {
          from: window.location.pathname + window.location.search
        }
      });
      return;
    }
  }, [isAuthenticated, navigate]);

  // Show loading state while checking auth
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const [selectedCoach, setSelectedCoach] = useState("");
  const [passengers, setPassengers] = useState<Passenger[]>([
    { id: "1", name: "", age: "", gender: "male" }
  ]);
  const MAX_PASSENGERS = 4;
  const [trainData, setTrainData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // indices of requested segment in the schedule list
  const sourceIndex = useMemo(() => {
    if (!trainData?.schedules) return -1;
    return trainData.schedules.findIndex((s: any) => s.station.stationId === trainData?.requestedSourceStation?.stationId);
  }, [trainData]);

  const destIndex = useMemo(() => {
    if (!trainData?.schedules) return -1;
    return trainData.schedules.findIndex((s: any) => s.station.stationId === trainData?.requestedDestinationStation?.stationId);
  }, [trainData]);

  const lowerBoundIdx = Math.min(sourceIndex, destIndex);
  const upperBoundIdx = Math.max(sourceIndex, destIndex);

  useEffect(() => {

    setLoading(true);
    setError(null);
    getTrainDetailsBySearch(Number(trainId), Number(fromStationId), Number(toStationId), dateOfBooking)
      .then(data => {
        setTrainData(data)
      }
      )
      .catch(err => setError(err.message || "Failed to fetch train details"))
      .finally(() => setLoading(false));

  }, [trainId]);
  // console.log(trainData);
  const addPassenger = () => {
    if (passengers.length >= MAX_PASSENGERS) {
      toast({
        title: "Limit reached",
        description: `You can book a maximum of ${MAX_PASSENGERS} passengers at a time.`,
        variant: "destructive"
      });
      return;
    }
    setPassengers([...passengers, {
      id: (passengers.length + 1).toString(),
      name: "",
      age: "",
      gender: "male"
    }]);
  };

  const removePassenger = (id: string) => {
    if (passengers.length > 1) {
      setPassengers(passengers.filter(p => p.id !== id));
    }
  };

  const updatePassenger = (id: string, field: string, value: string) => {
    setPassengers(passengers.map(p =>
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const getPricePerPerson = (coachType, distanceInKm, passangers = 1) => {
    const fareRates = {
      SL: 1,   // Sleeper
      A3: 2,   // 3rd AC
      A2: 3,   // 2nd AC
      A1: 4    // 1st AC
    };

    const rate = fareRates[coachType] || 1;
    return Math.round(distanceInKm * rate * passangers);
  };

  const handleBooking = async () => {
    console.log(selectedCoach);

    if (!selectedCoach || passengers.some(p => !p.name || !p.age)) {
      toast({
        title: "Error",
        description: "Please select coach class and fill all passenger details",
        variant: "destructive"
      });
      return;
    }

    if (!isAuthenticated) {
      toast({
        title: "Error",
        description: "You must be logged in to book a ticket",
        variant: "destructive"
      });
      navigate('/login', { state: { from: window.location.pathname + window.location.search } });
      return;
    }
    console.log("USER FROM AUTH: " + user);
    const bookingRequest = {
      userId: user.id,
      fromStationId: Number(fromStationId),
      toStationId: Number(toStationId),
      journeyDate: dateOfBooking || new Date().toISOString(),
      coachClass: selectedCoach,
      totalFare: getPricePerPerson(selectedCoach, trainData?.totalDistance, passengers.length),
      passangers: passengers.map(p => ({
        name: p.name,
        age: Number(p.age),
        gender: p.gender
      }))
    };
    console.log(bookingRequest)
    try {
      setLoading(true);

      const result = await bookTrain(Number(trainId), user.id, bookingRequest);
      // Include search parameters to allow rebooking the same train
      navigate("/confirmation", {
        state: {
          ...result,
          trainId: Number(trainId),
          fromStationId: Number(fromStationId),
          toStationId: Number(toStationId),
          dateOfBooking: dateOfBooking
        }
      });
    } catch (err: any) {
      toast({ title: "Booking failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  {
    loading && (
      <div className="flex flex-col items-center justify-center my-12 space-y-4">
        <TrainLoader size={40} />
        <p className="text-muted-foreground text-sm">Fetching booking details...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Error loading train details</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-[calc(100vh-56px)] bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-6">
        {/* Train Details */}
        <Card className="mb-6 bg-gradient-card shadow-elevated">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Train className="h-6 w-6 text-primary" />
              <div>
                <span>{trainData?.trainName}</span>
                <Badge variant="secondary" className="ml-2">#{trainData?.trainNumber}</Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-4 overflow-x-auto">
              {trainData?.schedules?.map((schedule: any, idx: number) => {
                const isActive = idx >= lowerBoundIdx && idx <= upperBoundIdx;
                return (
                  <div key={schedule.scheduleId} className="flex items-center">
                    {/* Step Circle */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`rounded-full w-8 h-8 flex items-center justify-center font-bold border-2 transition-colors
                          ${isActive ? "bg-primary text-white border-primary" : "bg-muted text-muted-foreground border-border"}
                        `}
                      >
                        {idx + 1}
                      </div>
                      <span className={`text-xs mt-1 capitalize ${isActive ? "text-primary font-semibold" : ""}`}>
                        {schedule.station.stationName}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{schedule.station.stationCode}</span>
                    </div>
                    {/* Step Line */}
                    {idx < trainData.schedules.length - 1 && (
                      <div className="w-16 h-0.5 bg-border mx-2" />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Coach Selection */}
          <Card className="bg-white shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Armchair className="h-5 w-5 text-primary" />
                <span>Select Coach Class</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={selectedCoach} onValueChange={setSelectedCoach}>
                <div
                  className="space-y-3 max-h-52 overflow-y-auto"
                // style={{ minHeight: trainData?.coaches?.length > 1 ? "8rem" : "auto" }}
                >
                  {trainData?.coaches?.map((coach: any) => (
                    <div key={coach.coachType} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value={coach.coachType} id={coach.coachType} />
                      <Label htmlFor={coach.coachType} className="flex-1 cursor-pointer">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-medium">{coach.coachType}</span>
                            <p className="text-sm text-muted-foreground">
                              Available: {coach.availableSeats}/{coach.totalSeats}
                            </p>
                          </div>
                          <div className="text-right">

                            <span className="text-lg font-bold text-primary">₹{getPricePerPerson(coach.coachType, trainData?.totalDistance)}</span>
                            <p className="text-xs text-muted-foreground">per person</p>
                          </div>
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Passenger Details */}
          <Card className="bg-white shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-primary" />
                  <span>Passenger Details</span>
                </div>
                <Button onClick={addPassenger} variant="outline" size="sm" disabled={passengers.length >= MAX_PASSENGERS}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Passenger
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="space-y-4 max-h-52 overflow-y-auto"
                style={{ minHeight: passengers.length >= 1 ? "12rem" : "auto" }}
              >
                {passengers.map((passenger, index) => (
                  <Card key={passenger.id} className="p-4 border-muted">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-medium">Passenger {index + 1}</h4>
                      {passengers.length > 1 && (
                        <Button
                          onClick={() => removePassenger(passenger.id)}
                          variant="ghost"
                          size="sm"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="space-y-2">
                        <Label>Full Name</Label>
                        <Input
                          placeholder="Enter full name"
                          value={passenger.name}
                          onChange={(e) => updatePassenger(passenger.id, "name", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Age</Label>
                        <Input
                          type="number"
                          min="1"
                          max="120"
                          placeholder="Age"
                          value={passenger.age}
                          onChange={(e) => updatePassenger(passenger.id, "age", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Gender</Label>
                        <RadioGroup
                          value={passenger.gender}
                          onValueChange={(value) => updatePassenger(passenger.id, "gender", value)}
                          className="flex space-x-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Male" id={`male-${passenger.id}`} />
                            <Label htmlFor={`male-${passenger.id}`}>Male</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Female" id={`female-${passenger.id}`} />
                            <Label htmlFor={`female-${passenger.id}`}>Female</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Booking Summary & Payment */}
        <Card className="mt-6 bg-gradient-card shadow-elevated">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 mb-2">
              <CreditCard className="h-6 w-6 text-primary" />
              <span>Booking Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center ps-2">
              {/* Booking Details */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Train:</span>
                  <span className="font-medium">{trainData?.trainName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Coach Class:</span>
                  <span className="font-medium">{selectedCoach || "Not selected"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Passengers:</span>
                  <span className="font-medium">{passengers.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Price per ticket:</span>
                  <span className="font-medium">₹{getPricePerPerson(selectedCoach, trainData?.totalDistance)}</span>
                </div>
                <hr className="border-border" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount:</span>
                  <span className="text-primary">
                    ₹{getPricePerPerson(selectedCoach, trainData?.totalDistance, passengers.length)}
                  </span>
                </div>
                <div className="flex items-center justify-center">
                  <Button
                    onClick={handleBooking}
                    variant="railway"
                    size="lg"
                    className="w-full"
                    disabled={!selectedCoach || passengers.some(p => !p.name || !p.age) || loading}
                  >
                    {loading ? "Booking..." : (
                      <>
                        <CreditCard className="mr-2 h-5 w-5" />
                        Proceed to Pay ₹{getPricePerPerson(selectedCoach, trainData?.totalDistance, passengers.length)}
                      </>
                    )}
                  </Button>
                </div>
              </div>
              {/* Instructions and Payment Logos */}
              <div className="flex flex-col items-center justify-center h-full">
                {/* Payment Logos */}
                <div className="flex items-center space-x-4 mb-4">
                  <CreditCard className="h-12 w-12 text-primary" />
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg"
                    alt="Visa"
                    className="h-8"
                    title="Visa"
                  />
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                    alt="Mastercard"
                    className="h-8"
                    title="Mastercard"
                  />
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/6/6f/UPI_logo.svg"
                    alt="UPI"
                    className="h-8"
                    title="UPI"
                  />
                </div>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>✔️ Please review all details before proceeding.</li>
                  <li>✔️ Ensure passenger names and ages are correct.</li>
                  <li>✔️ Payment is secure and instant (UPI, Card, Netbanking).</li>
                  <li>✔️ E-ticket will be sent to your email after payment.</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookTrain;