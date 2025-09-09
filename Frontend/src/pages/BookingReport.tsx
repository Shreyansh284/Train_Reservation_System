import React, { useState, useEffect } from 'react';
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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Download, RefreshCw, Filter, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { format } from 'date-fns';

interface DisplayAllBookings {
    pnr: number;
    trainName: string;
    trainNumber: string;
    userEmail: string;
    userName: string;
    source: string;
    destination: string;
    journeyDate: string;
    totalFare: number;
    totalSeats: number;
    confirmedSeats: number;
    waitingSeats: number;
    cancelledSeats: number;
}

const BookingReport: React.FC = () => {
    const [bookings, setBookings] = useState<DisplayAllBookings[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('all');
    const [sortField, setSortField] = useState<keyof DisplayAllBookings | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/bookings');
            setBookings(response.data || []);
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to fetch booking data',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleSort = (field: keyof DisplayAllBookings) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const getSortIcon = (field: keyof DisplayAllBookings) => {
        if (sortField !== field) {
            return <ArrowUpDown className="h-4 w-4" />;
        }
        return sortDirection === 'asc' ?
            <ArrowUp className="h-4 w-4" /> :
            <ArrowDown className="h-4 w-4" />;
    };

    const sortedAndFilteredBookings = bookings
        .filter((booking) => {
            if (filter === 'all') return true;
            // Filter based on seat types
            if (filter === 'confirmed') return booking.confirmedSeats > 0;
            if (filter === 'waiting') return booking.waitingSeats > 0;
            if (filter === 'cancelled') return booking.cancelledSeats > 0;
            return true;
        })
        .sort((a, b) => {
            if (!sortField) return 0;

            let aValue = a[sortField];
            let bValue = b[sortField];

            // Handle date sorting
            if (sortField === 'journeyDate') {
                aValue = new Date(aValue as string).getTime();
                bValue = new Date(bValue as string).getTime();
            }

            // Handle string/number comparison
            if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

    const totalBookings = bookings.length;
    const totalConfirmedSeats = bookings.reduce((sum, booking) => sum + booking.confirmedSeats, 0);
    const totalWaitingSeats = bookings.reduce((sum, booking) => sum + booking.waitingSeats, 0);
    const totalCancelledSeats = bookings.reduce((sum, booking) => sum + booking.cancelledSeats, 0);
    const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalFare, 0);

    const exportToCSV = () => {
        const headers = [
            'PNR',
            'User Name',
            'User Email',
            'Train Number',
            'Train Name',
            'Route',
            'Journey Date',
            'Total Seats',
            'Confirmed Seats',
            'Waiting Seats',
            'Cancelled Seats',
            'Total Fare'
        ];

        const csvData = sortedAndFilteredBookings.map(booking => [
            booking.pnr,
            booking.userName,
            booking.userEmail,
            booking.trainNumber,
            booking.trainName,
            `${booking.source} to ${booking.destination}`,
            format(new Date(booking.journeyDate), 'dd/MM/yyyy'),
            booking.totalSeats,
            booking.confirmedSeats,
            booking.waitingSeats,
            booking.cancelledSeats,
            `₹${booking.totalFare}`
        ]);

        const csvContent = [headers, ...csvData]
            .map(row => row.map(cell => `"${cell}"`).join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `booking-report-${format(new Date(), 'yyyy-MM-dd')}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) {
        return <Loading className="min-h-[60vh]" />;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Booking Report</h1>
                    <p className="text-muted-foreground">
                        View and manage all train bookings in the system
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        onClick={fetchBookings}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Refresh
                    </Button>
                    <Button
                        onClick={exportToCSV}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                    >
                        <Download className="h-4 w-4" />
                        Export CSV
                    </Button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalBookings}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Confirmed Seats</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{totalConfirmedSeats}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Waiting Seats</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{totalWaitingSeats}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Cancelled Seats</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{totalCancelledSeats}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">₹{totalRevenue.toLocaleString()}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex justify-between items-center">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="flex items-center gap-2">
                            <Filter className="h-4 w-4" />
                            Filter: {filter === 'all' ? 'All Bookings' : filter}
                            <ChevronDown className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setFilter('all')}>
                            All Bookings
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setFilter('confirmed')}>
                            With Confirmed Seats
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setFilter('waiting')}>
                            With Waiting Seats
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setFilter('cancelled')}>
                            With Cancelled Seats
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
                <div className="text-sm text-muted-foreground">
                    Showing {sortedAndFilteredBookings.length} of {totalBookings} bookings
                    {sortField && (
                        <span className="ml-2">
                            • Sorted by {sortField} ({sortDirection === 'asc' ? 'ascending' : 'descending'})
                        </span>
                    )}
                </div>
            </div>

            {/* Bookings Table */}
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
                                        onClick={() => handleSort('pnr')}
                                    >
                                        PNR {getSortIcon('pnr')}
                                    </Button>
                                </TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-auto p-1 font-semibold hover:bg-gray-100 flex items-center gap-1"
                                        onClick={() => handleSort('trainNumber')}
                                    >
                                        Train {getSortIcon('trainNumber')}
                                    </Button>
                                </TableHead>
                                <TableHead>Route</TableHead>
                                <TableHead>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-auto p-1 font-semibold hover:bg-gray-100 flex items-center gap-1"
                                        onClick={() => handleSort('journeyDate')}
                                    >
                                        Journey Date {getSortIcon('journeyDate')}
                                    </Button>
                                </TableHead>
                                <TableHead>Seats</TableHead>
                                <TableHead>Total Fare</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedAndFilteredBookings.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8">
                                        No bookings found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                sortedAndFilteredBookings.map((booking, index) => (
                                    <TableRow key={`${booking.pnr}-${index}`}>
                                        <TableCell className="font-medium">{booking.pnr}</TableCell>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">{booking.userName}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    {booking.userEmail}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">{booking.trainNumber}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    {booking.trainName}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                {booking.source} to {booking.destination}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {format(new Date(booking.journeyDate), 'dd/MM/yyyy')}
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1">
                                                <div className="text-sm">
                                                    <span className="font-medium">Total: </span>{booking.totalSeats}
                                                </div>
                                                {booking.confirmedSeats > 0 && (
                                                    <Badge variant="default" className="text-xs mr-1">
                                                        Confirmed: {booking.confirmedSeats}
                                                    </Badge>
                                                )}
                                                {booking.waitingSeats > 0 && (
                                                    <Badge variant="secondary" className="text-xs mr-1">
                                                        Waiting: {booking.waitingSeats}
                                                    </Badge>
                                                )}
                                                {booking.cancelledSeats > 0 && (
                                                    <Badge variant="destructive" className="text-xs mr-1">
                                                        Cancelled: {booking.cancelledSeats}
                                                    </Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            ₹{booking.totalFare.toLocaleString()}
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

export default BookingReport;
