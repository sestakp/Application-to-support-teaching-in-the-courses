import CurrentUser from '@/models/User/CurrentUser';
import createMutations from '../mutations';
import userMutationTypes from './userMutationTypes';
import UserState from './userState/userStateInterface';
import User from '@/models/User/User';


const userMutations = {
    [userMutationTypes.LOGIN]: (state: UserState, item: CurrentUser) => {
        state.currentUser = item;
    },

    [userMutationTypes.LOGOUT]: (state: UserState) => {
        state.currentUser = {} as CurrentUser
        state.currentUser = undefined;
    },

    ...createMutations<User, UserState>(userMutationTypes)
}

export default userMutations;
