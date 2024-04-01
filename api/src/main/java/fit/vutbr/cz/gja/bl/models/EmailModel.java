package fit.vutbr.cz.gja.bl.models;

/**
 * Email message model
 * @author Pavel Šesták (xsesta07)
 * @since 09.01.2024
 */
public class EmailModel {
    private String from;
    private String subject;
    private String text;
    private String to;
    
    public String getFrom(){
        return this.from;
    }
    
    public String getSubject(){
        return this.subject;
    }
    
    public String getText(){
        return this.text;
    }
    
    public String getTo(){
        return this.to;
    }
}
