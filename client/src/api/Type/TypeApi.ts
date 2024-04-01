import Type from '@/models/Type/Type';
import ApiWrapper from '../ApiWrapper';
import axios from 'axios';
import logger from '@/utils/loggerUtil';
import { handleAuthorizationFailed, handlePageNotFound } from '@/utils/navigationUtil';

class TypeApi extends ApiWrapper<Type> {
  constructor() {
    super(process.env.VUE_APP_API_URL + '/api/types'); // Replace with your API endpoint for todos
  }

  
  async readCourseTypes(courseId: number, token:string): Promise<Type[] | undefined> {
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
      
        logger.fatal("TypeAPI: ", error)
        throw error;
    }
}
}

export default new TypeApi();