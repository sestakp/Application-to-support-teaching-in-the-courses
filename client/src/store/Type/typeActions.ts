import { ActionTree, ActionContext } from 'vuex';
import createActions from '../actions';
import TypeState from './typeState/typeStateInterface';
import TypeApi from '@/api/Type/TypeApi';
import TypeFaker from '@/fakerApi/typeFaker';
import typeMutationTypes from './typeMutationTypes';
import Type from '@/models/Type/Type';

const typeActions: ActionTree<TypeState, any> = {
    // Define your specific actions for the Course model
    async fetchCourseTypes(context: ActionContext<TypeState, any>, courseId: number) {
        const currentUser = context.rootGetters.getCurrentUser();
        if(currentUser){
            const items = await (process.env.VUE_APP_API_URL !== undefined ? TypeApi.readCourseTypes(courseId, currentUser.token) : TypeFaker.readCourseTypes(courseId));
            context.commit(typeMutationTypes.SET_ITEMS, items);
        }
    },
    // Extend the existing actions with specific modifications
    ...createActions<Type, TypeState>(TypeApi, TypeFaker, typeMutationTypes),
};

export default typeActions;
