import { j2cMapperWrapper } from '../mappers/index.js';
import { checkSeparateCondition, createLookupId, getDataFromObject } from './common.js';

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
        (data) => store.dispatch('setLookup', {
            name: lookupName,
            data,
        }),
        () => store.getters.getLookup(lookupName),
        pathToData,
    );
}
