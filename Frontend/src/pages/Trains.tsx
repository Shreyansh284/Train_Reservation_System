import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loading } from '@/components/ui/loading';
import { toast } from '@/components/ui/use-toast';
import { Switch } from '@/components/ui/switch';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
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
    Plus,
    Eye,
    Clock,
    Wifi,
    Coffee,
    Utensils,
    Car,
    Navigation,
    Circle,
    CheckCircle2,
    XCircle,
    Power
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
    isActive?: boolean; // For future API integration
}

// Coach Details Modal Component
const CoachDetailsModal: React.FC<{ train: DisplayTrainDTO }> = ({ train }) => {
    const getCoachGradient = (coachClass: string) => {
        switch (coachClass.toLowerCase()) {
            case 'a1':
            case 'first ac':
                return 'bg-gradient-to-r from-purple-500 to-pink-500';
            case 'a2':
            case 'second ac':
                return 'bg-gradient-to-r from-blue-500 to-cyan-500';
            case 'a3':
            case 'third ac':
                return 'bg-gradient-to-r from-green-500 to-teal-500';
            case 'sl':
            case 'sleeper':
                return 'bg-gradient-to-r from-orange-500 to-red-500';
            default:
                return 'bg-gradient-to-r from-gray-500 to-gray-600';
        }
    };


    return (
        <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh]">
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                    <Train className="h-5 w-5" />
                    {train.trainNumber} - {train.trainName} Coaches
                </DialogTitle>
            </DialogHeader>

            <div className="max-h-[75vh] overflow-y-auto pr-2 space-y-6">
                {/* Realistic Train Visual Layout */}
                <div className="bg-card p-6 rounded-lg shadow-sm">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <Train className="h-5 w-5" />
                        Train Carriage - {train.trainNumber}
                    </h3>

                    {/* Train Track */}
                    <div className="relative overflow-x-auto overflow-y-hidden">
                        {/* Railway Tracks */}
                        <div className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2">
                            <div className="h-1 bg-border relative">
                                {/* Track ties */}
                                <div className="absolute inset-0 flex justify-between items-center">
                                    {Array.from({ length: 20 }).map((_, i) => (
                                        <div key={i} className="w-0.5 h-4 bg-muted -translate-y-1.5"></div>
                                    ))}
                                </div>
                            </div>
                            <div className="h-1 bg-border mt-2 relative">
                                <div className="absolute inset-0 flex justify-between items-center">
                                    {Array.from({ length: 20 }).map((_, i) => (
                                        <div key={i} className="w-0.5 h-4 bg-muted translate-y-1.5"></div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Train Engine */}
                        <div className="relative z-10 flex items-center min-w-max">

                            <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-l-full rounded-r-lg p-4 min-w-[100px] text-white shadow-xl border-4 border-red-800 relative">
                                <div className="text-center">
                                    <div className="font-bold text-sm">ENGINE</div>
                                    <div className="text-xs opacity-90"></div>
                                </div>
                                {/* Engine Details */}
                                <div className="absolute -top-2 -right-1 w-3 h-3 bg-yellow-400 rounded-full"></div>
                                <div className="absolute top-1 right-1 w-1 h-1 bg-card rounded-full"></div>
                                <div className="absolute bottom-1 right-1 w-1 h-1 bg-card rounded-full"></div>
                                {/* Smoke effect */}
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                    <div className="w-2 h-2 bg-muted-foreground rounded-full opacity-60 animate-pulse"></div>
                                    <div className="w-1 h-1 bg-muted rounded-full opacity-40 animate-pulse delay-100 ml-1 -mt-1"></div>
                                </div>
                            </div>

                            {/* Coupling between engine and first coach */}
                            <div className="w-4 h-2 bg-gray-600 shadow-lg relative z-5">
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-gray-800 rounded-full"></div>
                            </div>

                            {/* Train Coaches */}
                            <div className="flex items-center">
                                {train.coaches.map((coach, index) => (
                                    <React.Fragment key={coach.coachId}>
                                        {/* Coach Carriage */}
                                        <div
                                            className={`${getCoachGradient(coach.coachClass)} 
                                                       relative min-w-[140px] h-20 text-white shadow-xl 
                                                       transform hover:scale-105 transition-all duration-300
                                                       hover:shadow-2xl cursor-pointer border-4 border-gray-700
                                                       ${index === 0 ? 'rounded-l-lg' : ''}
                                                       ${index === train.coaches.length - 1 ? 'rounded-r-lg' : ''}`}
                                            style={{
                                                clipPath: index === 0 ? 'polygon(0 0, 100% 0, 100% 100%, 5% 100%)' :
                                                    index === train.coaches.length - 1 ? 'polygon(0 0, 95% 0, 100% 100%, 0 100%)' :
                                                        'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
                                            }}
                                        >
                                            {/* Coach Body */}
                                            <div className="absolute inset-0 p-3 flex flex-col justify-center items-center">
                                                <div className="font-bold text-sm">{coach.coachNumber}</div>
                                                <div className="text-xs opacity-90 font-medium">{coach.coachClass}</div>
                                                <div className="text-xs mt-1 bg-black bg-opacity-20 px-2 py-0.5 rounded">
                                                    {coach.totalSeats} seats
                                                </div>
                                            </div>

                                            {/* Wheels */}
                                            <div className="absolute -bottom-3 left-3">
                                                <div className="w-4 h-4 bg-muted-foreground rounded-full border-2 border-border">
                                                    <div className="w-2 h-2 bg-muted rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                                                </div>
                                            </div>
                                            <div className="absolute -bottom-3 right-3">
                                                <div className="w-4 h-4 bg-muted-foreground rounded-full border-2 border-border">
                                                    <div className="w-2 h-2 bg-muted rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                                                </div>
                                            </div>

                                            {/* Coach Class Indicator */}
                                            <div className="absolute top-0 right-0 bg-card/90 text-foreground text-xs px-1 rounded-bl font-semibold">
                                                {coach.coachClass}
                                            </div>
                                        </div>

                                        {/* Coupling between coaches */}
                                        {index < train.coaches.length - 1 && (
                                            <div className="w-3 h-2 bg-gray-600 shadow-lg relative z-5">
                                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-gray-800 rounded-full"></div>
                                            </div>
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Direction Indicator */}
                    <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <div className="w-0 h-0 border-l-4 border-l-green-500 border-y-4 border-y-transparent"></div>
                            <span>Direction of Travel</span>
                        </div>
                        <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            Total Length: ~{train.coaches.length * 20 + 15}m
                        </div>
                    </div>
                </div>

            </div>
        </DialogContent>
    );
};

// Station Route Modal Component
const StationRouteModal: React.FC<{ train: DisplayTrainDTO }> = ({ train }) => {
    const sortedSchedules = [...train.schedules].sort((a, b) => a.distanceFromSource - b.distanceFromSource);

    const getStationColor = (index: number, total: number) => {
        if (index === 0) return 'text-green-600 bg-green-100'; // Origin
        if (index === total - 1) return 'text-red-600 bg-red-100'; // Destination
        return 'text-blue-600 bg-blue-100'; // Intermediate stops
    };

    return (
        <DialogContent className="w-[95vw] max-w-3xl max-h-[90vh]">
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                    <Route className="h-5 w-5" />
                    {train.trainNumber} - Route Information
                </DialogTitle>
            </DialogHeader>

            <div className="max-h-[75vh] overflow-y-auto pr-2 space-y-6">
                {/* Route Overview */}
                <Card className="bg-secondary">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Circle className="h-3 w-3 text-green-600 fill-current" />
                                <span className="font-semibold">{train.sourceStation.stationName}</span>
                                <span className="text-sm text-muted-foreground">({train.sourceStation.stationCode})</span>
                            </div>
                            <Navigation className="h-5 w-5 text-muted-foreground" />
                            <div className="flex items-center gap-2">
                                <span className="font-semibold">{train.destinationStation.stationName}</span>
                                <span className="text-sm text-muted-foreground">({train.destinationStation.stationCode})</span>
                                <Circle className="h-3 w-3 text-red-600 fill-current" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Route Timeline */}
                <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Station Schedule
                    </h3>

                    <div className="relative">
                        {/* Timeline Line */}
                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border"></div>

                        {sortedSchedules.map((schedule, index) => (
                            <div key={schedule.scheduleId} className="relative flex items-start gap-4 pb-6">
                                {/* Timeline Dot */}
                                <div className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white shadow-lg ${getStationColor(index, sortedSchedules.length)}`}>
                                    <Circle className="h-3 w-3 fill-current" />
                                </div>

                                {/* Station Information */}
                                <Card className="flex-1 hover:shadow-md transition-shadow duration-200">
                                    <CardContent className="p-4">
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-semibold text-lg">{schedule.station.stationName}</h4>
                                                    <p className="text-sm text-muted-foreground">
                                                        {schedule.station.stationCode} • {schedule.station.city}, {schedule.station.state}
                                                    </p>
                                                </div>
                                                <Badge variant="outline">
                                                    {schedule.distanceFromSource} km
                                                </Badge>
                                            </div>

                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                                    <span>Platform TBD</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                                    <span>Time TBD</span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DialogContent>
    );
};

const Trains: React.FC = () => {
    const [trains, setTrains] = useState<DisplayTrainDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [sortField, setSortField] = useState<keyof DisplayTrainDTO | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    const fetchTrains = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/trains');
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

    const toggleTrainStatus = async (trainId: number, currentStatus: boolean) => {
        try {
            const response = await apiClient.patch(`/trains/${trainId}/status`);
            // Update the local state to reflect the change
            setTrains(prevTrains =>
                prevTrains.map(train =>
                    train.trainId === trainId
                        ? { ...train, isActive: !currentStatus }
                        : train
                )
            );
            // Show API message if present, else fallback
            toast({
                title: 'Success',
                description: response?.data?.msg || response?.data?.message || `Train status ${!currentStatus ? 'activated' : 'deactivated'} successfully`,
                variant: 'default',
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to toggle train status',
                variant: 'destructive',
            });
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
        // Return full, static Tailwind classes for badge background/text to keep JIT happy and be dark-friendly
        switch (coachClass.toLowerCase()) {
            case 'a1':
            case 'first ac':
                return 'bg-blue-500 text-white';
            case 'a2':
            case 'second ac':
                return 'bg-green-500 text-white';
            case 'a3':
            case 'third ac':
                return 'bg-yellow-500 text-black';
            case 'sl':
            case 'sleeper':
                return 'bg-orange-500 text-white';
            default:
                return 'bg-gray-500 text-white';
        }
    };

    const sortedAndFilteredTrains = trains
        .filter((train) => {
            if (filter === 'all') return true;
            if (filter === 'active') return train.isActive;
            if (filter === 'inactive') return !train.isActive;
            return true;
        })
        .sort((a, b) => {
            if (!sortField) return 0;
            let aValue = a[sortField];
            let bValue = b[sortField];
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
                        <div className="text-2xl font-bold text-foreground">{totalTrains}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Coaches</CardTitle>
                        <Route className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary">{totalCoaches}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Seats</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary">{totalSeats}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters and Sorting */}
            <div className="flex justify-between items-center flex-wrap gap-4">
                <div className="flex gap-2 flex-wrap items-center">
                    {/* Filter Buttons */}
                    <Button
                        variant={filter === 'all' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilter('all')}
                    >
                        All
                    </Button>
                    <Button
                        variant={filter === 'active' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilter('active')}
                    >
                        Active
                    </Button>
                    <Button
                        variant={filter === 'inactive' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilter('inactive')}
                    >
                        Inactive
                    </Button>

                    {/* Sort Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="flex items-center gap-2">
                                <ArrowUpDown className="h-4 w-4" />
                                Sort by
                                <ChevronDown className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleSort('trainNumber')}>
                                Train Number {sortField === 'trainNumber' && getSortIcon('trainNumber')}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSort('trainName')}>
                                Train Name {sortField === 'trainName' && getSortIcon('trainName')}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

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

            {/* Trains Grid */}
            <div className="space-y-4">
                {sortedAndFilteredTrains.length === 0 ? (
                    <Card>
                        <CardContent className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <Train className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-foreground mb-2">No trains found</h3>
                                <p className="text-muted-foreground">Try adjusting your filters or add a new train.</p>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    sortedAndFilteredTrains.map((train) => (
                        <Card key={train.trainId} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary">
                            <CardContent className="p-4">
                                <div className="space-y-3">
                                    {/* Train Header */}
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-0.5">
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-lg font-bold text-foreground">
                                                    {train.trainNumber}
                                                </h3>
                                                <div className="flex items-center gap-1">
                                                    <Switch
                                                        checked={train.isActive}
                                                        onCheckedChange={() => toggleTrainStatus(train.trainId, train.isActive ?? true)}
                                                        className="data-[state=checked]:bg-green-500 scale-75"
                                                    />
                                                    <span className="text-xs text-muted-foreground">
                                                        {train.isActive ?? true ? 'Active' : 'Inactive'}
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="text-base text-foreground font-medium">{train.trainName}</p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {train.isActive ? (
                                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                                            ) : (
                                                <XCircle className="h-5 w-5 text-red-500" />
                                            )}
                                        </div>
                                    </div>

                                    {/* Route Information */}
                                    <div className="bg-secondary rounded-lg p-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                <div>
                                                    <p className="font-semibold text-foreground text-sm">
                                                        {train.sourceStation.stationName}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {train.sourceStation.stationCode} • {train.sourceStation.city}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center px-2">
                                                <div className="flex-1 h-0.5 bg-border relative w-8">
                                                    <Train className="h-3 w-3 text-primary absolute -top-1.5 left-1/2 transform -translate-x-1/2" />
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="text-right">
                                                    <p className="font-semibold text-foreground text-sm">
                                                        {train.destinationStation.stationName}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {train.destinationStation.stationCode} • {train.destinationStation.city}
                                                    </p>
                                                </div>
                                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quick Stats */}
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="text-center bg-muted rounded-lg p-2">
                                            <div className="text-lg font-bold text-primary">
                                                {train.coaches.length}
                                            </div>
                                            <div className="text-xs text-muted-foreground">Coaches</div>
                                        </div>
                                        <div className="text-center bg-muted rounded-lg p-2">
                                            <div className="text-lg font-bold text-primary">
                                                {train.coaches.reduce((sum, coach) => sum + coach.totalSeats, 0)}
                                            </div>
                                            <div className="text-xs text-muted-foreground">Total Seats</div>
                                        </div>
                                        <div className="text-center bg-muted rounded-lg p-2">
                                            <div className="text-lg font-bold text-primary">
                                                {train.schedules.length}
                                            </div>
                                            <div className="text-xs text-muted-foreground">Stations</div>
                                        </div>
                                    </div>

                                    {/* Coach Preview */}
                                    <div className="space-y-1">
                                        <h4 className="font-semibold text-foreground flex items-center gap-1 text-sm">
                                            <Car className="h-3 w-3" />
                                            Coach Classes
                                        </h4>
                                        <div className="flex flex-wrap gap-1">
                                            {[...new Set(train.coaches.map(c => c.coachClass))].map((coachClass) => {
                                                const count = train.coaches.filter(c => c.coachClass === coachClass).length;
                                                return (
                                                    <Badge
                                                        key={coachClass}
                                                        className={`px-2 py-0.5 text-xs ${getClassVariant(coachClass)}`}
                                                    >
                                                        {coachClass} ({count})
                                                    </Badge>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex justify-end gap-2 pt-2 border-t">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" size="sm" className="flex items-center gap-1 h-8 text-xs">
                                                    <Route className="h-3 w-3" />
                                                    View Route
                                                </Button>
                                            </DialogTrigger>
                                            <StationRouteModal train={train} />
                                        </Dialog>

                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" size="sm" className="flex items-center gap-1 h-8 text-xs">
                                                    <Eye className="h-3 w-3" />
                                                    View Coaches
                                                </Button>
                                            </DialogTrigger>
                                            <CoachDetailsModal train={train} />
                                        </Dialog>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default Trains;
