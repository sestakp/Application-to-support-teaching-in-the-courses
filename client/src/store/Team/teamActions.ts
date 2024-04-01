import { ActionTree,ActionContext } from 'vuex';
import createActions from '../actions';
import TeamState from './teamState/teamStateInterface';
import Team from '@/models/Team/Team';
import TeamApi from '@/api/Team/TeamApi';
import TeamFaker from '@/fakerApi/teamFaker';
import teamMutationTypes from './teamMutationTypes';
import Student from '@/models/Student/Student';

const teamActions: ActionTree<TeamState, any> = {
    // Define your specific actions for the Course model
    async fetchStudentTeams(context: ActionContext<TeamState, any>, students: Student[]) {
        
        const items = await (process.env.VUE_APP_API_URL !== undefined ? TeamApi.readStudentTeams(students) : TeamFaker.readStudentTeams(students));
        context.commit(teamMutationTypes.SET_ITEMS, items);
    },

    async fetchCourseTeams(context: ActionContext<TeamState, any>, courseId: number) {
        const currentUser = context.rootGetters.getCurrentUser();
        if(currentUser){
            const items = await (process.env.VUE_APP_API_URL !== undefined ? TeamApi.readCourseTeams(courseId, currentUser.token) : [] as Team[]);
            context.commit(teamMutationTypes.SET_ITEMS, items);
            return items;
        }
        return null;
    },
    // Extend the existing actions with specific modifications
    ...createActions<Team, TeamState>(TeamApi, TeamFaker, teamMutationTypes),
};

export default teamActions;
