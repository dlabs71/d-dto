import moment from 'moment';
import { KNOWN_FORMAT_DATE, KNOWN_FORMAT_DATETIME } from '../constants.js';

function _str2Date(value, defaultFormats, format = null) {
    if (!format) {
        /* eslint-disable-next-line */
        for (const _format of defaultFormats) {
            const date = moment(value, _format, true);
            const valid = date.isValid();
            if (valid) {
                return date;
            }
        }
        throw new Error(`Value = ${value} is not a valid date time`);
    }
    return moment(value, format, true);
}

export function str2Date(value, format = null) {
    return _str2Date(value, KNOWN_FORMAT_DATE, format);
}

export function str2DateTime(value, format = null) {
    return _str2Date(value, [...KNOWN_FORMAT_DATETIME, ...KNOWN_FORMAT_DATE], format);
}

export function formatDateTime(dateValue, format = null) {
    return dateValue ? moment(dateValue).format(format) : null;
}

export function validate(date) {
    return date && moment(date).isValid();
}

export function isDate(date, format = null) {
    if (!date) {
        return false;
    }
    if (typeof date === 'string') {
        try {
            return str2DateTime(date, format).isValid();
        } catch (err) {
            return false;
        }
    }
    if (moment.isMoment(date)) {
        return date.isValid();
    }
    if (moment.isDate(date)) {
        return moment(date).isValid();
    }
    return false;
}

export function valueIsComplexType(value) {
    return Array.isArray(value) || typeof value === 'object';
}
