import {CAST_FN_TMPL, JSON_NAME_TMPL} from '../constants.js';

/**
 * Function for finding class property descriptor
 * @param attrName - name of class attribute
 * @param clazz - The class in which the property descriptor will be searched
 * @returns {PropertyDescriptor|null} - Property descriptor of the attrName parameter
 */
export function findPropertyDescriptor(attrName, clazz) {
    let proto = clazz.prototype || Object.getPrototypeOf(clazz);
    let attrDescription = Object.getOwnPropertyDescriptor(proto, attrName);
    if (!attrDescription) {
        proto = Object.getPrototypeOf(proto);
        while (!attrDescription && !!proto) {
            attrDescription = Object.getOwnPropertyDescriptor(proto, attrName);
            if (attrDescription) {
                break;
            }
            proto = Object.getPrototypeOf(proto);
        }
    }
    return attrDescription || null;
}

/**
 * Finding a hidden property whose value contains the name of the json field.
 * @param dtoAttr - Attribute of a dto class
 * @param dtoClass - Class of the dto
 * @param skipIfNotDefine - returned null if attribute of dto class is not tagged the
 * JsonField decorators (@JsonFiled), else threw exception
 * @returns {string|null} - json field name. Value from @JsonFiled decorator
 */
export function getJsonFieldProp(dtoAttr, dtoClass, skipIfNotDefine = false) {
    const desc = findPropertyDescriptor(JSON_NAME_TMPL(dtoAttr), dtoClass);
    if (!desc) {
        if (skipIfNotDefine) {
            return null;
        }

        const className = dtoClass.name || (typeof dtoClass === 'object' && JSON.stringify(dtoClass)) || dtoClass;
        throw new Error(`Not found jsonFieldName for "${dtoAttr}" in ${className}`);
    }
    return desc.value;
}

/**
 * Finding a hidden property whose value contains the function of casting type
 * @param dtoAttr - Attribute of a dto class
 * @param dtoClass - Class of the dto
 * @returns {null|function} - function of casting type
 */
export function getCastTypeProp(dtoAttr, dtoClass) {
    const desc = findPropertyDescriptor(CAST_FN_TMPL(dtoAttr), dtoClass);
    if (!desc) {
        return null;
    }
    return desc.value;
}

/**
 * Function to get value of json field and cast to that value type
 * @param dataObj - source json object
 * @param fieldName - json field name
 * @param castTypeFn - function for cast json value type. If null then function return source json field value
 * @returns {null|*} - json field value after type cast
 */
export function getProperty(dataObj, fieldName, castTypeFn = null) {
    if (!castTypeFn) {
        castTypeFn = (value) => value;
    }
    if (Array.isArray(fieldName)) {
        /* eslint-disable-next-line */
        for (const key of fieldName) {
            if (key in dataObj) {
                return castTypeFn(dataObj[key]);
            }
        }
    } else {
        return castTypeFn(dataObj[fieldName]);
    }
    return null;
}

/**
 * Function to get value of dto field and revert cast to that value type
 * @param dtoModel - instance of dto class
 * @param dtoAttr - dto attribute name
 * @returns {null|*} - dto attribute value after reverting type cast
 */
export function getPropertyFromDto(dtoModel, dtoAttr) {
    let castFn = getCastTypeProp(dtoAttr, dtoModel);
    if (!castFn) {
        castFn = (value) => value;
    }
    if (dtoAttr in dtoModel) {
        return castFn(dtoModel[dtoAttr], true);
    }
    return null;
}
