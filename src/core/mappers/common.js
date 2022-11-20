import {CAST_FN_TMPL, JSON_NAME_TMPL} from "../constants";

export function findPropertyDescription(attrName, clazz) {
    let proto = clazz.prototype;
    let attrDescription = Object.getOwnPropertyDescriptor(proto, attrName);
    if (!attrDescription) {
        proto = proto.__proto__;
        while (!attrDescription && !!proto) {
            attrDescription = Object.getOwnPropertyDescriptor(proto, attrName);
            if (!!attrDescription) {
                break;
            }
            proto = proto.__proto__;
        }
    }
    return attrDescription;
}


export function getJsonFieldProp(dtoAttr, dtoClass, skipIfNotDefine = false) {
    let desc = findPropertyDescription(JSON_NAME_TMPL(dtoAttr), dtoClass);
    if (!desc) {
        if (skipIfNotDefine) {
            return null;
        }
        throw new Error(`Not found jsonFieldName for "${dtoAttr}" in ${JSON.stringify(dtoClass)}`);
    }
    return desc.value;
}

export function getCastTypeProp(dtoAttr, dtoClass) {
    let desc = findPropertyDescription(CAST_FN_TMPL(dtoAttr), dtoClass);
    if (!desc) {
        return null;
    }
    return desc.value;
}

export function getProperty(dataObj, fieldName, castTypeFn = null) {
    if (!castTypeFn) {
        castTypeFn = (value) => value;
    }
    if (Array.isArray(fieldName)) {
        fieldName.filter(key => {
            if (key in dataObj) {
                return castTypeFn(dataObj[key]);
            }
        });
    } else {
        return castTypeFn(dataObj[fieldName]);
    }
    return null;
}

export function getPropertyFromDto(dtoModel, dtoAttr) {
    let castFn = getCastTypeProp(dtoAttr, dtoModel);
    if (!castFn) {
        castFn = (value) => value;
    }
    if (dtoAttr in dtoModel) {
        return castFn(dtoModel[dtoAttr]);
    }
    return null;
}