import { JSON_NAME_TMPL } from '../constants.js';

/**
 * Decorator function for a class field that store json field name
 * @param fieldName - name in json
 * @returns {function} - decorator function
 */
export function JsonField(fieldName) {
    return (targetObject, name, description) => {
        Object.defineProperty(targetObject, JSON_NAME_TMPL(name), {
            enumerable: false,
            configurable: false,
            writable: false,
            value: fieldName,
        });
        return description;
    };
}
