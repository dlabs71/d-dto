import {mapper, model2json} from "../../mappers/core-mapper";
import {formatDateTime, str2Date} from "../../utils/date-utils";
import {DATA_TYPE} from '../../constants';

export function castSimpleType(value, type) {
    if (type === DATA_TYPE.STRING) {
        return String(value);
    }

    if (type === DATA_TYPE.NUMBER) {
        return Number(value);
    }

    if (type === DATA_TYPE.BOOL) {
        return String(value) === 'true'
    }

    if (type === DATA_TYPE.YES_NO) {
        return String(value) === 'Y'
    }

    if (type === DATA_TYPE.OBJECT) {
        return JSON.parse(JSON.stringify(value));
    }

    throw new Error(`Type ${type} is not supported`);
}

export function castDateType(value, type, format = "DD.MM.YYYY HH:mm:ss") {
    if (type === DATA_TYPE.DATE) {
        return value;
    }

    if (type === DATA_TYPE.DATE_TIME) {
        return str2Date(formatDateTime(value), format);
    }
}

export function castCustomType(value, customClass, revert = false) {
    if (!value && !revert) {
        return mapper(new customClass(), customClass);
    }

    if (revert) {
        return model2json(value);
    }
    return mapper(value, customClass);
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