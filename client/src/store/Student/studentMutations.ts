import createMutations from '../mutations';
import Student from '@/models/Student/Student';
import StudentState from './studentState/studentStateInterface';
import studentMutationTypes from './studentMutationTypes';


const studentMutations = createMutations<Student, StudentState>(studentMutationTypes);

export default studentMutations;
