package fit.vutbr.cz.gja;

import fit.vutbr.cz.gja.dal.entities.Course;
import fit.vutbr.cz.gja.dal.entities.Student;
import fit.vutbr.cz.gja.dal.entities.User;
import fit.vutbr.cz.gja.dal.entities.Course;
import fit.vutbr.cz.gja.dal.entities.Type;
import fit.vutbr.cz.gja.dal.repositories.CourseRepository;
import fit.vutbr.cz.gja.dal.repositories.StudentRepository;
import fit.vutbr.cz.gja.dal.repositories.UserRepository;

import fit.vutbr.cz.gja.dal.repositories.TypeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import java.util.NoSuchElementException;
import java.util.Optional;

/**
 * Service for managing assessments
 * @author Daniel Peřina (xperin12)
 * @author Pavel Šesták (xsesta07)
 * @author Martin Kmenta (xkment06)
 * @since 23.12.2023
 */
@SpringBootApplication(scanBasePackages = "fit.vutbr.cz.gja")
@EnableTransactionManagement
public class Application {

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}

	@Bean
	CommandLineRunner runner1() {
		return args -> {
			System.out.println("----------------------------------------------------");
			System.out.println("----------------------RUNNING-----------------------");
			System.out.println("----------------------------------------------------");
		};
	}
}
