import {JSON_NAME_TMPL} from "../constants.js";

export function JsonField(fieldName) {
    return (targetObject, name, description) => {
        Object.defineProperty(targetObject, JSON_NAME_TMPL(name), {
            enumerable: false,
            configurable: false,
            writable: false,
            value: fieldName
        });
        return description;
    }
}