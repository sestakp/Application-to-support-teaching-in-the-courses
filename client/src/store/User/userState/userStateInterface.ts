import CurrentUser from '@/models/User/CurrentUser';
import User from '@/models/User/User';
import defaultState from '@/store/defaultState';


export default interface UserState extends defaultState<User>{
    currentUser: CurrentUser | undefined;
}
