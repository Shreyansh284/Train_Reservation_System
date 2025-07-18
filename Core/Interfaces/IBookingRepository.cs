using Core.Entities;

namespace Core.Interfaces;

public interface IBookingRepository
{
    Task AddBooking(Booking booking);
    Task<Booking?>GetBookingWithDetailsByPNR(long PNR);
    Task<IEnumerable<Booking>> GetAllBookings();
}