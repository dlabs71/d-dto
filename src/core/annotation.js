import moment from 'moment';
import {mapper, model2json} from './core-mapper';
import DateHelper from './utils/date-helper';

function dateValidate(date) {
    return (date && moment(date).isValid);
}

function JsonField(fieldName) {
    return function (target, name, description) {
        Object.defineProperty(target, "#" + name + "JsonField", {
            enumerable: false,
            configurable: false,
            writable: false,
            value: fieldName
        });
        return description;
    }
}

const usingTypes = {
    string: "string",
    number: "number",
    date: "date",
    dateTime: "dateTime",
    bool: "bool",
    yesNo: "yesNo",
    custom: "custom",
    object: "object"
};

function VaTCommon(value, type, customClass, revert = false) {
    if (value === null || value === undefined) {
        if (type === usingTypes.custom && !revert) {
            return mapper(new customClass(), customClass);
        }
        return null;
    }

    if (type === usingTypes.string) {
        return String(value);
    }

    if (type === usingTypes.number) {
        return Number(value);
    }

    if (type === usingTypes.bool) {
        return String(value) === 'true'
    }

    if (type === usingTypes.yesNo) {
        if (revert) {
            return value ? 'Y' : 'N';
        }
        return String(value) === 'Y'
    }

    if (type === usingTypes.date) {
        return value;
    }

    if (type === usingTypes.dateTime) {
        return DateHelper.str2DateWithPattern(DateHelper.formatDateTime(value), "DD.MM.YYYY HH:mm:ss");
    }

    if (type === usingTypes.custom) {
        if (revert) {
            return model2json(value);
        }
        return mapper(value, customClass);
    }

    if (type === usingTypes.object) {
        if (revert) {
            return JSON.parse(JSON.stringify(value));
        }
        return JSON.parse(JSON.stringify(value));
    }
}

function TypeString(target, name, description) {
    let validateAndTransform = (value, revert = false) => {
        return VaTCommon(value, usingTypes.string, undefined, revert);
    };
    Object.defineProperty(target, "#" + name + "VaT", {
        enumerable: false,
        configurable: false,
        writable: false,
        value: validateAndTransform
    });
    return description;
}

function TypeNumber(target, name, description) {
    let validateAndTransform = (value, revert = false) => {
        return VaTCommon(value, usingTypes.number, undefined, revert);
    };
    Object.defineProperty(target, "#" + name + "VaT", {
        enumerable: false,
        configurable: false,
        writable: false,
        value: validateAndTransform
    });
    return description;
}

function TypeBool(target, name, description) {
    let validateAndTransform = (value, revert = false) => {
        return VaTCommon(value, usingTypes.bool, undefined, revert);
    };
    Object.defineProperty(target, "#" + name + "VaT", {
        enumerable: false,
        configurable: false,
        writable: false,
        value: validateAndTransform
    });
    return description;
}

function TypeYesNo(target, name, description) {
    let validateAndTransform = (value, revert = false) => {
        return VaTCommon(value, usingTypes.yesNo, undefined, revert);
    };
    Object.defineProperty(target, "#" + name + "VaT", {
        enumerable: false,
        configurable: false,
        writable: false,
        value: validateAndTransform
    });
    return description;
}


function TypeArr(type, customClass) {
    return function (target, name, description) {
        let validateAndTransform = (value, revert = false) => {
            if (!value) {
                return [];
            } else {
                let arr = Array.isArray(value) && Array.from(value);
                if (!type || arr.length === 0) {
                    return arr;
                }
                let newArr = [];
                arr.forEach(item => {
                    newArr.push(VaTCommon(item, type, customClass, revert));
                });

                return newArr;
            }
        };
        Object.defineProperty(target, "#" + name + "VaT", {
            enumerable: false,
            configurable: false,
            writable: false,
            value: validateAndTransform
        });
        return description;
    }
}

function TypeDate(target, name, description) {
    let validateAndTransform = (value, revert = false) => {
        return VaTCommon(value, usingTypes.date, undefined, revert);
    };
    Object.defineProperty(target, "#" + name + "VaT", {
        enumerable: false,
        configurable: false,
        writable: false,
        value: validateAndTransform
    });
    return description;
}

function TypeDateTime(target, name, description) {
    let validateAndTransform = (value, revert = false) => {
        return VaTCommon(value, usingTypes.dateTime, undefined, revert);
    };
    Object.defineProperty(target, "#" + name + "VaT", {
        enumerable: false,
        configurable: false,
        writable: false,
        value: validateAndTransform
    });
    return description;
}

function TypeCustom(customClass) {
    return function (target, name, description) {
        let validateAndTransform = (value, revert = false) => {
            return VaTCommon(value, usingTypes.custom, customClass, revert);
        };
        Object.defineProperty(target, "#" + name + "VaT", {
            enumerable: false,
            configurable: false,
            writable: false,
            value: validateAndTransform
        });
        return description;
    };
}

function TypeJsonObj(target, name, description) {
    let validateAndTransform = (value, revert = false) => {
        return VaTCommon(value, usingTypes.object, undefined, revert);
    };
    Object.defineProperty(target, "#" + name + "VaT", {
        enumerable: false,
        configurable: false,
        writable: false,
        value: validateAndTransform
    });
    return description;
}

export {
    JsonField,
    TypeString,
    TypeNumber,
    TypeBool,
    TypeYesNo,
    TypeArr,
    TypeDate,
    TypeDateTime,
    TypeCustom,
    TypeJsonObj
};