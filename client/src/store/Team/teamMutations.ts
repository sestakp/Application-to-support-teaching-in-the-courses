import createMutations from '../mutations';
import Team from '@/models/Team/Team';
import TeamState from './teamState/teamStateInterface';
import teamMutationTypes from './teamMutationTypes';


const teamMutations = createMutations<Team, TeamState>(teamMutationTypes);

export default teamMutations;
