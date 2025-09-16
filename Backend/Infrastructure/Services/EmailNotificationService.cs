using Application.Common.Interfaces;
using Application.DTOs.BookingDTOs;
using Core.Entities;

namespace Infrastructure.Services;

public class EmailNotificationService(IEmailService emailService) : IEmailNotificationService
{
    public async Task SendBookingConfirmationAsync(PassengerBookingInfoDTO bookingInfo, Booking completeBooking)
    {

        // ✅ Send booking confirmation email
        string subject = $"Booking Confirmation - PNR {bookingInfo.PNR}";
        bool hasWaiting = bookingInfo.Passengers.Any(p => p.BookingStatus == "WAITING" || p.BookingStatus == "RAC");

        string body = $"""
            <html>
            <body style="font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; padding:20px;">
            <div style="max-width:600px; margin:0 auto; background:#fff; padding:20px; border-radius:10px; box-shadow:0 2px 8px rgba(0,0,0,0.1);">
                <h2 style="color:#2E86C1; text-align:center;">🎉 Check Booking Details!</h2>

                <p>Dear <strong>{completeBooking.User.FullName}</strong>,</p>
                <p>Your train booking has been successfully processed. Below are your journey details:</p>

                <table style="width:100%; border-collapse:collapse; margin:20px 0;">
                    <tr><td style="padding:8px; border:1px solid #ddd;"><strong>PNR</strong></td><td style="padding:8px; border:1px solid #ddd;">{bookingInfo.PNR}</td></tr>
                    <tr><td style="padding:8px; border:1px solid #ddd;"><strong>Train</strong></td><td style="padding:8px; border:1px solid #ddd;">{bookingInfo.TrainName}</td></tr>
                    <tr><td style="padding:8px; border:1px solid #ddd;"><strong>From</strong></td><td style="padding:8px; border:1px solid #ddd;">{bookingInfo.FromStation}</td></tr>
                    <tr><td style="padding:8px; border:1px solid #ddd;"><strong>To</strong></td><td style="padding:8px; border:1px solid #ddd;">{bookingInfo.ToStation}</td></tr>
                    <tr><td style="padding:8px; border:1px solid #ddd;"><strong>Journey Date</strong></td><td style="padding:8px; border:1px solid #ddd;">{bookingInfo.JourneyDate:dd MMM yyyy}</td></tr>
                    <tr><td style="padding:8px; border:1px solid #ddd;"><strong>Total Fare</strong></td><td style="padding:8px; border:1px solid #ddd;">₹{bookingInfo.TotalFare}</td></tr>
                </table>

                <h3 style="color:#2E86C1;">👥 Passenger Details</h3>
                <table style="width:100%; border-collapse:collapse; margin:10px 0;">
                    <tr style="background:#f2f2f2;">
                        <th style="padding:8px; border:1px solid #ddd; text-align:left;">Name</th>
                        <th style="padding:8px; border:1px solid #ddd; text-align:left;">Age</th>
                        <th style="padding:8px; border:1px solid #ddd; text-align:left;">Gender</th>
                        <th style="padding:8px; border:1px solid #ddd; text-align:left;">Seat</th>
                        <th style="padding:8px; border:1px solid #ddd; text-align:left;">Status</th>
                    </tr>
                    {string.Join("", bookingInfo.Passengers.Select(p => $"""
                        <tr>
                            <td style="padding:8px; border:1px solid #ddd;">{p.Name}</td>
                            <td style="padding:8px; border:1px solid #ddd;">{p.Age}</td>
                            <td style="padding:8px; border:1px solid #ddd;">{p.Gender}</td>
                            <td style="padding:8px; border:1px solid #ddd;">{p.SeatNumber}</td>
                            <td style="padding:8px; border:1px solid #ddd; color:{(p.BookingStatus == "CONFIRMED" ? "green" : "red")}; font-weight:bold;">
                                {p.BookingStatus}
                            </td>
                        </tr>
                    """))}
                </table>

                {(hasWaiting ? "<p style='color:#C0392B; font-weight:bold; margin-top:15px;'>⚠️ You will be informed by email if waiting passengers get confirmed seats.</p>" : "")}

                <p style="margin-top:20px;">Please carry a valid ID proof while traveling.</p>
                <p style="margin-top:5px;">Wishing you a pleasant journey!</p>

                <br />
                <p>Regards,</p>
                <p><strong>Reservation Team</strong></p>
                </div>
            </body>
            </html>
        """;


        var toEmail = completeBooking.User?.Email;
        if (string.IsNullOrWhiteSpace(toEmail))
        {
            return; // No recipient; skip sending
        }
        await emailService.SendEmailAsync(toEmail, subject, body);
    }
    public async Task SendBookingCancellationAsync(Booking booking, List<Passenger> cancelledPassengers, decimal refundAmount)
    {
        var passengerRows = string.Join
        ("", cancelledPassengers.Select(p => $@"
                <tr>
                    <td style='padding:8px;border:1px solid #ddd'>{p.Name}</td>
                    <td style='padding:8px;border:1px solid #ddd'>{p.Age}</td>
                    <td style='padding:8px;border:1px solid #ddd'>{p.Gender}</td>
                    <td style='padding:8px;border:1px solid #ddd'>{p.Status}</td>
                </tr>"
        ));

        var htmlMessage = $@"
    <html>
        <body style='font-family:Arial, sans-serif;line-height:1.6;color:#333'>
            <div style='max-width:600px;margin:auto;padding:20px;border:1px solid #eee;border-radius:10px;box-shadow:0 2px 5px rgba(0,0,0,0.1)'>
                <h2 style='text-align:center;color:#d9534f'>Booking Cancellation Confirmation</h2>
                <p>Hello <strong>{booking.User?.FullName ?? "Customer"}</strong>,</p>
                <p>Your booking with <strong>PNR: {booking.PNR}</strong> has been cancelled for the following passengers:</p>
                
                <table style='width:100%;border-collapse:collapse;margin-top:15px'>
                    <thead>
                        <tr style='background-color:#f2f2f2'>
                            <th style='padding:8px;border:1px solid #ddd'>Name</th>
                            <th style='padding:8px;border:1px solid #ddd'>Age</th>
                            <th style='padding:8px;border:1px solid #ddd'>Gender</th>
                            <th style='padding:8px;border:1px solid #ddd'>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {passengerRows}
                    </tbody>
                </table>

                <p style='margin-top:20px'>
                    <strong>Total Refund Amount:</strong> ₹{refundAmount}
                </p>
                <p style='color:#d9534f'><em>Note: Refund will be processed within 5-7 working days.</em></p>
                
                <p>Thank you for using our service.</p>
                <p style='margin-top:20px;font-size:12px;color:#777;text-align:center'>
                    This is an automated message. Please do not reply.
                </p>
            </div>
        </body>
    </html>";
        var cancelToEmail = booking.User?.Email;
        if (!string.IsNullOrWhiteSpace(cancelToEmail))
        {
            await emailService.SendEmailAsync(
                cancelToEmail,
                "Booking Cancellation Confirmation",
                htmlMessage
            );
        }
    }
    public async Task SendWaitlistPromotionEmailAsync(Passenger passenger)
    {
        var booking = passenger.Booking;
        var train = booking.Train;

        string subject = $"🎉 Your Waitlisted Ticket is Now Confirmed - {train.TrainName}";
        string body = $@"
        <html>
        <body style='font-family: Arial, sans-serif;'>
            <h2 style='color: green;'>Good News {passenger.Name}!</h2>
            <p>Your waitlisted ticket has just been <b>confirmed</b> 🎟️</p>
            <h3>Booking Details:</h3>
            <ul>
                <li><b>Train:</b> {train.TrainName} ({train.TrainNumber})</li>
                <li><b>From:</b> {booking.FromStation.StationName}</li>
                <li><b>To:</b> {booking.ToStation.StationName}</li>
                <li><b>Date:</b> {booking.JourneyDate:dd-MMM-yyyy}</li>
                <li><b>Coach:</b> {passenger.CoachClass}</li>
                <li><b>Seat:</b> {passenger.Seat?.SeatNumber}</li>
                <li><b>Status:</b> Confirmed ✅</li>
            </ul>
            <p>Please carry a valid ID proof while travelling.</p>
            <p style='margin-top:20px;'>Thank you for choosing <b>Our Railway</b>. Have a safe journey 🚆</p>
        </body>
        </html>";

        var promoToEmail = booking.User?.Email;
        if (!string.IsNullOrWhiteSpace(promoToEmail))
        {
            await emailService.SendEmailAsync(promoToEmail, subject, body);
        }
    }

}