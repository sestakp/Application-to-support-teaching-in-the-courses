import { ActionTree, ActionContext } from 'vuex';
import createActions from '../actions';
import Student from '@/models/Student/Student';
import StudentState from './studentState/studentStateInterface';
import StudentApi from '@/api/Student/StudentApi';
import StudentFaker from '@/fakerApi/studentFaker';
import studentMutationTypes from './studentMutationTypes';
import Course from '@/models/Course/Course';

const studentActions: ActionTree<StudentState, any> = {
    // Define your specific actions for the Course model
    async fetchCourseStudents(context: ActionContext<StudentState, any>, course: Course) {
        const currentUser = context.rootGetters.getCurrentUser();
        if(currentUser){
            const items = await (process.env.VUE_APP_API_URL !== undefined ? StudentApi.readCourseStudents(course, currentUser.token) : StudentFaker.readCourseStudents(course));
            context.commit(studentMutationTypes.SET_ITEMS, items);
        }
    },
    // Extend the existing actions with specific modifications
    ...createActions<Student, StudentState>(StudentApi, StudentFaker, studentMutationTypes),
};

export default studentActions;
