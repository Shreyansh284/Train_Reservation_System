import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { TrainFront, MapPin, Plus, Trash2, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { addTrain } from "@/lib/api";
import { TrainLoader } from "@/components/ui/TrainLoader";

const AdminAddTrain = () => {
  const { toast } = useToast();

  const [trainName, setTrainName] = useState("");
  const [trainNumber, setTrainNumber] = useState("");

  const [stations, setStations] = useState([
    { code: "", name: "", city: "", state: "", distance: 0 }
  ]);

  const [coaches, setCoaches] = useState([
    { type: "SL", count: 0, seatsPerCoach: 72 }
  ]);

  const coachTypes = [
    { value: "SL", label: "Sleeper", defaultSeats: 72 },
    { value: "A3", label: "3rd AC", defaultSeats: 72 },
    { value: "A2", label: "2nd AC", defaultSeats: 48 },
    { value: "A1", label: "1st AC", defaultSeats: 24 },
  ];

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // NEW: activeTab state to control the step navigation
  const [activeTab, setActiveTab] = useState("basic");

  const addStation = () => {
    setStations([...stations, { code: "", name: "", city: "", state: "", distance: 0 }]);
  };

  const removeStation = (index: number) => {
    if (stations.length > 1) {
      setStations(stations.filter((_, i) => i !== index));
    }
  };

  const updateStation = (index: number, field: string, value: string | number) => {
    const newStations = stations.map((station, i) =>
      i === index ? { ...station, [field]: value } : station
    );
    setStations(newStations);
  };

  const addCoach = () => {
    setCoaches([...coaches, { type: "SL", count: 0, seatsPerCoach: 72 }]);
  };

  const removeCoach = (index: number) => {
    if (coaches.length > 1) {
      setCoaches(coaches.filter((_, i) => i !== index));
    }
  };

  const updateCoach = (index: number, field: string, value: string | number) => {
    const newCoaches = coaches.map((coach, i) => {
      if (i === index) {
        let updatedCoach = { ...coach, [field]: value };
        if (field === "type") {
          const coachType = coachTypes.find(ct => ct.value === value);
          if (coachType) {
            updatedCoach.seatsPerCoach = coachType.defaultSeats;
          }
        }
        return updatedCoach;
      }
      return coach;
    });
    setCoaches(newCoaches);
  };

  const handleSubmit = async () => {
    if (stations.length < 2) {
      toast({
        title: "Route Invalid",
        description: "At least 2 stations (source and destination) are required.",
        variant: "destructive",
      });
      return;
    }
    if (!trainName || !trainNumber || stations.some(s => !s.name) || coaches.some(c => c.count === 0)) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    const classLimits = {
      SL: { min: 1, max: 18 },
      "A3": { min: 0, max: 3 },
      "A2": { min: 0, max: 3 },
      "A1": { min: 0, max: 1 },
    };

    for (const classType in classLimits) {
      const totalCount = coaches
        .filter(c => c.type === classType)
        .reduce((sum, c) => sum + c.count, 0);
      const { min, max } = classLimits[classType];
      if (totalCount < min || totalCount > max) {
        toast({
          title: "Coach Count Invalid",
          description: `${classType} coaches must be between ${min} and ${max}`,
          variant: "destructive"
        });
        return;
      }
    }

    for (const coach of coaches) {
      if (coach.seatsPerCoach < 1 || coach.seatsPerCoach > 72) {
        toast({
          title: "Invalid Seats per Coach",
          description: "Each coach must have between 1 and 72 seats.",
          variant: "destructive"
        });
        return;
      }
    }

    setLoading(true);
    setError(null);

    const trainDTO = {
      trainNumber: trainNumber,
      trainName: trainName,
      coaches: coaches.flatMap(c =>
        Array.from({ length: c.count }, (_, i) => ({
          coachNumber: `${c.type}-${i + 1}`,
          coachClass: c.type,
          totalSeats: c.seatsPerCoach
        }))
      ),
      stations: stations.map(s => ({
        station: {
          stationCode: s.code,
          stationName: s.name,
          city: s.city,
          state: s.state
        },
        distanceFromSource: s.distance
      }))
    };

    try {
      await addTrain(trainDTO);
      toast({
        title: "Success!",
        description: `Train ${trainName} (${trainNumber}) has been added successfully`,
        variant: "default"
      });
      setTrainName("");
      setTrainNumber("");
      setStations([{ code: "", name: "", city: "", state: "", distance: 0 }]);
      setCoaches([{ type: "SL", count: 0, seatsPerCoach: 72 }]);
    } catch (err: any) {
      setError(err.message || "Failed to add train");
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // Navigation handlers for Next and Back actions
  const handleNext = () => {
    if (activeTab === "basic") {
      setActiveTab("route");
    } else if (activeTab === "route") {
      setActiveTab("coaches");
    }
  };

  const handleBack = () => {
    if (activeTab === "coaches") {
      setActiveTab("route");
    } else if (activeTab === "route") {
      setActiveTab("basic");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50">
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <Card className="mb-8 bg-gradient-card shadow-elevated">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrainFront className="h-6 w-6 text-primary" />
              <span>Add New Train</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="route">Route & Stations</TabsTrigger>
                <TabsTrigger value="coaches">Coaches</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4 mt-6">
                {/* Basic Info Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="trainName">Train Name *</Label>
                    <Input
                      id="trainName"
                      placeholder="e.g., Rajdhani Express"
                      value={trainName}
                      onChange={(e) => setTrainName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="trainNumber">Train Number *</Label>
                    <Input
                      id="trainNumber"
                      placeholder="e.g., 12301"
                      value={trainNumber}
                      onChange={(e) => setTrainNumber(e.target.value)}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="route" className="space-y-4 mt-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Station Sequence</h3>
                  <Button onClick={addStation} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Station
                  </Button>
                </div>

                <div className="space-y-4">
                  {stations.map((station, index) => (
                    <Card key={index} className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        <div className="space-y-2">
                          <Label>Station Name *</Label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Station name"
                              value={station.name}
                              onChange={(e) => updateStation(index, "name", e.target.value)}
                              className="pl-10"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Station Code</Label>
                          <Input
                            type="text"
                            placeholder="Station Code (RJKT)"
                            value={station.code || ""}
                            onChange={(e) => updateStation(index, "code", e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>City</Label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="City"
                              value={station.city}
                              onChange={(e) => updateStation(index, "city", e.target.value)}
                              className="pl-10"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>State</Label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="State"
                              value={station.state}
                              onChange={(e) => updateStation(index, "state", e.target.value)}
                              className="pl-10"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Distance (km)</Label>
                          <Input
                            type="number"
                            placeholder="0"
                            value={station.distance || ""}
                            onChange={(e) => updateStation(index, "distance", parseInt(e.target.value) || 0)}
                          />
                        </div>

                        <div className="flex justify-end items-end h-full">
                          <Button
                            onClick={() => removeStation(index)}
                            variant="destructive"
                            size="sm"
                            disabled={stations.length === 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="coaches" className="space-y-4 mt-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Coach Configuration</h3>
                  <Button onClick={addCoach} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Coach Type
                  </Button>
                </div>

                <div className="space-y-4">
                  {coaches.map((coach, index) => (
                    <Card key={index} className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div className="space-y-2">
                          <Label>Coach Type</Label>
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            value={coach.type}
                            onChange={(e) => updateCoach(index, "type", e.target.value)}
                          >
                            {coachTypes.map((type) => (
                              <option key={type.value} value={type.value}>
                                {type.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label>Number of Coaches</Label>
                          <Input
                            type="number"
                            min="1"
                            max="20"
                            value={coach.count || ""}
                            onChange={(e) => updateCoach(index, "count", parseInt(e.target.value) || 0)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Seats per Coach</Label>
                          <Input
                            type="number"
                            value={coach.seatsPerCoach}
                            onChange={(e) => updateCoach(index, "seatsPerCoach", parseInt(e.target.value) || 0)}
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary" className="flex items-center space-x-1">
                            <Users className="h-3 w-3" />
                            <span>Total: {coach.count * coach.seatsPerCoach}</span>
                          </Badge>
                          <Button
                            onClick={() => removeCoach(index)}
                            variant="destructive"
                            size="sm"
                            disabled={coaches.length === 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-8 flex justify-end space-x-4">
              {activeTab !== "basic" && (
                <Button onClick={handleBack} variant="outline" size="lg">
                  Back
                </Button>
              )}
              {activeTab !== "coaches" ? (
                <Button onClick={handleNext} variant="railway" size="lg" disabled={loading}>
                  Next
                </Button>
              ) : (
                <Button onClick={handleSubmit} variant="railway" size="lg" disabled={loading}>
                  {loading ? (
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    <>
                      <TrainFront className="mr-2 h-4 w-4" />
                      Add Train
                    </>
                  )}
                </Button>
              )}
            </div>
            {loading && (
              <div className="flex flex-col items-center justify-center my-12 space-y-4">
                <TrainLoader size={40} />
                <p className="text-muted-foreground text-sm">Adding train...</p>
              </div>
            )}
            {error && <div className="text-red-500">{error}</div>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAddTrain;
