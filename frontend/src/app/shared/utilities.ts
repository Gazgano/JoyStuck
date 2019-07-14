// does a superficial copy of the array, delete the first found element which fill the condition
// and return the result
export function copyArrayAndDeleteFrom(arr: any[], project: (e: any) => boolean) {
    if (!arr || arr.length === 0) {
        return [];
    }

    const index = arr.findIndex(project);
    const result = [...arr];
    if(index > -1) {
        result.splice(index, 1);
    }

    return result;
}
