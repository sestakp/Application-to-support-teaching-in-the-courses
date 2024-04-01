import logger from "@/utils/loggerUtil";
import modelBase from "@/models/modelBase";
import defaultState from "./defaultState";
import { ActionTree, Commit, ActionContext } from 'vuex';
import ApiWrapper from "@/api/ApiWrapper";
import Faker from "@/fakerApi/faker";
import isNewerThan from "@/utils/isNewerThan";
import areItemsValid from "@/utils/areItemsValid";

function createActions<T extends modelBase, TS extends defaultState<T>>(api: ApiWrapper<T>, faker: Faker<T>, mutationTypes:any): ActionTree<TS, any> {
    return {
        async fetchItems(context: ActionContext<TS, any>) {
            const currentUser = context.rootGetters.getCurrentUser();
        
            if (currentUser !== undefined) {
                // Check if the items are already in the store and the timestamp is within 2 minutes
                /*const existingItems = context.state.data;
                if (existingItems.length > 0 && areItemsValid(existingItems, 2 * 60 * 1000)) {
                    logger.debug("RETURNING EXISTING ITEMS");
                    return existingItems;
                }*/
        
                const items = await (process.env.VUE_APP_API_URL !== undefined ? api.readAll(currentUser.token) : faker.readAll()) as T[];
        
                if (items) {
                    /*const timestamp = Date.now(); // Common timestamp for all fetched items
                    items.forEach(item => {
                        item.timestamp = timestamp; // Add current timestamp to each item
                    });*/
        
                    context.commit(mutationTypes.SET_ITEMS, items);
                    return items;
                }
            }
        
            return null;
        },

        /*async fetchItems(context: ActionContext<TS, any>) {
            const currentUser = context.rootGetters.getCurrentUser();
            
            if(currentUser != undefined){
                const items = await (process.env.VUE_APP_API_URL !== undefined ? api.readAll(currentUser.token) : faker.readAll());
                //logger.debug("fetching all items: ", items)
                context.commit(mutationTypes.SET_ITEMS, items);
                return items;
            }
            return null;
        },

        
        async fetchItem(context: ActionContext<TS, any>, id: number) {
            const currentUser = context.rootGetters.getCurrentUser();
            
            if(currentUser != undefined){
                const item = await (process.env.VUE_APP_API_URL !== undefined ? api.read(id, currentUser.token) : faker.read(id));
                //logger.debug("fetching item: ", item)
                if(item){
                    if(context.state.data.find(d => d.id == item.id) == undefined){
                        context.commit(mutationTypes.ADD_ITEM, item);
                    }
                    else{
                        context.commit(mutationTypes.UPDATE_ITEM, item);
                    }
                    
                    return item;
                }
                
            }
            return null;
        },
        */
        async fetchItem(context: ActionContext<TS, any>, id: number) {
            const currentUser = context.rootGetters.getCurrentUser();
        
            if (currentUser !== undefined) {
                // Check if the item is already in the store and the timestamp is within 2 minutes
                const existingItem = context.state.data.find(d => d.id === id);
                /*if (existingItem && existingItem.timestamp != undefined && isNewerThan(existingItem.timestamp, 2 * 60 * 1000)) {
                    logger.debug("RETURNING EXISTING ITEM")
                    return existingItem;
                }*/
        
                const item = await (process.env.VUE_APP_API_URL !== undefined ? api.read(id, currentUser.token) : faker.read(id));
        
                if (item) {
                    //item.timestamp = Date.now(); // Add current timestamp to the item
        
                    if (existingItem) {
                        context.commit(mutationTypes.UPDATE_ITEM, item);
                    } else {
                        context.commit(mutationTypes.ADD_ITEM, item);
                    }
        
                    return item;
                }
            }
        
            return null;
        },

        async createItem(context: ActionContext<TS, any>, item: T) {
            
            const currentUser = context.rootGetters.getCurrentUser();
            if(currentUser){
                const newItem = await(process.env.VUE_APP_API_URL !== undefined ? api.create(item, currentUser.token) : faker.create(item));
                //logger.debug("creating item: ", newItem)
                //newItem.timestamp = Date.now();
                context.commit(mutationTypes.ADD_ITEM, newItem);
                return newItem;
            }

            return null;
        },

        async updateItem(context: ActionContext<TS, any>, updatedItem: T) {
            
            const currentUser = context.rootGetters.getCurrentUser();
            if(currentUser){
                
                const updatedItemData = await(process.env.VUE_APP_API_URL !== undefined ? api.update(updatedItem, currentUser.token) : faker.update(updatedItem));
                //logger.debug("updating item: ", updatedItemData)
                //updatedItemData.timestamp = Date.now();
                context.commit(mutationTypes.UPDATE_ITEM, updatedItemData);
                return updatedItemData;
            }
            return null;
        },

        async createOrUpdateItem(context: ActionContext<TS, any>, item: T): Promise<T | undefined> {
            
            const currentUser = context.rootGetters.getCurrentUser();
            if(currentUser){

                if(item.id == undefined){
                    const newItem = await(process.env.VUE_APP_API_URL !== undefined ? api.create(item, currentUser.token) : faker.create(item));
                    //logger.debug("creating item: ", newItem)
                    //newItem.timestamp = Date.now();
                    context.commit(mutationTypes.ADD_ITEM, newItem);
                    return newItem
                }
                else{
                    const updatedItemData = await(process.env.VUE_APP_API_URL !== undefined ? api.update(item, currentUser.token) : faker.update(item));
                    //logger.debug("updating item: ", updatedItemData)
                    //updatedItemData.timestamp = Date.now();
                    context.commit(mutationTypes.UPDATE_ITEM, updatedItemData);
                    return updatedItemData
                }
            }

            return undefined;

        },

        async deleteItem(context: ActionContext<TS, any>, itemId: number) {
            const currentUser = context.rootGetters.getCurrentUser();
            if(currentUser){
                //logger.debug("deleting item: ", itemId)
                await (process.env.VUE_APP_API_URL !== undefined ? api.delete(itemId, currentUser.token) : faker.delete(itemId));
                context.commit(mutationTypes.DELETE_ITEM, itemId);
            }
        },

        selectItem({ commit }: { commit: Commit }, item: T) {
            commit(mutationTypes.SELECT_ITEM, item);
        },

        unselectItem({ commit }: { commit: Commit }) {
            commit(mutationTypes.UNSELECT_ITEM);
        },
    };
}
export default createActions;
