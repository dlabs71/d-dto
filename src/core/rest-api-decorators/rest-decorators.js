import { convertArgs, convertResponse } from './common.js';

/**
 * Decorator function for a service function that implements a GET request REST API
 * @param modelResponse - dto class for converting response
 * @param pathToData - path to data filed in object response
 * @param strict - if true all fields from JSON must match class fields
 * @returns {function} - decorator function
 */
export function GetMapper(modelResponse, pathToData = 'data', strict = false) {
    return (target, property, descriptor) => {
        const originalMethod = descriptor.value;
        descriptor.value = (...args) => convertResponse(modelResponse, originalMethod, pathToData, args, strict);
        return descriptor;
    };
}

/**
 * Decorator function for a service function that implements a POST request REST API
 * @param modelRequest - dto class for converting argument
 * @param modelResponse - dto class for converting response. By default it is equal modelRequest
 * @param dtoArgNumber - index dto argument for converting to json
 * @param pathToData - path to data filed in object response
 * @param strict - if true all fields from JSON must match class fields
 * @returns {function} - decorator function
 */
export function PostMapper(
    modelRequest,
    modelResponse = null,
    dtoArgNumber = 0,
    pathToData = 'data',
    strict = false,
) {
    if (!modelResponse) {
        modelResponse = modelRequest;
    }
    return (target, property, descriptor) => {
        const originalMethod = descriptor.value;
        descriptor.value = (...args) => {
            const newArgs = convertArgs(args, dtoArgNumber, strict);
            return convertResponse(modelResponse, originalMethod, pathToData, newArgs, strict);
        };
        return descriptor;
    };
}

/**
 * Decorator function for a service function that implements a PUT request REST API
 * It is equal PostMapper {@see PostMapper}
 */
export function PutMapper(
    modelRequest,
    modelResponse = null,
    dtoArgNumber = 0,
    pathToData = 'data',
    strict = false,
) {
    return PostMapper(modelRequest, modelResponse, dtoArgNumber, pathToData, strict);
}

/**
 * Decorator function for a service function that implements a DELETE request REST API
 * It is equal GetMapper {@see GetMapper}
 */
export function DeleteMapper(modelResponse, pathToData = 'data', strict = false) {
    return GetMapper(modelResponse, pathToData, strict);
}
