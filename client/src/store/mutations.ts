import { MutationTree } from 'vuex';
import defaultState from './defaultState';
import modelBase from '@/models/modelBase';
import logger from '@/utils/loggerUtil';

// Define a custom function that generates mutations for a given state type
export default function createMutations<TItem extends modelBase, TState extends defaultState<TItem>>(mutationTypes: {[key: string]: string; }): MutationTree<TState> {
    return {
        [mutationTypes.SET_ITEMS]: (state, items: TItem[]) => {
            state.data = items;
        },

        
        [mutationTypes.ADD_ITEM]: (state, item: TItem) => {
            const index = state.data.findIndex((it) => it.id === item.id);
            
            if (index === -1) {
                state.data = [...state.data, item];
                state.selectedItem = undefined;
            }
            else{
                logger.error("creating item with already existing id: ", item.id)
            }
        },

        [mutationTypes.UPDATE_ITEM]: (state, updatedItem: TItem) => {
            const index = state.data.findIndex((item) => item.id === updatedItem.id);
            if (index !== -1) {
                //state.data[index] = updatedItem;
                state.data = [...state.data.slice(0, index), updatedItem, ...state.data.slice(index + 1)]
                state.selectedItem = undefined;
            }
        },

        [mutationTypes.DELETE_ITEM]: (state, itemId: number) => {
            state.data = [...state.data.filter((item) => item.id !== itemId)];
        },

        [mutationTypes.SELECT_ITEM]: (state, item: TItem) => {
            state.selectedItem = {...item};
        },

        [mutationTypes.UNSELECT_ITEM]: (state) => {
            state.selectedItem = undefined;
        },
    };
}
