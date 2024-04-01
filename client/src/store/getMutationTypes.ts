const getMutationTypes = (prefix: string) => ({
    SET_ONE: prefix + '_SET_ITEM',
    SET_ITEMS: prefix + '_SET_ITEMS',
    ADD_ITEM: prefix + '_ADD_ITEM',
    UPDATE_ITEM: prefix + '_UPDATE_ITEM',
    DELETE_ITEM: prefix + '_DELETE_ITEM',
    SELECT_ITEM: prefix + '_SELECT_ITEM',
    UNSELECT_ITEM: prefix + '_UNSELECT_ITEM'
})

export default getMutationTypes;
