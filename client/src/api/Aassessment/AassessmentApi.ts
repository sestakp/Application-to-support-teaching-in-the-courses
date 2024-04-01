import Aassessment from '@/models/Aassessment/Aassessment';
import ApiWrapper from '../ApiWrapper';
import axios from 'axios';
import logger from '@/utils/loggerUtil';
import { handleAuthorizationFailed, handlePageNotFound } from '@/utils/navigationUtil';

class AassessmentApi extends ApiWrapper<Aassessment> {
  constructor() {
    super(process.env.VUE_APP_API_URL + '/api/assessments'); // Replace with your API endpoint for todos
  }


  async readAassessmentsByTask(taskId: number, token:string): Promise<Aassessment[] | undefined> {

    try {   
      const response = await axios.get(`${this.baseUrl}/task/`+taskId, this.getConfig(token));
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

  async readAassessmentsByActivity(activityId: number, token:string): Promise<Aassessment[] | undefined> {
    try {   
      const response = await axios.get(`${this.baseUrl}/activity/`+activityId, this.getConfig(token));
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

export default new AassessmentApi();