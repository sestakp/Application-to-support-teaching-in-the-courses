import createMutations from '../mutations';
import TypeState from './typeState/typeStateInterface';
import typeMutationTypes from './typeMutationTypes';
import Type from '@/models/Type/Type';


const typeMutations = createMutations<Type, TypeState>(typeMutationTypes);

export default typeMutations;
