import createMutations from '../mutations';
import TaskState from './taskState/taskStateInterface';
import taskMutationTypes from './taskMutationTypes';
import Task from '@/models/Task/Task';


const taskMutations = createMutations<Task, TaskState>(taskMutationTypes);

export default taskMutations;
