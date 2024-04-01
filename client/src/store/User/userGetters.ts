import { GetterTree } from 'vuex';
import logger from '@/utils/loggerUtil';

import createGetters from '../getters';
import UserState from './userState/userStateInterface';
import User from '@/models/User/User';
import CurrentUser from '@/models/User/CurrentUser';


const userGetters: GetterTree<UserState, any> = {
    currentUser(state: UserState): CurrentUser | undefined {
        const currentUser =  (process.env.VUE_APP_API_URL !== undefined ? 
            state.currentUser 
            : 
            {
                id: 0,
                name: "Test Testov",
                email: "test@tempuri.com",
                token: "aaa"
            } as CurrentUser
            )
        
        return currentUser
    },

    isLogged(state: UserState): boolean {
        const currentUser =  (process.env.VUE_APP_API_URL !== undefined ? 
            state.currentUser 
            : 
            {
                id: 0,
                name: "Test Testov",
                email: "test@tempuri.com",
                token: "aaa"
            } as CurrentUser
            )
        
        return currentUser != undefined
    },

    ...createGetters<User, UserState>('users', 'id'),

    getItemById: (state: UserState) => (itemId: number): User | undefined => { 
        const result = state.data.find((item: User) => item.id == itemId) 

        if(process.env.VUE_APP_API_URL === undefined && itemId == 0){
            return {
                id: 0,
                name: "Test Testov",
                email: "test@tempuri.com",
                password: "123",
                registrationDate: new Date()
            } as User
        }
        return result
    },
}

export default userGetters;
