import { GetterTree } from 'vuex';
import defaultState from './defaultState';
import modelBase from '@/models/modelBase';


function createGetters<TItem extends modelBase, TState extends defaultState<TItem>>(stateKey: string, idKey: keyof TItem): GetterTree<TState, any> {
    return {
        allItems: (state: TState): TItem[] => { 
            return state.data 
        },
        getItemById: (state: TState) => (itemId: number): TItem | undefined => { 
            const result = state.data.find((item: TItem) => (item[idKey] as unknown as number) == itemId) 
            return result
        },
        selectedItem: (state: TState): TItem | undefined => state.selectedItem
    };
}

export default createGetters;
