import moment from 'moment';

export default {
    str2DateWithPattern(value, pattern) {
        const parsedDate = moment(value, pattern, true);
        return parsedDate.isValid() ? moment(parsedDate.toDate()) : null;
    },
    formatDateTime(dateTime) {
        return dateTime ? moment(new Date(String(dateTime))).format('DD.MM.YYYY HH:mm:ss') : null;
    }
};
