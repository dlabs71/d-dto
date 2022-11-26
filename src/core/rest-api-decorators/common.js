import { v5 as uuidV5 } from 'uuid';
import { c2jMapperWrapper, j2cMapperWrapper } from '../mappers/index.js';
import { UUID_NAMESPACE } from '../constants.js';

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

export function convertArgs(args, dtoArgNumber) {
    const dtoArg = args[dtoArgNumber];
    const json = c2jMapperWrapper(dtoArg);
    const newArgs = Array.from(args);
    newArgs[dtoArgNumber] = json;
    return newArgs;
}

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

export function createLookupId(baseData) {
    let baseDataStr;
    if (Array.isArray(baseData) || typeof baseData === 'object') {
        baseDataStr = JSON.stringify(baseData);
    } else {
        baseDataStr = String(baseData);
    }
    return uuidV5(baseDataStr, UUID_NAMESPACE);
}
