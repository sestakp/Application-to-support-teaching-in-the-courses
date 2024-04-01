import { ActionTree, Commit, ActionContext } from 'vuex';
import Course from '@/models/Course/Course';
import createActions from '../actions';
import TaskState from './taskState/taskStateInterface';
import TaskApi from '@/api/Task/TaskApi';
import TaskFaker from '@/fakerApi/taskFaker';
import taskMutationTypes from './taskMutationTypes';
import Task from '@/models/Task/Task';

const taskActions: ActionTree<TaskState, any> = {
    // Define your specific actions for the Course model

    async fetchCourseTasks(context: ActionContext<TaskState, any>, courseId: number) {
        const currentUser = context.rootGetters.getCurrentUser();
        if(currentUser){
            const items = await (process.env.VUE_APP_API_URL !== undefined ? TaskApi.readCourseTasks(courseId, currentUser.token) : TaskFaker.readCourseTasks(courseId));
            context.commit(taskMutationTypes.SET_ITEMS, items);
        }
    },

    // Extend the existing actions with specific modifications
    ...createActions<Task, TaskState>(TaskApi, TaskFaker, taskMutationTypes),
};

export default taskActions;
