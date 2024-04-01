import getMutationTypes from "../getMutationTypes";


const userMutationTypes = {
    LOGIN: 'USER_LOGIN',
    LOGOUT: 'USER_LOGOUT',
    ...getMutationTypes("USER"),
}

export default userMutationTypes;
