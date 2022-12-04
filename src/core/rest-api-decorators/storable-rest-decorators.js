import {j2cMapperWrapper} from '../mappers/index.js';
import {checkSeparateCondition, createLookupId, getDataFromObject} from './common.js';
import {SERVICE_CACHE_ACTIONS, SERVICE_CACHE_GETTERS} from "./store/service-cache-module";

/**
 * Decorator function for a service function that implements a GET request REST API.
 * This decorator can cache the result
 * @param modelResponse - dto class for converting response
 * @param separateStorageConf - configuration for separate result store
 * separateStorageConf = {
 *     argIdx: 1 // index of the argument based on which the lookup will be stored separately
 *     conditions: { // conditions on arguments to save the lookup
 *         arg_0: value => !!value,
 *         arg_1: value => !!value,
 *         arg_2: value => !!value
 *     }
 * }
 * @param saveToStoreFn - function for saving result to store
 * @param getFromStoreFn - function for getting result from store
 * @param pathToData - path to data filed in object response
 * @returns {function} - decorator function
 */
export function StorableGetMapper(
    modelResponse,
    separateStorageConf = null,
    /* eslint-disable-next-line */
    saveToStoreFn = (data) => {
    },
    getFromStoreFn = () => {
    },
    pathToData = 'data',
) {
    return (target, property, descriptor) => {
        const originalMethod = descriptor.value;
        descriptor.value = (...args) => {
            const argSeparateValue = checkSeparateCondition(separateStorageConf, args);

            if (argSeparateValue !== null) {
                if (!argSeparateValue) {
                    return originalMethod.call(this, ...args).then((result) => {
                        const data = getDataFromObject(result, pathToData);
                        return j2cMapperWrapper(data, modelResponse);
                    });
                }
                // for separated by argument value lookup
                const lookupId = createLookupId(argSeparateValue);
                let storedLookup = getFromStoreFn();
                if (!!storedLookup && !!storedLookup[lookupId]) {
                    return new Promise((resolve) => {
                        resolve(j2cMapperWrapper(storedLookup[lookupId], modelResponse));
                    });
                }
                return originalMethod.call(this, ...args).then((result) => {
                    const data = getDataFromObject(result, pathToData);
                    if (!storedLookup) {
                        storedLookup = {};
                    }

                    storedLookup[lookupId] = data;
                    saveToStoreFn(storedLookup);
                    return j2cMapperWrapper(data, modelResponse);
                });
            }

            // for not separated lookup
            const storedLookup = getFromStoreFn();
            if (storedLookup) {
                return new Promise((resolve) => {
                    resolve(j2cMapperWrapper(storedLookup, modelResponse));
                });
            }
            return originalMethod.call(this, ...args).then((result) => {
                const data = getDataFromObject(result, pathToData);
                saveToStoreFn(data);
                return j2cMapperWrapper(data, modelResponse);
            });
        };
        return descriptor;
    };
}

/**
 * Implement StorableGetMapper for vuex store
 * @param store - vuex instance
 * @param modelResponse - dto class for converting response
 * @param lookupName - name lookup
 * @param separateStorageConf - configuration for separate result store
 * @param pathToData - path to data filed in object response
 * @returns {function} - decorator function
 */
export function VuexGetMapper(
    store,
    modelResponse,
    lookupName,
    separateStorageConf = null,
    pathToData = 'data',
) {
    return StorableGetMapper(
        modelResponse,
        separateStorageConf,
        (data) => store.dispatch(SERVICE_CACHE_ACTIONS.saveLookup, {
            name: lookupName,
            data,
        }),
        () => store.getters[SERVICE_CACHE_GETTERS.getLookup](lookupName),
        pathToData,
    );
}
