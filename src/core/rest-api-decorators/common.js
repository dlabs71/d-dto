import {c2jMapperWrapper, j2cMapperWrapper} from "../mappers/index.js";
import {v5 as uuidV5} from "uuid";
import {UUID_NAMESPACE} from "../constants.js";

export function getDataFromObject(obj, pathToField = null) {
    if (!pathToField) {
        return obj;
    }
    if (!pathToField.includes(".")) {
        if (!(pathToField in obj)) {
            return null;
        }
        return obj[pathToField];
    }
    let data = obj;
    for (let field of pathToField.split(".")) {
        if (!data) {
            return null;
        }
        data = data[field];
    }
    return data;
}

export function convertResponse(modelResponse, originalMethod, pathToData, args) {
    let convert = (result) => {
        let data = getDataFromObject(result, pathToData);
        return j2cMapperWrapper(data, modelResponse);
    };

    let result = originalMethod.call(this, ...args);
    if (result instanceof Promise) {
        return result.then((result) => {
            return convert(result);
        });
    }

    return convert(result);
}

export function convertArgs(args, dtoArgNumber) {
    let dtoArg = args[dtoArgNumber];
    let json = c2jMapperWrapper(dtoArg);
    let newArgs = Array.from(args);
    newArgs[dtoArgNumber] = json;
    return newArgs;
}

export function checkSeparateCondition(separateStorageConf, args) {
    if (separateStorageConf != null && typeof separateStorageConf === 'object') {
        let argIdx = separateStorageConf['argIdx'];
        if (argIdx !== null || argIdx !== undefined) {
            let conditions = separateStorageConf['conditions'];

            if (!conditions) {
                return args[argIdx];
            }

            if (conditions) {
                let executeConditions = Object.keys(conditions).filter(argKey => {
                    if (argKey.startsWith("arg_")) {
                        let argIdx = Number.parseInt(argKey.split('_')[1]);
                        return conditions[argKey](args[argIdx])
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
    if (Array.isArray(baseData) || typeof baseData === "object") {
        baseDataStr = JSON.stringify(baseData);
    } else {
        baseDataStr = String(baseData);
    }
    return uuidV5(baseDataStr, UUID_NAMESPACE);
}