import {castDateType, castSimpleType} from "./common.js";
import {CAST_FN_TMPL, DATA_TYPE} from "../../constants.js";

export function TypeString(target, name, description) {
    let castType = (value) => {
        return castSimpleType(value, DATA_TYPE.STRING);
    };
    Object.defineProperty(target, CAST_FN_TMPL(name), {
        enumerable: false,
        configurable: false,
        writable: false,
        value: castType
    });
    return description;
}

export function TypeNumber(target, name, description) {
    let castType = (value) => {
        return castSimpleType(value, DATA_TYPE.NUMBER);
    };
    Object.defineProperty(target, CAST_FN_TMPL(name), {
        enumerable: false,
        configurable: false,
        writable: false,
        value: castType
    });
    return description;
}

export function TypeBool(target, name, description) {
    let castType = (value) => {
        return castSimpleType(value, DATA_TYPE.BOOL);
    };
    Object.defineProperty(target, CAST_FN_TMPL(name), {
        enumerable: false,
        configurable: false,
        writable: false,
        value: castType
    });
    return description;
}

export function TypeYesNo(target, name, description) {
    let castType = (value) => {
        return castSimpleType(value, DATA_TYPE.YES_NO);
    };
    Object.defineProperty(target, CAST_FN_TMPL(name), {
        enumerable: false,
        configurable: false,
        writable: false,
        value: castType
    });
    return description;
}

export function TypeDate(target, name, description) {
    let castType = (value, format) => {
        return castDateType(value, DATA_TYPE.DATE, format);
    };
    Object.defineProperty(target, CAST_FN_TMPL(name), {
        enumerable: false,
        configurable: false,
        writable: false,
        value: castType
    });
    return description;
}

export function TypeDateTime(target, name, description) {
    let castType = (value, format) => {
        return castDateType(value, DATA_TYPE.DATE_TIME, format);
    };
    Object.defineProperty(target, CAST_FN_TMPL(name), {
        enumerable: false,
        configurable: false,
        writable: false,
        value: castType
    });
    return description;
}