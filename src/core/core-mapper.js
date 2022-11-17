function mapperObj(jsonObj, model) {
    let dto = new model();
    if (dto.beforePropertySet) {
        dto.beforePropertySet(jsonObj, model);
    }
    Object.keys(dto).filter(item => !item.startsWith("#") && !item.startsWith("$")).forEach(item => {
        let proto = model.prototype;
        let jsonFieldNameDesc = Object.getOwnPropertyDescriptor(proto, "#" + item + "JsonField");
        let jsonFieldName = null;
        if (!jsonFieldNameDesc) {
            proto = model.prototype.__proto__;
            while (!jsonFieldNameDesc && !!proto) {
                jsonFieldNameDesc = Object.getOwnPropertyDescriptor(proto, "#" + item + "JsonField");
                if (jsonFieldNameDesc) {
                    jsonFieldName = jsonFieldNameDesc.value;
                    break;
                }
                proto = proto.__proto__;
            }
        } else {
            jsonFieldName = Object.getOwnPropertyDescriptor(model.prototype, "#" + item + "JsonField").value;
        }

        if (!jsonFieldName) {
            return;
        }

        let validateAndTransform = null;
        if (Object.getOwnPropertyDescriptor(proto, "#" + item + "VaT")) {
            validateAndTransform = Object.getOwnPropertyDescriptor(proto, "#" + item + "VaT").value;
        }
        let jsonValue = null;
        if (validateAndTransform) {
            if (Array.isArray(jsonFieldName)) {
                for (let i = 0; i < jsonFieldName.length; i++) {
                    jsonValue = validateAndTransform(jsonObj[jsonFieldName[i]]);
                    if (jsonValue) {
                        break;
                    }
                }
            } else {
                jsonValue = validateAndTransform(jsonObj[jsonFieldName]);
            }
        }
        if (!validateAndTransform) {
            if (Array.isArray(jsonFieldName)) {
                for (let i = 0; i < jsonFieldName.length; i++) {
                    jsonValue = jsonObj[jsonFieldName[i]];
                    if (jsonValue) {
                        break;
                    }
                }
            } else {
                jsonValue = jsonObj[jsonFieldName];
            }
        }
        dto[item] = jsonValue;
    });
    if (dto.afterPropertySet) {
        dto.afterPropertySet(jsonObj, model);
    }
    return dto;
}


function mapperModel(dto, skipNotDefine = false) {
    let resultJsonObj = {};
    Object.keys(dto).filter(item => !item.startsWith("#") && !item.startsWith("$")).forEach(item => {
        let proto = dto.__proto__;
        let jsonFieldNameDesc = Object.getOwnPropertyDescriptor(proto, "#" + item + "JsonField");
        let jsonFieldName = null;
        if (!jsonFieldNameDesc) {
            proto = proto.__proto__;
            while (!jsonFieldNameDesc || proto) {
                if (!proto) {
                    if (skipNotDefine) {
                        break;
                    }
                    throw new Error(`Not found jsonFieldName for "${item}" in ${JSON.stringify(dto)}`);
                }
                jsonFieldNameDesc = Object.getOwnPropertyDescriptor(proto, "#" + item + "JsonField");
                if (jsonFieldNameDesc) {
                    jsonFieldName = jsonFieldNameDesc.value;
                    break;
                }
                proto = proto.__proto__;
            }
        } else {
            jsonFieldName = Object.getOwnPropertyDescriptor(proto, "#" + item + "JsonField").value;
        }

        if (!jsonFieldName) {
            return;
        }
        let validateAndTransform = null;
        if (Object.getOwnPropertyDescriptor(proto, "#" + item + "VaT")) {
            validateAndTransform = Object.getOwnPropertyDescriptor(proto, "#" + item + "VaT").value;
        }
        let value = null;
        if (validateAndTransform) {
            if (Array.isArray(jsonFieldName)) {
                throw new Error("Json field name as array, is not supported!")
            } else {
                value = validateAndTransform(dto[item], true);
            }
        }
        if (!validateAndTransform) {
            if (Array.isArray(jsonFieldName)) {
                throw new Error("Json field name as array, is not supported!")
            } else {
                value = dto[item];
            }
        }
        resultJsonObj[jsonFieldName] = value;
    });
    return resultJsonObj;
}


function mapper(jsonObj, model) {
    if (!model) {
        throw new Error("model is required attr!")
    }
    if ("default" === model) {
        return jsonObj;
    }
    if (!jsonObj) {
        return undefined;
    }
    if (Array.isArray(jsonObj)) {
        return jsonObj.map(item => {
            return mapperObj(item, model);
        });
    }
    return mapperObj(jsonObj, model);
}

function model2json(dto, skipNotDefine = false) {
    if (!dto) {
        return null;
    }
    if (Array.isArray(dto)) {
        return dto.map(item => {
            return mapperModel(item, skipNotDefine);
        });
    }
    return mapperModel(dto, skipNotDefine);
}

export {
    mapper,
    mapperModel,
    mapperObj,
    model2json
}