import Activity from '@/models/Activity/Activity';
import ApiWrapper from '../ApiWrapper';

import logger from '@/utils/loggerUtil';
import axios from 'axios';
import { handleAuthorizationFailed, handlePageNotFound } from '@/utils/navigationUtil';

class ActivityApi extends ApiWrapper<Activity> {
    constructor() {
        super(process.env.VUE_APP_API_URL + '/api/activities');
    }

    async readCourseActivities(courseId: number, token: string): Promise<Activity[] | undefined> {
        try {
            const response = await axios.get(`${this.baseUrl}/course/${courseId}`, this.getConfig(token));
            return response.data;
        } 
        catch (error) {
            if(axios.isAxiosError(error)){
                if (error.response && error.response.status === 404) {
                    handlePageNotFound()
                }
                else if(error.response && error.response.status === 403){
                    handleAuthorizationFailed()
                }
            }
        
            logger.fatal("ApiWrapper: ", error)
            throw error;
        }
    }
}

export default new ActivityApi();
