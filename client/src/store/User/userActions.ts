import { ActionTree, Commit, ActionContext } from 'vuex';
import logger from '@/utils/loggerUtil';
import User from '@/models/User/User';
import UserLogin from '@/models/User/UserLogin';
import UserRegister from '@/models/User/UserRegister';
import UserApi from '@/api/User/UserApi';
import UserFaker from '@/fakerApi/userFaker';
import createActions from '../actions';
import Course from '@/models/Course/Course';
import UserState from './userState/userStateInterface';
import userMutationTypes from './userMutationTypes';
import { deleteCookie, setCookie } from '@/utils/cookies';


const userActions: ActionTree<UserState, any> = {
    // Define your specific actions for the User model
    async login({ commit }: { commit: Commit }, loginRequest: UserLogin) {
        const response = await (process.env.VUE_APP_API_URL !== undefined ? UserApi.login(loginRequest) : UserFaker.login(loginRequest));

        if (response) {
            logger.debug("login response: ", response)
            setCookie("currentUser", JSON.stringify(response), 60*60)
            commit(userMutationTypes.LOGIN, response);
        }

        return response;
    },

    async logout({ commit }: { commit: Commit }, loginRequest: UserLogin) {
        deleteCookie("currentUser")
        commit(userMutationTypes.LOGOUT);
    },

    async register({ commit }: { commit: Commit }, registerRequest: UserRegister) {
        if (registerRequest.password != registerRequest.passwordConfirm) return undefined;

        const response = await (process.env.VUE_APP_API_URL !== undefined ? UserApi.register(registerRequest) : UserFaker.register(registerRequest));

        return response;
    },

    async fetchCourseUsers(context: ActionContext<UserState, any>, courseId: number) {
        const course = context.rootGetters.getCourseById(courseId)
        if(course == undefined) {
            logger.error("fetchCourseUsers course is undefined")
            return;
        }

        const currentUser = context.rootGetters.getCurrentUser()
        if(currentUser == undefined) {
            logger.error("fetchCourseUsers currentUser is undefined")
            return;
        }

        const items = await (process.env.VUE_APP_API_URL !== undefined ? UserApi.readCourseUsers(course, currentUser.token) : UserFaker.readCourseUsers(course));
        context.commit(userMutationTypes.SET_ITEMS, items);
        return items;
    },

    async removeCourseFromUser(context: ActionContext<UserState, any>, { course, user }: { course: Course; user: User }){
        user.privilegedCourses = user.privilegedCourses.filter(c => c!= course.id);
        const currentUser = context.rootGetters.getCurrentUser()
        if(currentUser == undefined) {
            logger.error("fetchCourseUsers currentUser is undefined")
            return;
        }

        const updatedItemData = await(process.env.VUE_APP_API_URL !== undefined ? UserApi.update(user, currentUser.token) : UserFaker.update(user));
            
        context.commit(userMutationTypes.DELETE_ITEM, user.id);
    },

    // Extend the existing actions with specific modifications
    ...(createActions<User, UserState>(UserApi, UserFaker, userMutationTypes) as ActionTree<UserState, any>)
}

export default userActions;
