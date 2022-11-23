import {PREFIX_PROPERTY_EX} from "../constants.js";
import {getJsonFieldProp, getPropertyFromDto} from "./common.js";

export function c2jMapper(dtoModel, skipIfNotDefine = false) {
    let resultJsonObj = {};

    if (dtoModel.beforeC2jMapping) {
        dtoModel.beforeC2jMapping(dtoModel, resultJsonObj);
    }

    Object.keys(dtoModel)
        .filter(item => {
            return PREFIX_PROPERTY_EX.filter(prefix => item.startsWith(prefix)).length === 0;
        })
        .forEach(dtoAttr => {
            let jsonFieldName = getJsonFieldProp(dtoAttr, dtoModel, skipIfNotDefine);
            if (!jsonFieldName) {
                return;
            }
            if (Array.isArray(jsonFieldName)) {
                jsonFieldName = jsonFieldName[0];
            }

            resultJsonObj[jsonFieldName] = getPropertyFromDto(dtoModel, dtoAttr);
        });

    if (dtoModel.afterC2jMapping) {
        dtoModel.afterC2jMapping(dtoModel, resultJsonObj);
    }
    return resultJsonObj;
}

export function c2jMapperWrapper(dtoModel, skipIfNotDefine = false) {
    if (!dtoModel) {
        return dtoModel;
    }
    if (Array.isArray(dtoModel)) {
        return dtoModel.map(item => {
            return c2jMapper(item, skipIfNotDefine);
        });
    }
    return c2jMapper(dtoModel, skipIfNotDefine);
}