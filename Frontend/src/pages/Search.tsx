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
        const formattedDate = date.getFullYear() + '-' + 
          String(date.getMonth() + 1).padStart(2, '0') + '-' + 
          String(date.getDate()).padStart(2, '0');
        navigate("/search/results", { state: { fromStationId, toStationId, date: formattedDate, fromStation, toStation } });
        return;
      } catch (err: any) {
        const message = typeof err === "string" ? err : (err.response?.data?.message || err.message) ;
        setError(message || "Failed to fetch trains");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBookTrain = (trainId: number, fromStationId: number, toStationId: number) => {
    const formattedDate = date ? date.getFullYear() + '-' + 
      String(date.getMonth() + 1).padStart(2, '0') + '-' + 
      String(date.getDate()).padStart(2, '0') : '';
    navigate(`/book/${trainId}?fromStationId=${fromStationId}&toStationId=${toStationId}&dateOfBooking=${formattedDate}`);
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
                      disabled={(day) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const dayToCheck = new Date(day);
                        dayToCheck.setHours(0, 0, 0, 0);
                        return dayToCheck < today;
                      }}
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
        
      </div>
    </div>
  );
};

export default Search;
