package fit.vutbr.cz.gja.bl.models;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.JsonToken;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import fit.vutbr.cz.gja.dal.entities.Course;
import fit.vutbr.cz.gja.dal.entities.Team;
import org.springframework.data.jpa.domain.AbstractPersistable;

import java.io.IOException;
import java.util.Collection;
import java.util.Date;
import java.util.stream.Collectors;

/**
 * Team model for client
 * @author Pavel Šesták (xsesta07)
 * @since 08.01.2024
 */
public class TeamModel {
    
    private long id;
    private long activityId;
    private String name;
    private Collection<Long> studentIds;

    public TeamModel(){}
    
    public TeamModel(Team team) {
        id = team.getId();
        activityId = team.getActivityId();
        name = team.getName();
        studentIds = team.getMembers().stream()
            .map(AbstractPersistable::getId)
            .toList();
    }
    
    public long getId(){
        return this.id;
    }
    
    public void setId(long id){
        this.id = id;
    }
    
    public long getActivityId(){
        return this.activityId;
    }
    
    public void setActivityId(long activityId){
        this.activityId = activityId;
    }
    
    public String getName(){
        return this.name;
    }
    
    public void setName(String name){
        this.name = name;
    }
    
    public Collection<Long> getStudentIds(){
        return this.studentIds;
    }
    
    public void setStudentIds(Collection<Long> studentIds){
        this.studentIds = studentIds;
    }

    /**
     * Team model JSON deserializer
     */
    static class TeamModelDeserializer extends JsonDeserializer<TeamModel> {
        @Override
        public TeamModel deserialize(JsonParser jsonParser, DeserializationContext deserializationContext)
            throws IOException, JsonProcessingException {
            TeamModel teamModel = new TeamModel();
            while (jsonParser.nextToken() != JsonToken.END_OBJECT) {
                String fieldName = jsonParser.getCurrentName();

                switch (fieldName) {
                    case "id":
                        jsonParser.nextToken();
                        teamModel.setId(jsonParser.getLongValue());
                        break;
                    case "activityId":
                        jsonParser.nextToken();
                        teamModel.setActivityId(jsonParser.getLongValue());
                        break;
                    case "name":
                        jsonParser.nextToken();
                        teamModel.setName(jsonParser.getText());
                        break;
                    case "studentIds":
                        jsonParser.nextToken(); // Move to the start of the array
                        while (jsonParser.nextToken() != JsonToken.END_ARRAY) {
                            teamModel.getStudentIds().add(jsonParser.getLongValue());
                        }
                        break;
                }
            }
            return teamModel;
        }
    }
}
