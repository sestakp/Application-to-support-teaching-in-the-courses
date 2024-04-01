import { GetterTree } from 'vuex';
import createGetters from '../getters';
import Team from '@/models/Team/Team';
import TeamState from './teamState/teamStateInterface';


const teamGetters: GetterTree<TeamState, any> = {
    ...createGetters<Team, TeamState>('teams', 'id')
}

export default teamGetters;
