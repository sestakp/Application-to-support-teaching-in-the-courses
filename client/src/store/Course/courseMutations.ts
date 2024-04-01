// courseMutations.ts (specific to the Course module)
import Course from '@/models/Course/Course';
import createMutations from '../mutations';
import CourseState from './courseState/courseStateInterface';
import courseMutationTypes from './courseMutationTypes';


const courseMutations = createMutations<Course, CourseState>(courseMutationTypes);

export default courseMutations;
