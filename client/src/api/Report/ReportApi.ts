import Report from '@/models/Report/Report';
import ApiWrapper from '../ApiWrapper';
import axios from 'axios';
import logger from '@/utils/loggerUtil';
import { handleAuthorizationFailed, handlePageNotFound } from '@/utils/navigationUtil';

class ReportApi extends ApiWrapper<Report> {
  constructor() {
    super(process.env.VUE_APP_API_URL + '/api/reports'); // Replace with your API endpoint for todos
  }

  async fetchActivityReports(activityId: number, token:string){    
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

export default new ReportApi();