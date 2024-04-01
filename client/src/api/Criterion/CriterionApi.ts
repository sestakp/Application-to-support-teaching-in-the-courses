import Criterion from '@/models/Criterion/Criterion';
import ApiWrapper from '../ApiWrapper';
import axios from 'axios';
import logger from '@/utils/loggerUtil';
import { handleAuthorizationFailed, handlePageNotFound } from '@/utils/navigationUtil';

class CriterionApi extends ApiWrapper<Criterion> {
  constructor() {
    super(process.env.VUE_APP_API_URL + '/api/criteria'); // Replace with your API endpoint for todos
  }

  async readActivityCriteria(activityId: number, token:string): Promise<Criterion[] | undefined> {
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

export default new CriterionApi();