import { castDateType, castSimpleType } from './common.js';
import { CAST_FN_TMPL, DATA_TYPE } from '../../constants.js';

/**
 * Decorator for a class field that means the type value must be a string
 * @param target - target class
 * @param name - field name
 * @param description - description property class field
 * @returns {*} - decorator function
 */
export function TypeString(target, name, description) {
    const castType = (value, revert = false) => castSimpleType(value, DATA_TYPE.STRING, revert);
    Object.defineProperty(target, CAST_FN_TMPL(name), {
        enumerable: false,
        configurable: false,
        writable: false,
        value: castType,
    });
    return description;
}

/**
 * Decorator for a class field that means the type value must be a number
 * @param target - target class
 * @param name - field name
 * @param description - description property class field
 * @returns {*} - decorator function
 */
export function TypeNumber(target, name, description) {
    const castType = (value, revert = false) => castSimpleType(value, DATA_TYPE.NUMBER, revert);
    Object.defineProperty(target, CAST_FN_TMPL(name), {
        enumerable: false,
        configurable: false,
        writable: false,
        value: castType,
    });
    return description;
}

/**
 * Decorator for a class field that means the type value must be a boolean
 * @param target - target class
 * @param name - field name
 * @param description - description property class field
 * @returns {*} - decorator function
 */
export function TypeBool(target, name, description) {
    const castType = (value, revert = false) => castSimpleType(value, DATA_TYPE.BOOL, revert);
    Object.defineProperty(target, CAST_FN_TMPL(name), {
        enumerable: false,
        configurable: false,
        writable: false,
        value: castType,
    });
    return description;
}

/**
 * Decorator for a class field that means the type value must be a string "Y" or "N"
 * @param target - target class
 * @param name - field name
 * @param description - description property class field
 * @returns {*} - decorator function
 */
export function TypeYesNo(target, name, description) {
    const castType = (value, revert = false) => castSimpleType(value, DATA_TYPE.YES_NO, revert);
    Object.defineProperty(target, CAST_FN_TMPL(name), {
        enumerable: false,
        configurable: false,
        writable: false,
        value: castType,
    });
    return description;
}

/**
 * Decorator for a class field that means the type value must be a date
 * @param format - string format date. The format is used from the moment library
 * @param l10n - date localization (en, ru, ...)
 * @returns {function} - decorator function
 */
export function TypeDate(format = null, l10n = 'en') {
    return (target, name, description) => {
        const castType = (value, revert = false) => castDateType(value, DATA_TYPE.DATE, format, l10n, revert);
        Object.defineProperty(target, CAST_FN_TMPL(name), {
            enumerable: false,
            configurable: false,
            writable: false,
            value: castType,
        });
        return description;
    };
}

/**
 * Decorator for a class field that means the type value must be a datetime
 * @param format - string format datetime. The format is used from the moment library
 * @param l10n - date localization (en, ru, ...)
 * @returns {function} - decorator function
 */
export function TypeDateTime(format = null, l10n = 'en') {
    return (target, name, description) => {
        const castType = (value, revert = false) => castDateType(
            value,
            DATA_TYPE.DATE_TIME,
            format,
            l10n,
            revert,
        );
        Object.defineProperty(target, CAST_FN_TMPL(name), {
            enumerable: false,
            configurable: false,
            writable: false,
            value: castType,
        });
        return description;
    };
}
