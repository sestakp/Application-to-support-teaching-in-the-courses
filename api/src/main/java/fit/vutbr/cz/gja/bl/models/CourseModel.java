package fit.vutbr.cz.gja.bl.models;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import fit.vutbr.cz.gja.dal.entities.Course;
import org.springframework.data.jpa.domain.AbstractPersistable;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Course model for client
 * @author Daniel Peřina (xperin12)
 * @author Pavel Šesták (xsesta07)
 * @since 07.01.2024
 */
public class CourseModel {
    private long id;
    private String name;
    private String abbrevation;
    private int year;
    private long guarantorId;
    private List<Long> students;

    public long getId() {
        return id;
    }
    public String getName() {
        return name;
    }
    public String getAbbrevation() {
        return abbrevation;
    }
    public int getYear() {
        return year;
    }
    public long getGuarantorId() {
        return guarantorId;
    }
    public List<Long> getStudents() {
        return students;
    }
    
    public CourseModel(Course course) {
        id = course.getId();
        name = course.getName();
        abbrevation = course.getAbbrevation();
        year = course.getYear();
        guarantorId = course.getGuarantorId();
        students = course.getStudents().stream()
            .map(AbstractPersistable::getId)
            .toList();
    }

    /**
     * Course model JSON serializer
     */
    static class CourseModelSerializer extends JsonSerializer<CourseModel> {

        @Override
        public void serialize(CourseModel courseModel, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {
            jsonGenerator.writeStartObject();
            jsonGenerator.writeNumberField("id", courseModel.getId());
            jsonGenerator.writeStringField("name", courseModel.getName());
            jsonGenerator.writeStringField("abbrevation", courseModel.getAbbrevation());
            jsonGenerator.writeNumberField("year", courseModel.getYear());
            jsonGenerator.writeNumberField("guarantorId", courseModel.getGuarantorId());
            jsonGenerator.writeFieldName("students");
            for (long studentId: courseModel.getStudents()) {
                jsonGenerator.writeNumber(studentId);
            }
            jsonGenerator.writeEndArray();
            jsonGenerator.writeEndObject();
        }
    }
}
