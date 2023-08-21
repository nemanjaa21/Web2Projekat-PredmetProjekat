using MailKit.Security;
using MimeKit;
using Online_Shop.Interfaces.ServiceInterfaces;
using Org.BouncyCastle.Asn1.Pkcs;
using System.Runtime;
using MailKit.Net.Smtp;

namespace Online_Shop.Service
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration; 
        }
        public async Task SendEmail(string email, string verification)
        {
            string text = $"Your verification request for Online Shop is {verification}";
            var mail = new MimeMessage
            {
                Subject = "Verification",
                Body = new TextPart(MimeKit.Text.TextFormat.Plain) { Text = text }
            };


            mail.From.Add(new MailboxAddress(_configuration["MailSettings:DisplayName"], _configuration["MailSettings:From"]));
            mail.To.Add(MailboxAddress.Parse(email));

            SmtpClient smtp = new SmtpClient();
            await smtp.ConnectAsync(_configuration["MailSettings:Host"], int.Parse(_configuration["MailSettings:Port"]!), SecureSocketOptions.Auto);
            string s = _configuration["MailSettings:From"] + " " + _configuration["MailSettings:Password"];
            await smtp.AuthenticateAsync(_configuration["MailSettings:From"], _configuration["MailSettings:Password"]);
            await smtp.SendAsync(mail);
            await smtp.DisconnectAsync(true);
        }
    }
}
