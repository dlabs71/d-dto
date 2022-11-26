export const DATA_TYPE = {
    STRING: 'string',
    NUMBER: 'number',
    DATE: 'date',
    DATE_TIME: 'dateTime',
    BOOL: 'bool',
    YES_NO: 'yesNo',
    CUSTOM: 'custom',
    OBJECT: 'object',
};

export const TMPL_PREFIX = '&_';
export const PREFIX_PROPERTY_EX = [TMPL_PREFIX, '#', '$'];

export function CAST_FN_TMPL(name) {
    return `${TMPL_PREFIX + name}_castFn`;
}

export function JSON_NAME_TMPL(name) {
    return `${TMPL_PREFIX + name}_jsonField`;
}

export const UUID_NAMESPACE = 'ced6d513-4568-4edb-afca-9be143a83c16';

export const KNOWN_FORMAT_DATE = [
    'DD.MM.YYYY',
    'DD-MM-YYYY',
    'DD/MM/YYYY',
    'YYYY-MM-DD',
];

export const KNOWN_FORMAT_DATETIME = [
    'DD.MM.YYYY HH:mm:ss',
    'DD-MM-YYYY HH:mm:ss',
    'DD/MM/YYYY HH:mm:ss',
    'YYYY-MM-DD HH:mm:ss',

    'DD.MM.YYYY HH:mm:ssZ',
    'DD-MM-YYYY HH:mm:ssZ',
    'DD/MM/YYYY HH:mm:ssZ',
    'YYYY-MM-DD HH:mm:ssZ',

    'DD.MM.YYYYTHH:mm:ss',
    'DD-MM-YYYYTHH:mm:ss',
    'DD/MM/YYYYTHH:mm:ss',
    'YYYY-MM-DDTHH:mm:ss',

    'DD.MM.YYYYTHH:mm:ssZ',
    'DD-MM-YYYYTHH:mm:ssZ',
    'DD/MM/YYYYTHH:mm:ssZ',
    'YYYY-MM-DDTHH:mm:ssZ',
];

export const DEFAULT_FORMAT_DATE = 'YYYY-MM-DD';
export const DEFAULT_FORMAT_DATETIME = 'YYYY-MM-DDTHH:mm:ssZ';
