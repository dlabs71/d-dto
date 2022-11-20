import {formatDateTime, isDate, str2Date, str2DateTime, valueIsComplexType} from "../../utils/utils.js";
import {DATA_TYPE} from '../../constants.js';
import {c2jMapperWrapper, j2cMapperWrapper} from "../../mappers/index.js";
import moment from "moment";

export function castSimpleType(value, type) {
    if (value === null || value === undefined) {
        return value;
    }
    if (type === DATA_TYPE.STRING) {
        if (valueIsComplexType(value)) {
            return JSON.stringify(value);
        }
        return value.toString();
    }

    if (type === DATA_TYPE.NUMBER) {
        return Number(value);
    }

    if (type === DATA_TYPE.BOOL) {
        return value.toString() === 'true'
    }

    if (type === DATA_TYPE.YES_NO) {
        return value.toString() === 'Y'
    }

    if (type === DATA_TYPE.OBJECT) {
        if (valueIsComplexType(value)) {
            return JSON.parse(JSON.stringify(value));
        }
        if (typeof value === "string") {
            let parsed;
            try {
                parsed = JSON.parse(value);
                if (parsed !== value) {
                    return parsed;
                }
            } catch (err) {
                return null;
            }
        }
        return null;
    }

    throw new Error(`Type ${type} is not supported`);
}

export function castDateType(value, type, format = null) {
    if (value === null || value === undefined) {
        return value;
    }
    if (!isDate(value, format)) {
        return null;
    }
    if (type === DATA_TYPE.DATE) {
        if (typeof value === "string") {
            return str2Date(value, format)
        }
        return moment(value);
    }

    if (type === DATA_TYPE.DATE_TIME) {
        if (typeof value === "string") {
            return str2DateTime(value, format);
        }
        return str2DateTime(formatDateTime(value), format);
    }
}

export function castCustomType(value, customClass, revert = false) {
    if (!value && !revert) {
        return j2cMapperWrapper(new customClass(), customClass);
    }

    if (revert) {
        return c2jMapperWrapper(value);
    }
    return j2cMapperWrapper(value, customClass);
}

export function castType(value, type, customClass, format, revert) {
    if (type == null) {
        throw new Error("Type for cast is null")
    }
    if (type === DATA_TYPE.CUSTOM) {
        return castCustomType(value, customClass, revert);
    }
    if ([DATA_TYPE.DATE, DATA_TYPE.DATE_TIME].includes(type)) {
        return castDateType(value, type, format);
    }

    return castSimpleType(value, type);
}