import Task from '@/models/Task/Task';
import ApiWrapper from '../ApiWrapper';
import axios from 'axios';
import logger from '@/utils/loggerUtil';
import { handleAuthorizationFailed, handlePageNotFound } from '@/utils/navigationUtil';

class TaskApi extends ApiWrapper<Task> {
  constructor() {
    super(process.env.VUE_APP_API_URL + '/api/tasks'); // Replace with your API endpoint for todos
  }

  
  async readCourseTasks(courseId: number, token:string): Promise<Task[] | undefined> {
    
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
      
        logger.fatal("AssessmentAPI: ", error)
        throw error;
    }
  }
}

export default new TaskApi();