using Application.DTOs.BookingDTOs;
using Core.Entities;

namespace Application.Common.Interfaces;

public interface IEmailNotificationService
{
      Task SendBookingConfirmationAsync(PassengerBookingInfoDTO bookingInfo,Booking completeBooking);
      Task SendBookingCancellationAsync(Booking booking, List<Passenger> cancelledPassengers,decimal refundAmount);
      Task SendWaitlistPromotionEmailAsync(Passenger passenger);
}