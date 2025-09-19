import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Users, Train, Calendar, MapPin, ArrowUpRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface TrainResultsProps {
    trains: any[];
    fromStation: string;
    toStation: string;
    fromStationId: number;
    toStationId: number;
    onBook: (trainId: number, fromStationId: number, toStationId: number) => void;
}
const calculatePrice = (coachType: string, distance: number) => {
    // Base prices per km for different coach types
    const basePrices: Record<string, number> = {
        'A1': 4,
        'A2': 3,
        'A3': 2,
        'SL': 1,

    };

    // Default to SL class if coach type not found
    const pricePerKm = basePrices[coachType.toUpperCase()] || basePrices['SL'];

    // Calculate price with minimum fare of 20
    return pricePerKm * distance;
};


// Helper function to format time
const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Helper: themed color classes for train type badges (light + dark)
const getTrainTypeColor = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('rajdhani') || t.includes('shatabdi') || t.includes('vande bharat')) {
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800';
    }
    if (t.includes('duronto') || t.includes('garib rath')) {
        return 'bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-800';
    }
    if (t.includes('jan shatabdi')) {
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800';
    }
    if (t.includes('express')) {
        return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800';
    }
    return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800/40 dark:text-gray-300 dark:border-gray-700';
};

const TrainResults: React.FC<TrainResultsProps> = ({
    trains,
    fromStation,
    toStation,
    fromStationId,
    toStationId,
    onBook,
}) => {
    if (!Array.isArray(trains) || trains.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Train className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground">No trains found</h3>
                <p className="text-muted-foreground mt-1">Try adjusting your search criteria</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">
                        {trains.length} Trains Found
                    </h2>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <MapPin className="h-4 w-4 mr-1.5" />
                        <span className="font-medium capitalize">{fromStation}</span>
                        <ArrowRight className="h-4 w-4 mx-2" />
                        <span className="font-medium capitalize">{toStation}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Sort by:</span>
                    <Button variant="outline" size="sm" className="h-8">
                        Departure
                    </Button>
                    <Button variant="outline" size="sm" className="h-8">
                        Duration
                    </Button>
                </div>
            </div>

            <div className="space-y-4">
                {trains.map((train) => (
                    <Card
                        key={train.trainId}
                        className="overflow-hidden border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg"
                    >
                        <CardHeader className="pb-3 pt-4 px-5 bg-muted/20 border-b">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="flex items-start gap-3">
                                    <div className="bg-primary/10 p-2 rounded-lg">
                                        <Train className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-lg font-semibold text-foreground">
                                                {train.trainName}
                                            </h3>
                                            <Badge variant="secondary" className={cn(
                                                'text-xs font-normal px-2 py-0.5',
                                                getTrainTypeColor(train.trainName)
                                            )}>
                                                {train.trainType || 'EXPRESS'}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {train.trainNumber} • {train.duration || '00:00'} hrs
                                            {train.rating && (
                                                <span className="ml-2 inline-flex items-center text-amber-600">
                                                    <Star className="h-3.5 w-3.5 fill-current mr-0.5" />
                                                    {train.rating}
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        onClick={() => onBook(train.trainId, fromStationId, toStationId)}
                                        className="whitespace-nowrap"
                                    >
                                        Book Now
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-5">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Departure */}
                                <div className="space-y-1">
                                    <div className="text-sm text-muted-foreground">Departure</div>
                                    <div className="text-lg font-semibold">
                                        {train.departureTime ? formatTime(train.departureTime) : '00:00'}
                                    </div>
                                    <div className="text-sm font-semibold capitalize">{fromStation}</div>
                                    <div className="text-xs text-muted-foreground">
                                        {train.departureDate || new Date().toLocaleDateString()}
                                    </div>
                                </div>

                                {/* Duration */}
                                <div className="flex flex-col items-center justify-center">
                                    <div className="relative w-full py-2">
                                        <div className="h-px bg-border w-full"></div>
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary"></div>
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary"></div>
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-1">
                                        {train.duration || '5:00  '} hrs
                                    </div>
                                    <div className="text-xs font-bold mt-1">
                                        {train.totalDistance} KM
                                    </div>
                                </div>

                                {/* Arrival */}
                                <div className="space-y-1 text-right">
                                    <div className="text-sm text-muted-foreground">Arrival</div>
                                    <div className="text-xl font-semibold">
                                        {train.arrivalTime ? formatTime(train.arrivalTime) : '5:00'}
                                    </div>
                                    <div className="text-sm capitalize font-semibold">{toStation}</div>
                                    <div className="text-xs text-muted-foreground">
                                        {train.arrivalDate || new Date().toLocaleDateString()}
                                    </div>
                                </div>
                            </div>

                            {/* Coaches */}
                            <div className="mt-6 pt-5 border-t">
                                <h4 className="text-sm font-medium text-muted-foreground mb-3">
                                    Available Classes
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                                    {train.coaches?.map((coach: any, idx: number) => (
                                        <div
                                            key={idx}
                                            className={cn(
                                                "flex flex-col p-3 rounded-lg border transition-all duration-300",
                                                coach.availableSeats > 0
                                                    ? "bg-green-50 border-green-200 hover:bg-green-100/50 cursor-pointer hover:shadow-md dark:bg-green-900/30 dark:border-green-800 dark:hover:bg-green-900/50"
                                                    : "bg-muted/30 border-border"
                                            )}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <div className="font-medium text-foreground">{coach.coachType}</div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {`₹${calculatePrice(coach.coachType, train.totalDistance)}`}
                                                    </div>
                                                </div>
                                                {coach.availableSeats > 0 && (
                                                    <span className="text-xs px-2 py-0.5 rounded-md bg-green-200 text-green-700 border border-green-500 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700 dark:hover:bg-green-900/50">
                                                        {coach.availableSeats} Available seats
                                                    </span>
                                                )}
                                            </div>
                                            {coach.availableSeats > 0 ? (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="mt-2 h-8 text-xs"
                                                    onClick={() => onBook(train.trainId, fromStationId, toStationId)}
                                                >
                                                    Book Now
                                                </Button>
                                            ) : (
                                                <div className="text-xs text-red-500 mt-2">Waiting List</div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {train.schedules && train.schedules.length > 0 && (
                                <div className="mt-5 pt-4 border-t">
                                    <h4 className="text-sm font-medium text-muted-foreground mb-3">
                                        Schedules
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {train.schedules.map((schedule: any, idx: number) => (
                                            <Badge key={idx} variant="secondary" className="text-xs font-normal">
                                                {schedule.station.stationName}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default TrainResults;
