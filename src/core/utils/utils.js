import moment from 'moment';
import { KNOWN_FORMAT_DATE, KNOWN_FORMAT_DATETIME } from '../constants.js';

/**
 * Function for converting string to date/datetime (instance of moment library) {@see moment.Moment})
 * @param value - string date/datetime
 * @param defaultFormats - date/datetime formats that are known
 * @param format - date/datetime format for the string value of the value parameter
 * @returns {moment.Moment} - Parsed date/datetime from string parameter value (instance of moment library)
 * @private
 */
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

/**
 * Function for converting string to date (instance of moment library) {@see moment.Moment}).
 * The _str2Date {@see _str2Date} method is used with default formats from a constant {@see KNOWN_FORMAT_DATE}
 * @param value - string date
 * @param format - date format for the string value of the value parameter
 * @returns {moment.Moment} - Parsed date from string parameter value (instance of moment library)
 */
export function str2Date(value, format = null) {
    return _str2Date(value, KNOWN_FORMAT_DATE, format);
}

/**
 * Function for converting string to datetime (instance of moment library) {@see moment.Moment}).
 * The _str2Date {@see _str2Date} method is used with default formats
 * from a constant {@see KNOWN_FORMAT_DATETIME} and {@see KNOWN_FORMAT_DATE}
 * @param value - string datetime
 * @param format - datetime format for the string value of the value parameter
 * @returns {moment.Moment} - Parsed datetime from string parameter value (instance of moment library)
 */
export function str2DateTime(value, format = null) {
    return _str2Date(value, [...KNOWN_FORMAT_DATETIME, ...KNOWN_FORMAT_DATE], format);
}

/**
 * Function for converting date/datetime to string
 * @param dateValue - date or datetime
 * @param format - date/datetime format to which you want to convert the parameter dateValue
 * @returns {string|null} - date string value
 */
export function formatDateTime(dateValue, format = null) {
    return dateValue ? moment(dateValue).format(format) : null;
}

/**
 * Function to determine if a parameter is a date or not
 * @param date - parameter for checking. String, Date or Moment
 * @param format - date/datetime format for the string value of the date parameter
 * @returns {boolean} - boolean value of checking result
 */
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

/**
 * Function to determine if a parameter is a complex type (Array, Object) or not
 * @param value - parameter for checking
 * @returns {boolean} - boolean value of checking result
 */
export function valueIsComplexType(value) {
    return Array.isArray(value) || typeof value === 'object';
}
