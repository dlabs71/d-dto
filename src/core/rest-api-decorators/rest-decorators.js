import { convertArgs, convertResponse } from './common.js';

/**
 * Decorator function for a service function that implements a GET request REST API
 * @param modelResponse - dto class for converting response
 * @param pathToData - path to data filed in object response
 * @returns {function} - decorator function
 */
export function GetMapper(modelResponse, pathToData = 'data') {
    return (target, property, descriptor) => {
        const originalMethod = descriptor.value;
        descriptor.value = (...args) => convertResponse(modelResponse, originalMethod, pathToData, args);
        return descriptor;
    };
}

/**
 * Decorator function for a service function that implements a POST request REST API
 * @param modelRequest - dto class for converting argument
 * @param modelResponse - dto class for converting response. By default it is equal modelRequest
 * @param dtoArgNumber - index dto argument for converting to json
 * @param pathToData - path to data filed in object response
 * @returns {function} - decorator function
 */
export function PostMapper(
    modelRequest,
    modelResponse = null,
    dtoArgNumber = 0,
    pathToData = 'data',
) {
    if (!modelResponse) {
        modelResponse = modelRequest;
    }
    return (target, property, descriptor) => {
        const originalMethod = descriptor.value;
        descriptor.value = (...args) => {
            const newArgs = convertArgs(args, dtoArgNumber);
            return convertResponse(modelResponse, originalMethod, pathToData, newArgs);
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
) {
    return PostMapper(modelRequest, modelResponse, dtoArgNumber, pathToData);
}

/**
 * Decorator function for a service function that implements a DELETE request REST API
 * It is equal GetMapper {@see GetMapper}
 */
export function DeleteMapper(modelResponse, pathToData = 'data') {
    return GetMapper(modelResponse, pathToData);
}
