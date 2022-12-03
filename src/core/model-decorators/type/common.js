import moment from 'moment';
import {
    formatDateTime, isDate, str2Date, str2DateTime, valueIsComplexType,
} from '../../utils/utils.js';
import { DATA_TYPE, DEFAULT_FORMAT_DATE, DEFAULT_FORMAT_DATETIME } from '../../constants.js';
import { c2jMapperWrapper, j2cMapperWrapper } from '../../mappers/index.js';

/**
 * Function for type cast simple type: string, number, boolean, custom YES/NO type, object
 * @param value - data for cast to type from "type" parameter
 * @param type - type for cast {@see DATA_TYPE}
 * @param revert - if false then standard value conversion occurs otherwise reverse cast
 * for json format occurs if required
 * @returns {*} converted value
 */
export function castSimpleType(value, type, revert = false) {
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
        return value.toString() === 'true';
    }

    if (type === DATA_TYPE.YES_NO) {
        if (revert) {
            return ['true', 'Y', '1'].includes(value.toString()) ? 'Y' : 'N';
        }
        return value.toString() === 'Y';
    }

    if (type === DATA_TYPE.OBJECT) {
        if (valueIsComplexType(value)) {
            return JSON.parse(JSON.stringify(value));
        }
        if (typeof value === 'string') {
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

/**
 * Function for cast date and datetime type
 * @param value - data for cast to type from "type" parameter
 * @param type - type for cast {@see DATA_TYPE.DATE} {@see DATA_TYPE.DATE_TIME}
 * @param format - string format date/datetime. The format is used from the moment library
 * @returns {moment.Moment|null} date value
 * @private
 */
function _castDateType(value, type, format = null) {
    if (value === null || value === undefined) {
        return value;
    }
    if (!isDate(value, format)) {
        return null;
    }
    if (type === DATA_TYPE.DATE) {
        if (typeof value === 'string') {
            return str2Date(value, format);
        }
        return moment(value);
    }

    if (type === DATA_TYPE.DATE_TIME) {
        if (typeof value === 'string') {
            return str2DateTime(value, format);
        }
        return str2DateTime(formatDateTime(value), format);
    }
    return null;
}

/**
 * Function for cast date and datetime type for json format
 * @param value - data for cast to type from "type" parameter
 * @param type - type for cast {@see DATA_TYPE.DATE} {@see DATA_TYPE.DATE_TIME}
 * @param format - string format date/datetime. The format is used from the moment library
 * @returns {string|null} string date value
 * @private
 */
function _castDateTypeRevert(value, type, format = null) {
    if (value === null || value === undefined) {
        return null;
    }
    if (!isDate(value, format)) {
        return null;
    }
    if (typeof value === 'string') {
        return value;
    }

    if (type === DATA_TYPE.DATE) {
        return moment(value).format(format || DEFAULT_FORMAT_DATE);
    }

    if (type === DATA_TYPE.DATE_TIME) {
        return moment(value).format(format || DEFAULT_FORMAT_DATETIME);
    }
    return null;
}

/**
 * Function for cast date and datetime type {@see _castDateType}, {@see _castDateTypeRevert}
 * @param value - data for cast to type from "type" parameter
 * @param type - type for cast {@see DATA_TYPE.DATE} {@see DATA_TYPE.DATE_TIME}
 * @param format - string format date/datetime. The format is used from the moment library
 * @param revert - if true use _castDateTypeRevert function {@see _castDateTypeRevert}
 * else _castDateType function {@see _castDateType}
 * @returns {moment.Moment|string|null} converted value
 */
export function castDateType(value, type, format = null, revert = false) {
    if (revert) {
        return _castDateTypeRevert(value, type, format);
    }
    return _castDateType(value, type, format);
}

/**
 * Function for convert json to dto class instance or vice versa
 * @param value - data for convert (json or dto class instance)
 * @param CustomClass - dto class for convert from json
 * @param revert - if false then value must to be json else value must to be dto class instance
 * @returns {CustomClass|object}
 * if revert parameter is false then function return dto class instance
 * if revert parameter is true then function return JS object (JSON)
 */
export function castCustomType(value, CustomClass, revert = false) {
    // todo deprecated approach
    // if (!value && !revert) {
    //     return j2cMapperWrapper(new CustomClass(), CustomClass);
    // }

    if (revert) {
        return c2jMapperWrapper(value);
    }
    return j2cMapperWrapper(value, CustomClass);
}

/**
 * Universal function for cast any type value.
 * Function union next functions: {@see castSimpleType}, {@see castDateType}, {@see castCustomType}
 * @param value - data for convert
 * @param type - type for cast {@see DATA_TYPE}
 * @param customClass - dto class for convert from json
 * @param format - string format date/datetime. The format is used from the moment library
 * @param revert - if false then standard value conversion occurs otherwise reverse cast
 * for json format occurs if required
 * @returns {*} - data value after converting
 */
export function castType(value, type, customClass, format = null, revert = false) {
    if (type == null) {
        throw new Error('Type for cast is null');
    }
    if (type === DATA_TYPE.CUSTOM) {
        return castCustomType(value, customClass, revert);
    }
    if ([DATA_TYPE.DATE, DATA_TYPE.DATE_TIME].includes(type)) {
        return castDateType(value, type, format, revert);
    }

    return castSimpleType(value, type, revert);
}
