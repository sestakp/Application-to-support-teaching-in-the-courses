import { GetterTree } from 'vuex';
import createGetters from '../getters';
import TaskState from './taskState/taskStateInterface';
import Task from '@/models/Task/Task';


const taskGetters: GetterTree<TaskState, any> = {
    ...createGetters<Task, TaskState>('tasks', 'id')
}

export default taskGetters;
