import { createStore } from 'vuex'
import courseModule from './Course/courseModule'
import userModule from './User/userModule'
import activityModule from './Activity/activityModule'
import criterionModule from './Criterion/criterionModule';
import taskModule from './Task/taskModule';
import typeModule from './Type/typeModule';
import { RootState } from './rootState';
import studentModule from './Student/studentModule';
import teamModule from './Team/teamModule';
import aassessmentModule from './Aassessment/aassessmentModule';
import reportModule from './Report/reportModule';


export default createStore<RootState>({
    getters: {
        getCourseById: (state) => (courseId:number) => state.course.data.find(c => c.id == courseId),
        
        getCurrentUser: (state) => () => {
            return state.user.currentUser;
        },
    },
    mutations: {
        setCurrentUser(state, user) {
            state.user.currentUser = user;
        },

    },
    actions: {
        setCurrentUserAction({ commit }, user) {
            commit('setCurrentUser', user);
        },
    },
    modules: {
        course: courseModule,
        user: userModule,
        activity: activityModule,
        criterion: criterionModule,
        task: taskModule,
        type: typeModule,
        student: studentModule,
        team: teamModule,
        aassessment: aassessmentModule,
        report: reportModule,
    }
});
