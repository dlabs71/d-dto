import moment from 'moment';

export function str2Date(value, pattern) {
    return moment(value, pattern, true);
}

export function formatDateTime(dateTime) {
    return dateTime ? moment(new Date(String(dateTime))).format('DD.MM.YYYY HH:mm:ss') : null;
}

export function validate(date) {
    return date && moment(date).isValid();
}
