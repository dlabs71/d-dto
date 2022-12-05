import { castCustomType, castSimpleType, castType } from './common.js';
import { CAST_FN_TMPL, DATA_TYPE } from '../../constants.js';

/**
 * Decorator for a class field that means the type value must be a custom class (dto class)
 * @param customClass - dto class
 * @returns {function} decorator function
 */
export function TypeCustom(customClass) {
    return (target, name, description) => {
        const castTypeFn = (value, revert = false) => castCustomType(value, customClass, revert);
        Object.defineProperty(target, CAST_FN_TMPL(name), {
            enumerable: false,
            configurable: false,
            writable: false,
            value: castTypeFn,
        });
        return description;
    };
}

/**
 * Decorator function for a class field that means the type value must be a simple JS object
 * @param target - target class
 * @param name - field name
 * @param description - description property class field
 * @returns {*} - decorator function
 */
export function TypeJsonObj(target, name, description) {
    const castTypeFn = (value, revert = false) => castSimpleType(value, DATA_TYPE.OBJECT, revert);
    Object.defineProperty(target, CAST_FN_TMPL(name), {
        enumerable: false,
        configurable: false,
        writable: false,
        value: castTypeFn,
    });
    return description;
}

/**
 * Decorator function for a class field that means the type value must be an array
 * @param type - type item array {@see DATA_TYPE}
 * @param customClass - dto class if type is "custom"
 * @param format - string format date/datetime. The format is used from the moment library
 * @returns {function} - decorator function
 */
export function TypeArr(type, customClass, format) {
    return (target, name, description) => {
        const castTypeFn = (value, revert = false) => {
            if (!value || !Array.isArray(value)) {
                return [];
            }
            const arr = Array.from(value);
            if (!type || arr.length === 0) {
                return arr;
            }
            return arr.map((item) => castType(item, type, customClass, format, revert));
        };
        Object.defineProperty(target, CAST_FN_TMPL(name), {
            enumerable: false,
            configurable: false,
            writable: false,
            value: castTypeFn,
        });
        return description;
    };
}
