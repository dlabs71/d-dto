import { convertArgs, convertResponse } from './common.js';

export function GetMapper(modelResponse, pathToData = 'data') {
    return (target, property, descriptor) => {
        const originalMethod = descriptor.value;
        descriptor.value = (...args) => convertResponse(modelResponse, originalMethod, pathToData, args);
        return descriptor;
    };
}

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

export function PutMapper(
    modelRequest,
    modelResponse = null,
    dtoArgNumber = 0,
    pathToData = 'data',
) {
    return PostMapper(modelRequest, modelResponse, dtoArgNumber, pathToData);
}

export function DeleteMapper(modelResponse, pathToData = 'data') {
    return GetMapper(modelResponse, pathToData);
}
