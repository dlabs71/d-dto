import {mapper, model2json} from './core/core-mapper'

function ServiceMapper(model, usePromise = true) {
    return (target, property, descriptor) => {
        const originalMethod = descriptor.value;
        descriptor.value = function (...args) {
            if (usePromise) {
                return originalMethod.call(this, ...args).then((result) => {
                    if (result.data) {
                        return mapper(result.data, model);
                    }
                });
            }
            let result = originalMethod.call(this, ...args);
            return mapper(result, model);

        };
        return descriptor;
    }
}

function PostServiceMapper(modelRequest, modelResponse = null, argNumber = 0, usePromise = true) {
    if (!modelResponse) {
        modelResponse = modelRequest;
    }
    return (target, property, descriptor) => {
        const originalMethod = descriptor.value;
        descriptor.value = function (...args) {
            let arg = args[argNumber];
            let json = model2json(arg);
            let newArgs = Array.from(args);
            newArgs[argNumber] = json;
            if (usePromise) {
                return originalMethod.call(this, ...newArgs).then((result) => {
                    if (result.data) {
                        return mapper(result.data, modelResponse);
                    }
                });
            }
            let result = originalMethod.call(this, ...newArgs);
            return mapper(result, modelResponse);

        };
        return descriptor;
    }
}

function StoreServiceMapper(store, model, lookupName, separateByArg = null) {
    return (target, property, descriptor) => {
        const originalMethod = descriptor.value;
        descriptor.value = function (...args) {
            let separated = false;
            let separateArgIdx = separateByArg;
            if (separateByArg != null && typeof separateByArg === 'object') {
                separateArgIdx = separateByArg['separateArgIdx'];
                if (separateArgIdx !== null || separateArgIdx !== undefined) {
                    let conditions = separateByArg['conditions'];
                    if (conditions) {
                        let executeConditions = Object.keys(conditions).filter(argKey => {
                            if (argKey.startsWith("arg_")) {
                                let argIdx = Number.parseInt(argKey.split('_')[1]);
                                return conditions[argKey](args[argIdx])
                            }
                            return false;
                        });
                        if (executeConditions.length === Object.keys(conditions).length) {
                            separated = true;
                        }
                    }

                    if (!conditions) {
                        separated = true;
                    }
                }
            }

            if (separateArgIdx != null) {
                if (!separated) {
                    return originalMethod.call(this, ...args).then((result) => {
                        if (result.data) {
                            return mapper(result.data, model);
                        }
                    });
                }
                // for separated by argument value lookup
                let identifierLookup = String(args[separateArgIdx]).toLowerCase();
                let storedLookup = store.getters.getLookupByName(lookupName);
                if (storedLookup && storedLookup[identifierLookup]) {
                    return new Promise(resolve => {
                        resolve(mapper(storedLookup[identifierLookup], model));
                    });
                }
                return originalMethod.call(this, ...args).then((result) => {
                    if (result.data) {
                        if (!storedLookup) {
                            store.dispatch('setLookup', {
                                name: lookupName,
                                data: {
                                    [identifierLookup]: result.data
                                }
                            });
                            return mapper(result.data, model);
                        }

                        storedLookup[identifierLookup] = result.data;
                        store.dispatch('setLookup', {
                            name: lookupName,
                            data: storedLookup
                        });
                        return mapper(result.data, model);
                    }
                });
            }

            // for not separated lookup
            let storedLookup = store.getters.getLookupByName(lookupName);
            if (storedLookup) {
                return new Promise(resolve => {
                    resolve(mapper(storedLookup, model));
                });
            }
            return originalMethod.call(this, ...args).then((result) => {
                if (result.data) {
                    store.dispatch('setLookup', {
                        name: lookupName,
                        data: result.data
                    });
                    return mapper(result.data, model);
                }
            });
        };
        return descriptor;
    }
}

export {
    StoreServiceMapper,
    ServiceMapper,
    model2json,
    PostServiceMapper,
    mapper
}