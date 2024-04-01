import Team from '@/models/Team/Team';
import ApiWrapper from '../ApiWrapper';
import Student from '@/models/Student/Student';
import axios from 'axios';
import { handleAuthorizationFailed, handlePageNotFound } from '@/utils/navigationUtil';
import logger from '@/utils/loggerUtil';

class TeamApi extends ApiWrapper<Team> {
  constructor() {
    super(process.env.VUE_APP_API_URL + '/api/teams'); // Replace with your API endpoint for todos
  }

  async readStudentTeams(students: Student[]): Promise<Team[] | undefined> {
    // TODO
    
    throw new Error("Not implemented");
    return undefined;
  }

  async readCourseTeams(courseId: number, token:string): Promise<Team[] | undefined> {
    try {   
      const response = await axios.get(`${this.baseUrl}/course/`+courseId, this.getConfig(token));
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
      
        logger.fatal("TeamAPI: ", error)
        throw error;
    }
  }
}

export default new TeamApi();