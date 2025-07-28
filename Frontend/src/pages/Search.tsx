import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Search as SearchIcon, CalendarIcon, MapPin, Users } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { searchTrains, getStationsByQuery } from "@/lib/api";
import { ClipLoader } from "react-spinners";

const Search = () => {
  const navigate = useNavigate();
  const [fromStation, setFromStation] = useState("");
  const [toStation, setToStation] = useState("");
  const [date, setDate] = useState<Date>();
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearched, setIsSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fromSuggestions, setFromSuggestions] = useState<any[]>([]);
  const [toSuggestions, setToSuggestions] = useState<any[]>([]);
  const [fromStationId, setFromStationId] = useState<number | null>(null);
  const [toStationId, setToStationId] = useState<number | null>(null);
  const [fromLoading, setFromLoading] = useState(false);
  const [toLoading, setToLoading] = useState(false);

  let fromTimeout: NodeJS.Timeout;
  let toTimeout: NodeJS.Timeout;

  const handleFromInput = (value: string) => {
    setFromStation(value);
    setFromStationId(null);
    setFromSuggestions([]);
    if (fromTimeout) clearTimeout(fromTimeout);
    if (value.length < 2) return;
    setFromLoading(true);
    fromTimeout = setTimeout(async () => {
      try {
        const stations = await getStationsByQuery(value);
        setFromSuggestions(stations);
      } catch {
        setFromSuggestions([]);
      } finally {
        setFromLoading(false);
      }
    }, 300);
  };

  const handleToInput = (value: string) => {
    setToStation(value);
    setToStationId(null);
    setToSuggestions([]);
    if (toTimeout) clearTimeout(toTimeout);
    if (value.length < 2) return;
    setToLoading(true);
    toTimeout = setTimeout(async () => {
      try {
        const stations = await getStationsByQuery(value);
        setToSuggestions(stations);
      } catch {
        setToSuggestions([]);
      } finally {
        setToLoading(false);
      }
    }, 300);
  };

  const handleSearch = async () => {
    if (fromStationId && toStationId && date) {
      setLoading(true);
      setError(null);
      try {
        const results = await searchTrains(fromStationId, toStationId, date.toLocaleDateString("en-CA"));
        setSearchResults(results);
        setIsSearched(true);
      } catch (err: any) {
        setError(err.message || "Failed to fetch trains");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBookTrain = (trainId: number, fromStationId: number, toStationId: number) => {
    navigate(`/book/${trainId}?fromStationId=${fromStationId}&toStationId=${toStationId}&dateOfBooking=${date?.toLocaleDateString("en-CA")}`);
  };

  const renderSuggestions = (suggestions: any[], setter: Function, setterId: Function) => (
    <div className="absolute left-0 top-11 bg-white border border-border rounded-md w-full max-h-60 overflow-y-auto shadow-lg z-50 text-sm">
      {suggestions.map((station: any) => (
        <div
          key={station.stationId}
          className="px-4 py-2 hover:bg-accent cursor-pointer"
          onClick={() => {
            setter(station.stationName);
            setterId(station.stationId);
            suggestions.length = 0;
          }}
        >
          {station.stationName}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8 bg-gradient-card shadow-elevated">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <SearchIcon className="h-6 w-6 text-primary" />
              <span>Search Trains</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* From Station */}
              <div className="space-y-2 relative">
                <Label htmlFor="from">From Station</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="from"
                    placeholder="Enter source station"
                    value={fromStation}
                    onChange={(e) => handleFromInput(e.target.value)}
                    className="pl-10"
                    autoComplete="off"
                  />
                  {fromLoading && (
                    <div className="absolute top-full mt-1 w-full bg-white text-sm text-muted-foreground px-4 py-2 border rounded shadow z-50">
                      Loading...
                    </div>
                  )}
                  {fromSuggestions.length > 0 && (
                    <div className="absolute top-full mt-1 w-full bg-white border rounded-md shadow-lg z-50 max-h-60 overflow-y-auto text-sm">
                      {fromSuggestions.map((station: any) => (
                        <div
                          key={station.stationId}
                          className="px-4 py-2 hover:bg-accent cursor-pointer"
                          onClick={() => {
                            setFromStation(station.stationName);
                            setFromStationId(station.stationId);
                            setFromSuggestions([]);
                          }}
                        >
                          {station.stationName}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>


              {/* To Station */}
              <div className="space-y-2 relative">
                <Label htmlFor="to">To Station</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="to"
                    placeholder="Enter destination station"
                    value={toStation}
                    onChange={(e) => handleToInput(e.target.value)}
                    className="pl-10"
                    autoComplete="off"
                  />
                  {toLoading && (
                    <div className="absolute top-full mt-1 w-full bg-white text-sm text-muted-foreground px-4 py-2 border rounded shadow z-50">
                      Loading...
                    </div>
                  )}
                  {toSuggestions.length > 0 && (
                    <div className="absolute top-full mt-1 w-full bg-white border rounded-md shadow-lg z-50 max-h-60 overflow-y-auto text-sm">
                      {toSuggestions.map((station: any) => (
                        <div
                          key={station.stationId}
                          className="px-4 py-2 hover:bg-accent cursor-pointer"
                          onClick={() => {
                            setToStation(station.stationName);
                            setToStationId(station.stationId);
                            setToSuggestions([]);
                          }}
                        >
                          {station.stationName}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Date */}
              <div className="space-y-2">
                <Label>Journey Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(day) => day < new Date()}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Search Button */}
              <div className="flex items-end">
                <Button
                  onClick={handleSearch}
                  variant="railway"
                  className="w-full"
                  disabled={!fromStationId || !toStationId || !date || loading}
                >
                  <SearchIcon className="mr-2 h-4 w-4" />
                  Search Trains
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loader */}
        {loading && (
          <div className="flex justify-center items-center my-10">
            <ClipLoader size={35} color="#2563eb" />
          </div>
        )}

        {/* Error */}
        {error && <div className="text-red-500 text-center mt-4">{error}</div>}

        {/* Search Results */}
        {isSearched && !loading && (
          <div className="space-y-4 animate-fadeIn">
            <h2 className="text-2xl font-bold text-foreground">Available Trains ({searchResults.length})</h2>
            {Array.isArray(searchResults) && searchResults.length > 0 ? (
              searchResults.map((train) => (
                <Card key={train.trainId} className="bg-white shadow-card hover:shadow-elevated transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                      <div className="lg:col-span-1">
                        <h3 className="text-lg font-semibold text-foreground">{train.trainName}</h3>
                        <p className="text-sm text-muted-foreground">#{train.trainNumber}</p>
                      </div>

                      <div className="lg:col-span-1 text-center">
                        <div className="text-sm text-muted-foreground">{fromStation}</div>
                        <div className="my-2 border-t border-border"></div>
                        <div className="text-sm text-muted-foreground">{toStation}</div>
                      </div>

                      <div className="lg:col-span-1">
                        <div className="grid grid-cols-1 gap-2">
                          {train.coaches.map((coach: any, idx: number) => (
                            <div key={idx} className="flex justify-between items-center p-2 bg-muted rounded">
                              <span className="font-medium">{coach.coachType}</span>
                              <div className="text-xs text-muted-foreground">
                                <Users className="inline h-3 w-3 mr-1" />
                                {coach.availableSeats}/{coach.totalSeats}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="lg:col-span-1 flex items-center justify-center">
                        <Button
                          onClick={() => handleBookTrain(train.trainId, fromStationId!, toStationId!)}
                          variant="railway"
                          size="lg"
                          className="w-full"
                        >
                          Book Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div>No trains found or invalid response from server.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
