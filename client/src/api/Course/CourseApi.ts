import Course from '@/models/Course/Course';
import ApiWrapper from '../ApiWrapper';

class CourseApi extends ApiWrapper<Course> {
  constructor() {
    super(process.env.VUE_APP_API_URL + '/api/courses'); // Replace with your API endpoint for todos
  }
}

export default new CourseApi();