package fit.vutbr.cz.gja.bl.models;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.JsonToken;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import fit.vutbr.cz.gja.dal.entities.User;
import org.springframework.data.jpa.domain.AbstractPersistable;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

/**
 * User model for client
 * @author Daniel Peřina (xperin12)
 * @author Pavel Šesták (xsesta07)
 * @since 06.01.2023
 */
@JsonSerialize(using = UserModel.UserModelSerializer.class)
@JsonDeserialize(using = UserModel.UserModelDeserializer.class)
public class UserModel {
    
    private long id;
    private String email;
    private String name;
    private Date registrationDate;
    private List<Long> privilegedCourses = new ArrayList<>();
    
    public long getId(){
        return this.id;
    }
    
    public String getEmail(){
        return this.email;
    }
    
    public String getName(){
        return this.name;
    }
    
    public void setId(long id){
        this.id = id;
    }
    
    public void setEmail(String email){
        this.email = email;
    }
    
    public void setName(String name){
        this.name = name;
    }
    
    public void setRegistrationDate(Date date){
        this.registrationDate = date;
    }
    
    public Date getRegistrationDate(){
        return this.registrationDate;
    }
    
    public List<Long> getPrivilegedCourses(){
        return this.privilegedCourses;
    }
    
    public UserModel(User user) {
        id = user.getId();
        email = user.getEmail();
        name = user.getName();
        registrationDate = user.getRegistrationDate();
        privilegedCourses = user.getAccessedCourses().stream()
            .map(AbstractPersistable::getId)
            .collect(Collectors.toList());
    }
    
    public UserModel(){
    }

    /**
     * User model JSON deserializer
     */
    static class UserModelDeserializer extends JsonDeserializer<UserModel> {
        @Override
        public UserModel deserialize(JsonParser jsonParser, DeserializationContext deserializationContext)
            throws IOException, JsonProcessingException {
            UserModel userModel = new UserModel();
            while (jsonParser.nextToken() != JsonToken.END_OBJECT) {
                String fieldName = jsonParser.getCurrentName();

                switch (fieldName) {
                    case "id":
                        jsonParser.nextToken();
                        userModel.setId(jsonParser.getLongValue());
                        break;
                    case "email":
                        jsonParser.nextToken();
                        userModel.setEmail(jsonParser.getText());
                        break;
                    case "name":
                        jsonParser.nextToken();
                        userModel.setName(jsonParser.getText());
                        break;
                    case "registrationDate":
                        jsonParser.nextToken();
                        userModel.setRegistrationDate(jsonParser.readValueAs(Date.class));
                        break;
                    case "privilegedCourses":
                        jsonParser.nextToken(); // Move to the start of the array
                        while (jsonParser.nextToken() != JsonToken.END_ARRAY) {
                            userModel.getPrivilegedCourses().add(jsonParser.getLongValue());
                        }
                        break;
                }
            }

            return userModel;
        }
    }

    /**
     * User model JSON serializer
     */
    static class UserModelSerializer extends JsonSerializer<UserModel> {
        @Override
        public void serialize(UserModel userModel, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {
            jsonGenerator.writeStartObject();
            jsonGenerator.writeNumberField("id", userModel.getId());
            jsonGenerator.writeStringField("email", userModel.getEmail());
            jsonGenerator.writeStringField("name", userModel.getName());
            jsonGenerator.writeObjectField("registrationDate", userModel.getRegistrationDate());
            jsonGenerator.writeFieldName("privilegedCourses");
            jsonGenerator.writeStartArray();
            for (Long courseId : userModel.getPrivilegedCourses()) {
                jsonGenerator.writeNumber(courseId);
            }
            jsonGenerator.writeEndArray();
            jsonGenerator.writeEndObject();
        }
    }
}
