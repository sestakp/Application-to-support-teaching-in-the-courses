import { GetterTree } from 'vuex';
import CourseState from './courseState/courseStateInterface';
import createGetters from '../getters';
import Course from '@/models/Course/Course';


const courseGetters: GetterTree<CourseState, any> = {
    ...createGetters<Course, CourseState>('courses', 'id')
}

export default courseGetters;
