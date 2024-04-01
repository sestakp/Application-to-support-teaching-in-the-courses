package fit.vutbr.cz.gja.pl.controller;

import fit.vutbr.cz.gja.bl.models.EmailModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import fit.vutbr.cz.gja.bl.service.SendEmailService;

/**
 * Email sender REST API
 * @author Vojtěch Kulíšek (xkulis03)
 * @author Pavel Šesták (xsesta07)
 * @since 27.12.2023
 */
@RestController
@RequestMapping("/api/mail")
public class SendEmailController {

    private final SendEmailService _service;

    public SendEmailController(SendEmailService _service) {
        this._service = _service;
    }

    /**
     * Send email
     * @param mail Email
     */
    @PostMapping
    public void getAll(@RequestBody EmailModel mail) {
        _service.sendMessage(mail.getFrom(), mail.getTo(), mail.getSubject(),mail.getText());
    }
}
