package fit.vutbr.cz.gja.bl.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;

import org.springframework.beans.factory.annotation.Autowired;

/**
 * Service for sending emails
 * @author Daniel Peřina (xperin12)
 * @author Pavel Šesták (xsesta07)
 * @since 27.12.2023
 */
@Service("EmailService")
public class SendEmailService {

    private final JavaMailSender emailSender;

    public SendEmailService(JavaMailSender emailSender) {
        this.emailSender = emailSender;
    }

    /**
     * Sends a simple text email.
     * @param from    The sender's email address.
     * @param to      The recipient's email address.
     * @param subject The subject of the email.
     * @param text    The text content of the email.
     */
    public void sendMessage(String from, String to, String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(from);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);

            emailSender.send(message);
            
        } catch (MailException exception){
            exception.printStackTrace();
        }
    }
}
