import { GetterTree } from 'vuex';
import createGetters from '../getters';
import TypeState from './typeState/typeStateInterface';
import Type from '@/models/Type/Type';


const typeGetters: GetterTree<TypeState, any> = {
    ...createGetters<Type, TypeState>('types', 'id')
}

export default typeGetters;
