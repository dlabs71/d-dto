import { castCustomType, castSimpleType, castType } from './common.js';
import { CAST_FN_TMPL, DATA_TYPE } from '../../constants.js';

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
