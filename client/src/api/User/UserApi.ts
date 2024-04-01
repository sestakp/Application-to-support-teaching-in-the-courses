import User from '@/models/User/User';
import UserLogin from '@/models/User/UserLogin';
import UserRegister from '@/models/User/UserRegister';
import ApiWrapper from '../ApiWrapper';
import Course from '@/models/Course/Course';
import logger from '@/utils/loggerUtil';
import axios from 'axios';
import { handleAuthorizationFailed, handlePageNotFound } from '@/utils/navigationUtil';

class UserApi extends ApiWrapper<User> {
    constructor() {
        super(process.env.VUE_APP_API_URL + '/api/users');
    }

    async login(login: UserLogin): Promise<User | undefined> {
        
        try {
            console.log("process env: ", process.env)
            const response = await axios.post(`${process.env.VUE_APP_API_URL + '/api/users/login'}`, login);
            return response.data;
        } catch (error) {
            logger.fatal("UserApi: ", error)
            throw error;
        }
    }


    async register(register: UserRegister): Promise<boolean | undefined> {
        try {
            const response = await axios.post(`${process.env.VUE_APP_API_URL + '/api/users/register'}`, register);
            return response.data;
        } catch (error) {
            logger.fatal("UserApi: ", error)
            throw error;
        }
    }

    async readCourseUsers(course: Course, token:string): Promise<User[] | undefined> {
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
            
              logger.fatal("UserAPI: ", error)
              throw error;
          }
    }
}

export default new UserApi();
