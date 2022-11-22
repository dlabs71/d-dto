import {castCustomType, castSimpleType, castType} from "./common.js";
import {CAST_FN_TMPL, DATA_TYPE} from "../../constants.js";

export function TypeCustom(customClass) {
    return function (target, name, description) {
        let castType = (value, revert = false) => {
            return castCustomType(value, customClass, revert);
        };
        Object.defineProperty(target, CAST_FN_TMPL(name), {
            enumerable: false,
            configurable: false,
            writable: false,
            value: castType
        });
        return description;
    };
}

export function TypeJsonObj(target, name, description) {
    let castType = (value, revert = false) => {
        return castSimpleType(value, DATA_TYPE.OBJECT, revert);
    };
    Object.defineProperty(target, CAST_FN_TMPL(name), {
        enumerable: false,
        configurable: false,
        writable: false,
        value: castType
    });
    return description;
}

export function TypeArr(type, customClass, format) {
    return function (target, name, description) {
        let castTypeFn = (value, revert = false) => {
            if (!value || !Array.isArray(value)) {
                return [];
            } else {
                let arr = Array.from(value);
                if (!type || arr.length === 0) {
                    return arr;
                }
                return arr.map(item => {
                    return castType(item, type, customClass, format, revert);
                });
            }
        };
        Object.defineProperty(target, CAST_FN_TMPL(name), {
            enumerable: false,
            configurable: false,
            writable: false,
            value: castTypeFn
        });
        return description;
    }
}