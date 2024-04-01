import { ActionTree } from 'vuex';
import Course from '@/models/Course/Course';
import CourseApi from '@/api/Course/CourseApi';
import CourseFaker from '@/fakerApi/courseFaker';
import CourseState from './courseState/courseStateInterface';
import createActions from '../actions';
import courseMutationTypes from './courseMutationTypes';


const courseActions: ActionTree<CourseState, any> = {
    // Define your specific actions for the Course model

    // Extend the existing actions with specific modifications
    ...createActions<Course, CourseState>(CourseApi, CourseFaker, courseMutationTypes),
};

export default courseActions;
