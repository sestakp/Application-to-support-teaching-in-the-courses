import { GetterTree } from 'vuex';
import createGetters from '../getters';
import StudentState from './studentState/studentStateInterface';
import Student from '@/models/Student/Student';


const studentGetters: GetterTree<StudentState, any> = {
    ...createGetters<Student, StudentState>('students', 'id')
}

export default studentGetters;
