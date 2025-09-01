using System.Net.Mail;
using Application.Common.Interfaces;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using MimeKit;
using MailKit.Net.Smtp;
using SmtpClient = MailKit.Net.Smtp.SmtpClient;


namespace Infrastructure.Services;

public class EmailService(IConfiguration configuration):IEmailService
{
    public async Task SendEmailAsync(string toEmail, string subject, string body)
    {
        try
        {
            var fromEmail = configuration["EmailSettings:FromEmail"];
            var password = configuration["EmailSettings:Password"];
            var smtpHost = configuration["EmailSettings:SmtpHost"];
            var smtpPort = int.Parse(configuration["EmailSettings:SmtpPort"]!);

            var email = new MimeMessage();
            email.From.Add(MailboxAddress.Parse(fromEmail));
            email.To.Add(MailboxAddress.Parse(toEmail));
            email.Subject = subject;
            email.Body = new TextPart("html") { Text = body };

            using var smtp = new SmtpClient();
            await smtp.ConnectAsync(smtpHost, smtpPort, SecureSocketOptions.StartTls);
            await smtp.AuthenticateAsync(fromEmail, password);
            await smtp.SendAsync(email);
            await smtp.DisconnectAsync(true);

        }
        catch (Exception ex)
        {
            throw new ApplicationException("Email sending failed.", ex);
        }
    }
}