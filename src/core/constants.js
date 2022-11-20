export const DATA_TYPE = {
    STRING: "string",
    NUMBER: "number",
    DATE: "date",
    DATE_TIME: "dateTime",
    BOOL: "bool",
    YES_NO: "yesNo",
    CUSTOM: "custom",
    OBJECT: "object"
};

export const TMPL_PREFIX = "&_";
export const PREFIX_PROPERTY_EX = [TMPL_PREFIX, "#", "$"];

export function CAST_FN_TMPL(name) {
    return TMPL_PREFIX + name + "_castFn";
}

export function JSON_NAME_TMPL(name) {
    return TMPL_PREFIX + name + "_jsonField";
}

export const UUID_NAMESPACE = "ced6d513-4568-4edb-afca-9be143a83c16";