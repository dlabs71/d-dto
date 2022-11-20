import {j2cMapperWrapper} from "../mappers/index.js";
import {checkSeparateCondition, createLookupId} from "./common.js";

export function StorableGetMapper(
    modelResponse,
    separateStorageConf = null,
    saveToStoreFn = (data) => {
    },
    getFromStoreFn = () => {
    }
) {
    return (target, property, descriptor) => {
        const originalMethod = descriptor.value;
        descriptor.value = function (...args) {
            let argSeparateValue = checkSeparateCondition(separateStorageConf, args);

            if (argSeparateValue !== null) {
                if (!argSeparateValue) {
                    return originalMethod.call(this, ...args).then((result) => {
                        if (result.data) {
                            return j2cMapperWrapper(result.data, modelResponse);
                        }
                    });
                }
                // for separated by argument value lookup
                let lookupId = createLookupId(argSeparateValue);
                let storedLookup = getFromStoreFn();
                if (!!storedLookup && !!storedLookup[lookupId]) {
                    return new Promise(resolve => {
                        resolve(j2cMapperWrapper(storedLookup[lookupId], modelResponse));
                    });
                }
                return originalMethod.call(this, ...args).then((result) => {
                    if (result.data) {
                        if (!storedLookup) {
                            storedLookup = {};
                        }

                        storedLookup[lookupId] = result.data;
                        saveToStoreFn(storedLookup)
                        return j2cMapperWrapper(result.data, modelResponse);
                    }
                });
            }

            // for not separated lookup
            let storedLookup = getFromStoreFn();
            if (!!storedLookup) {
                return new Promise(resolve => {
                    resolve(j2cMapperWrapper(storedLookup, modelResponse));
                });
            }
            return originalMethod.call(this, ...args).then((result) => {
                if (result.data) {
                    saveToStoreFn(result.data);
                    return j2cMapperWrapper(result.data, modelResponse);
                }
            });
        };
        return descriptor;
    }
}

export function VuexGetMapper(
    store,
    modelResponse,
    lookupName,
    separateStorageConf = null,
) {
    return StorableGetMapper(
        modelResponse,
        separateStorageConf,
        (data) => {
            return store.dispatch('setLookup', {
                name: lookupName,
                data: data
            });
        },
        () => {
            return store.getters.getLookup(lookupName);
        }
    );
}