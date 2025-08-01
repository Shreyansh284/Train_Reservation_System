import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { searchTrains } from "@/lib/api";
import { ClipLoader } from "react-spinners";
import TrainResults from "@/components/TrainResults";
import { ArrowRight, Calendar as CalendarIcon, MapPin } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Button } from "react-day-picker";

interface LocationState {
    fromStationId: number;
    toStationId: number;
    date: string;
    fromStation: string;
    toStation: string;
}

const SearchResults = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const {
        fromStationId,
        toStationId,
        date,
        fromStation,
        toStation,
// Default distance if not provided
    } = (state || {}) as LocationState;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [results, setResults] = useState<any[]>([]);

    useEffect(() => {
        if (!fromStationId || !toStationId || !date) {
            navigate("/search");
            return;
        }
        (async () => {
            try {
                const data = await searchTrains(fromStationId, toStationId, date);
                setResults(data);
            } catch (err: any) {
                const message = typeof err === "string" ? err : err.response?.data?.message || err.message;
                setError(message || "Failed to fetch trains");
            } finally {
                setLoading(false);
            }
        })();
    }, [fromStationId, toStationId, date, navigate]);

    if (loading) {
        return (
            <div className="flex justify-center items-center my-10">
                <ClipLoader size={35} color="#2563eb" />
            </div>
        );
    }

    // Parsed readable date for header
    const readableDate = format(parseISO(date), "PPP");

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 pb-16">
            {/* Sticky header */}
            <div className="backdrop-blur bg-background/80 border-b border-border sticky top-0 z-40">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-base font-medium">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span className="capitalize">{fromStation}</span>
                        <ArrowRight className="h-4 w-4" />
                        <span className="capitalize">{toStation}</span>
                        <span className="mx-3 hidden sm:inline-block h-4 w-px bg-border" />
                        <CalendarIcon className="h-4 w-4 text-primary" />
                        <span>{readableDate}</span>
                    </div>
                    {/* <Button variant="secondary" size="sm" onClick={() => navigate(-1)}>
                        Back
                    </Button> */}
                </div>
            </div>

            <div className="container mx-auto px-4 pt-6">
                {error && (
                    <div className="text-red-500 text-center mb-4 animate-fadeIn">
                        {error}
                    </div>
                )}
                <TrainResults
                    trains={results}
                    fromStation={fromStation}
                    toStation={toStation}
                    fromStationId={fromStationId}
                    toStationId={toStationId}
                    onBook={(trainId) =>
                        navigate(
                            `/book/${trainId}?fromStationId=${fromStationId}&toStationId=${toStationId}&dateOfBooking=${date}`
                        )
                    }
                />
            </div>
        </div>
    );
};

export default SearchResults;
