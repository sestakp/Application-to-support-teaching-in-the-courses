package fit.vutbr.cz.gja.dal.repositories;

import fit.vutbr.cz.gja.dal.entities.Activity;
import fit.vutbr.cz.gja.dal.entities.Assessment;
import org.springframework.data.repository.CrudRepository;

import java.util.Collection;
import java.util.Optional;

/**
 * Assessment CRUD repository
 * @author Daniel Peřina (xperin12)
 * @author Pavel Šesták (xsesta07)
 * @since 23.12.2023
 */
public interface AssessmentRepository extends CrudRepository<Assessment, Long> {
    /**
     * Find all assessments by criterion ids
     * @param ids Criterion ids
     * @return Assessments containing given criterions
     */
    Iterable<Assessment> findAllByCriterionIdIn(Collection<Long> ids);

    /**
     * Find assessment by criterion, student and team
     * @param criterionId Criterion
     * @param studentId Student
     * @param teamId Team
     * @return Given student or teams and criterion assessment
     */
    Optional<Assessment> findByCriterionIdIsAndStudentIdIsAndTeamIdIs(Long criterionId, Long studentId, Long teamId);
    
    
}
