import modelBase from "@/models/modelBase";

export default interface defaultState<T extends modelBase> {
    data: T[],
    selectedItem: T | undefined
}
