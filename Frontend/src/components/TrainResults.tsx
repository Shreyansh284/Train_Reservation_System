import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

interface TrainResultsProps {
    trains: any[];
    fromStation: string;
    toStation: string;
    fromStationId: number;
    toStationId: number;
    onBook: (trainId: number, fromStationId: number, toStationId: number) => void;
}

const TrainResults: React.FC<TrainResultsProps> = ({
    trains,
    fromStation,
    toStation,
    fromStationId,
    toStationId,
    onBook,
}) => {
    if (!Array.isArray(trains) || trains.length === 0) {
        return <div>No trains found or invalid response from server.</div>;
    }

    return (
        <div className="space-y-4 animate-fadeIn">
            <h2 className="text-2xl font-bold text-foreground">
                Available Trains ({trains.length})
            </h2>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {trains.map((train) => (
                    <Card
                        key={train.trainId}
                        className="bg-white shadow-card hover:shadow-elevated transition-all duration-300"
                    >
                        <CardContent className="p-6 space-y-4">
                            {/* Header */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground">
                                        {train.trainName}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        #{train.trainNumber}
                                    </p>
                                </div>
                                <Button
                                    onClick={() => onBook(train.trainId, fromStationId, toStationId)}
                                    variant="railway"
                                    size="sm"
                                >
                                    Book Now
                                </Button>
                            </div>

                            {/* Route */}
                            <div className="flex justify-between text-sm text-muted-foreground border rounded p-2 bg-muted">
                                <span>{fromStation}</span>
                                <span className="mx-2">➔</span>
                                <span>{toStation}</span>
                            </div>

                            {/* Coaches */}
                            <div className="grid grid-cols-1 gap-2">
                                {train.coaches?.map((coach: any, idx: number) => (
                                    <div
                                        key={idx}
                                        className="flex justify-between items-center p-2 bg-accent/40 rounded"
                                    >
                                        <span className="font-medium">{coach.coachType}</span>
                                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Users className="h-3 w-3" />
                                            {coach.availableSeats}/{coach.totalSeats}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default TrainResults;
