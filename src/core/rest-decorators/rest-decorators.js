import {convertArgs, convertResponse} from "./common.js";

export function GetMapper(modelResponse) {
    return (target, property, descriptor) => {
        const originalMethod = descriptor.value;
        descriptor.value = (...args) => {
            return convertResponse(modelResponse, originalMethod, args);
        };
        return descriptor;
    }
}

export function PostMapper(modelRequest, modelResponse = null, dtoArgNumber = 0) {
    if (!modelResponse) {
        modelResponse = modelRequest;
    }
    return (target, property, descriptor) => {
        const originalMethod = descriptor.value;
        descriptor.value = function (...args) {
            let newArgs = convertArgs(args, dtoArgNumber);
            return convertResponse(modelResponse, originalMethod, newArgs);
        };
        return descriptor;
    }
}

export function PutMapper(modelRequest, modelResponse = null, dtoArgNumber = 0) {
    return PostMapper(modelRequest, modelResponse, dtoArgNumber);
}

export function DeleteMapper(modelResponse) {
    return GetMapper(modelResponse);
}