import { castDateType, castSimpleType } from './common.js';
import { CAST_FN_TMPL, DATA_TYPE } from '../../constants.js';

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

export function TypeDate(format = null) {
    return (target, name, description) => {
        const castType = (value, revert = false) => castDateType(value, DATA_TYPE.DATE, format, revert);
        Object.defineProperty(target, CAST_FN_TMPL(name), {
            enumerable: false,
            configurable: false,
            writable: false,
            value: castType,
        });
        return description;
    };
}

export function TypeDateTime(format = null) {
    return (target, name, description) => {
        const castType = (value, revert = false) => castDateType(value, DATA_TYPE.DATE_TIME, format, revert);
        Object.defineProperty(target, CAST_FN_TMPL(name), {
            enumerable: false,
            configurable: false,
            writable: false,
            value: castType,
        });
        return description;
    };
}
