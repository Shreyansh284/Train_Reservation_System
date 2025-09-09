import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loading } from '@/components/ui/loading';
import { toast } from '@/components/ui/use-toast';
import apiClient from '@/lib/apiClient';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    ChevronDown,
    RefreshCw,
    Filter,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    Train,
    MapPin,
    Users,
    Route,
    Plus
} from 'lucide-react';

interface DisplayStationDTO {
    stationId: number;
    stationCode: string;
    stationName: string;
    city: string;
    state: string;
}

interface DisplayCoachDTO {
    coachId: number;
    coachNumber: string;
    coachClass: string;
    totalSeats: number;
}

interface DisplayTrainScheduleDTO {
    scheduleId: number;
    station: DisplayStationDTO;
    distanceFromSource: number;
}

interface DisplayTrainDTO {
    trainId: number;
    trainNumber: string;
    trainName: string;
    sourceStation: DisplayStationDTO;
    destinationStation: DisplayStationDTO;
    coaches: DisplayCoachDTO[];
    schedules: DisplayTrainScheduleDTO[];
}

const Trains: React.FC = () => {
    const [trains, setTrains] = useState<DisplayTrainDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('all');
    const [sortField, setSortField] = useState<keyof DisplayTrainDTO | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    const fetchTrains = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/train');
            setTrains(response.data || []);
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to fetch trains data',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrains();
    }, []);

    const handleSort = (field: keyof DisplayTrainDTO) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const getSortIcon = (field: keyof DisplayTrainDTO) => {
        if (sortField !== field) {
            return <ArrowUpDown className="h-4 w-4" />;
        }
        return sortDirection === 'asc' ?
            <ArrowUp className="h-4 w-4" /> :
            <ArrowDown className="h-4 w-4" />;
    };

    const getClassVariant = (coachClass: string) => {
        switch (coachClass.toLowerCase()) {
            case 'a1':
            case 'first ac':
                return 'default';
            case 'a2':
            case 'second ac':
                return 'secondary';
            case ' a3':
            case 'third ac':
                return 'outline';
            case 'sl':
            case 'sleeper':
                return 'destructive';
            default:
                return 'outline';
        }
    };

    const sortedAndFilteredTrains = trains
        .filter((train) => {
            if (filter === 'all') return true;
            // Add filtering logic if needed
            return true;
        })
        .sort((a, b) => {
            if (!sortField) return 0;

            let aValue = a[sortField];
            let bValue = b[sortField];

            // Handle string/number comparison
            if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

    const totalTrains = trains.length;
    const totalCoaches = trains.reduce((sum, train) => sum + train.coaches.length, 0);
    const totalSeats = trains.reduce((sum, train) =>
        sum + train.coaches.reduce((coachSum, coach) => coachSum + coach.totalSeats, 0), 0
    );

    if (loading) {
        return <Loading className="min-h-[60vh]" />;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Trains Management</h1>
                    <p className="text-muted-foreground">
                        View and manage all trains with their station and coach information
                    </p>
                </div>
                <div className="flex gap-2">
                    <Link to="/admin/add-train">
                        <Button
                            variant="default"
                            size="sm"
                            className="flex items-center gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            Add Train
                        </Button>
                    </Link>
                    <Button
                        onClick={fetchTrains}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Trains</CardTitle>
                        <Train className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalTrains}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Coaches</CardTitle>
                        <Route className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{totalCoaches}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Seats</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{totalSeats}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex justify-between items-center">
                <div className="flex gap-2">
                    {sortField && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                setSortField(null);
                                setSortDirection('asc');
                            }}
                            className="flex items-center gap-2"
                        >
                            Clear Sort
                        </Button>
                    )}
                </div>
                <div className="text-sm text-muted-foreground">
                    Showing {sortedAndFilteredTrains.length} of {totalTrains} trains
                    {sortField && (
                        <span className="ml-2">
                            • Sorted by {sortField} ({sortDirection === 'asc' ? 'ascending' : 'descending'})
                        </span>
                    )}
                </div>
            </div>

            {/* Trains Table */}
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-auto p-1 font-semibold hover:bg-gray-100 flex items-center gap-1"
                                        onClick={() => handleSort('trainNumber')}
                                    >
                                        Train Number {getSortIcon('trainNumber')}
                                    </Button>
                                </TableHead>
                                <TableHead>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-auto p-1 font-semibold hover:bg-gray-100 flex items-center gap-1"
                                        onClick={() => handleSort('trainName')}
                                    >
                                        Train Name {getSortIcon('trainName')}
                                    </Button>
                                </TableHead>
                                <TableHead>Route</TableHead>
                                <TableHead>Coaches</TableHead>
                                <TableHead>Total Seats</TableHead>
                                <TableHead>Stations</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedAndFilteredTrains.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8">
                                        No trains found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                sortedAndFilteredTrains.map((train, index) => (
                                    <TableRow key={`${train.trainId}-${index}`}>
                                        <TableCell className="font-medium">
                                            {train.trainNumber}
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">{train.trainName}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-3 w-3 text-green-600" />
                                                    <span className="text-sm font-medium">
                                                        {train.sourceStation.stationCode}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {train.sourceStation.stationName}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-3 w-3 text-red-600" />
                                                    <span className="text-sm font-medium">
                                                        {train.destinationStation.stationCode}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {train.destinationStation.stationName}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {train.coaches.map((coach) => (
                                                    <Badge
                                                        key={coach.coachId}
                                                        variant={getClassVariant(coach.coachClass)}
                                                        className="text-xs"
                                                    >
                                                        {coach.coachNumber} ({coach.coachClass})
                                                    </Badge>
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {train.coaches.reduce((sum, coach) => sum + coach.totalSeats, 0)}
                                        </TableCell>
                                        <TableCell>
                                            <Accordion type="single" collapsible>
                                                <AccordionItem value={`stations-${train.trainId}`}>
                                                    <AccordionTrigger className="py-2">
                                                        <span className="text-sm">
                                                            {train.schedules.length} stations
                                                        </span>
                                                    </AccordionTrigger>
                                                    <AccordionContent>
                                                        <div className="space-y-2 max-h-48 overflow-y-auto">
                                                            {train.schedules
                                                                .sort((a, b) => a.distanceFromSource - b.distanceFromSource)
                                                                .map((schedule) => (
                                                                    <div key={schedule.scheduleId} className="flex justify-between items-center text-xs border-b pb-1">
                                                                        <div>
                                                                            <span className="font-medium">
                                                                                {schedule.station.stationCode}
                                                                            </span>
                                                                            <span className="ml-2 text-muted-foreground">
                                                                                {schedule.station.stationName}
                                                                            </span>
                                                                        </div>
                                                                        <span className="text-muted-foreground">
                                                                            {schedule.distanceFromSource} km
                                                                        </span>
                                                                    </div>
                                                                ))}
                                                        </div>
                                                    </AccordionContent>
                                                </AccordionItem>
                                            </Accordion>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default Trains;
