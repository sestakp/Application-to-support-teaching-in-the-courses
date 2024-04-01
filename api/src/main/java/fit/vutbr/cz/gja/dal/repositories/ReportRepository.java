package fit.vutbr.cz.gja.dal.repositories;

import fit.vutbr.cz.gja.dal.entities.Report;
import org.springframework.data.repository.CrudRepository;

import java.util.Collection;

/**
 * Report CRUD repository
 * @author Daniel Peřina (xperin12)
 * @since 23.12.2023
 */
public interface ReportRepository extends CrudRepository<Report, Long> {
    /**
     * Find reports in tasks
     * @param ids Task ids
     * @return All reports in given tasks
     */
    Iterable<Report> findAllByTaskIdIn(Collection<Long> ids);
}
