import Student from '@/models/Student/Student';
import ApiWrapper from '../ApiWrapper';
import Course from '@/models/Course/Course';
import axios from 'axios';
import logger from '@/utils/loggerUtil';
import { handleAuthorizationFailed, handlePageNotFound } from '@/utils/navigationUtil';

class StudentApi extends ApiWrapper<Student> {
  constructor() {
    super(process.env.VUE_APP_API_URL + '/api/students'); // Replace with your API endpoint for todos
  }

  async readCourseStudents(course: Course, token:string): Promise<Student[] | undefined> {
    try {   
      const response = await axios.get(`${this.baseUrl}/course/`+course.id, this.getConfig(token));
      return response.data;
    } catch (error) {
        if(axios.isAxiosError(error)){
            if (error.response && error.response.status === 404) {
              handlePageNotFound()
            }
            else if(error.response && error.response.status === 403){
              handleAuthorizationFailed()
            }
        }
      
        logger.fatal("AssessmentAPI: ", error)
        throw error;
    }
}
}

export default new StudentApi();