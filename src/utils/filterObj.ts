export const filterObj = <T extends Record<string, any>>(
    obj: T,
    ...allowedFields: (keyof T)[]
): Partial<T> => {
    return Object.keys(obj).reduce((newObj: Partial<T>, key: keyof T) => {
        if (allowedFields.includes(key)) {
            newObj[key] = obj[key];
        }
        return newObj;
    }, {});
};
