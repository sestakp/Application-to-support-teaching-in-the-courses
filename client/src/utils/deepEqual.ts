import logger from "./loggerUtil";

export default function deepEqual(obj1: any, obj2: any): boolean {
    // Check if both objects are objects
    if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 == undefined || obj2 == undefined) {
        
        if(obj1 == undefined || obj1 == null){
            return true;
        }

        if(obj2 == undefined || obj2 == null){
            return true;
        }

        return obj1 === obj2; // Compare non-object values directly
    }

    // Check if both objects have the same set of keys



    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    // Check if all keys in obj1 are present in obj2 (considering null and undefined values)
    // eslint-disable-next-line
    if (!keys1.every(key => obj2.hasOwnProperty(key) || obj1[key] === null || obj1[key] === undefined)) {
        return false;
    }

    // Check if all keys in obj2 are present in obj1 (considering null and undefined values)
    // eslint-disable-next-line
    if (!keys2.every(key => obj1.hasOwnProperty(key) || obj2[key] === null || obj2[key] === undefined)) {
        return false;
    }
    
    // Recursively compare nested properties
    return keys1.every(key => deepEqual(obj1[key], obj2[key])) && keys2.every(key => deepEqual(obj1[key], obj2[key]));
}