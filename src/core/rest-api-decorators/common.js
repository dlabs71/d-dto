import { v5 as uuidV5 } from 'uuid';
import { c2jMapperWrapper, j2cMapperWrapper } from '../mappers/index.js';
import { UUID_NAMESPACE } from '../constants.js';

/**
 * Function to get value from JS object by path
 * @param obj - JS object
 * @param pathToField - path to field separate by "."
 *
 * Example:
 * pathToField = data.property.value
 * obj = {
 *     data: {
 *         property: {
 *             value: "value"
 *         }
 *     }
 * }
 *
 * @returns {null} - value from object property
 */
export function getDataFromObject(obj, pathToField = null) {
    if (!pathToField) {
        return obj;
    }
    if (!pathToField.includes('.')) {
        if (!(pathToField in obj)) {
            return null;
        }
        return obj[pathToField];
    }
    let data = obj;
    /* eslint-disable-next-line */
    for (const field of pathToField.split('.')) {
        if (!data) {
            return null;
        }
        data = data[field];
    }
    return data;
}

/**
 * Function for convert from json response original method to dto class instance
 * @param modelResponse - dto class for convert
 * @param originalMethod - original function
 * @param pathToData - path to json object in response from original function
 * @param args - arguments array for original function
 * @returns {Promise<DtoModel>|DtoModel} - promise or simple dto class instance.
 * If original function return Promise instance that result will be a Promise with converted value
 */
export function convertResponse(modelResponse, originalMethod, pathToData, args) {
    const convert = (result) => {
        const data = getDataFromObject(result, pathToData);
        return j2cMapperWrapper(data, modelResponse);
    };

    const result = originalMethod.call(this, ...args);
    if (result instanceof Promise) {
        return result.then((res) => convert(res));
    }

    return convert(result);
}

/**
 * Function to convert a single element in an array from an instance of the dto class to a simple JS object
 * @param args - array
 * @param dtoArgNumber - index item in array
 * @returns {Array} - array with converting an item
 */
export function convertArgs(args, dtoArgNumber) {
    const dtoArg = args[dtoArgNumber];
    const json = c2jMapperWrapper(dtoArg);
    const newArgs = Array.from(args);
    newArgs[dtoArgNumber] = json;
    return newArgs;
}

/**
 * Function for checking condition
 * @param separateStorageConf - config separate store
 * separateStorageConf = {
 *     argIdx: 1 // index of the argument based on which the lookup will be stored separately
 *     conditions: { // conditions on arguments to save the lookup
 *         arg_0: value => !!value,
 *         arg_1: value => !!value,
 *         arg_2: value => !!value
 *     }
 * }
 * @param args - array arguments
 * @returns {null|boolean|*} result checking config
 * if result is null then separateStorageConf is empty or argIdx null or undefined
 * if result is false then check config not passed
 * else function return value argument with index argIdx
 */
export function checkSeparateCondition(separateStorageConf, args) {
    if (separateStorageConf != null && typeof separateStorageConf === 'object') {
        const { argIdx } = separateStorageConf;
        if (argIdx !== null || argIdx !== undefined) {
            const { conditions } = separateStorageConf;

            if (!conditions) {
                return args[argIdx];
            }

            if (conditions) {
                const executeConditions = Object.keys(conditions).filter((argKey) => {
                    if (argKey.startsWith('arg_')) {
                        const argMethodIdx = Number.parseInt(argKey.split('_')[1], 10);
                        return conditions[argKey](args[argMethodIdx]);
                    }
                    return false;
                });
                if (executeConditions.length === Object.keys(conditions).length) {
                    return args[argIdx];
                }
            }

            return false;
        }
    }
    return null;
}

/**
 * Function for creating unique lookup ID based on data from parameter
 * @param baseData - data for based generating ID
 * @returns {string} - lookup ID
 */
export function createLookupId(baseData) {
    let baseDataStr;
    if (Array.isArray(baseData) || typeof baseData === 'object') {
        baseDataStr = JSON.stringify(baseData);
    } else {
        baseDataStr = String(baseData);
    }
    return uuidV5(baseDataStr, UUID_NAMESPACE);
}
