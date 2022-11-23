import {PREFIX_PROPERTY_EX} from "../constants.js";
import {getCastTypeProp, getJsonFieldProp, getProperty} from "./common.js";

export function j2cMapper(jsonObj, dtoModel, skipNotDefine = false) {
    let dto = new dtoModel();

    if (dto.beforeJ2cMapping) {
        dto.beforeJ2cMapping(jsonObj, dtoModel);
    }

    Object.keys(dto)
        .filter(item => {
            return PREFIX_PROPERTY_EX.filter(prefix => item.startsWith(prefix)).length === 0;
        })
        .forEach(dtoAttr => {
            let jsonFieldName = getJsonFieldProp(dtoAttr, dtoModel, skipNotDefine);
            if (!jsonFieldName) {
                return;
            }

            let castFn = getCastTypeProp(dtoAttr, dtoModel);
            dto[dtoAttr] = getProperty(jsonObj, jsonFieldName, castFn);
        });

    if (dto.afterJ2cMapping) {
        dto.afterJ2cMapping(jsonObj, dtoModel);
    }
    return dto;
}

export function j2cMapperWrapper(jsonObj, dtoModel, skipNotDefine = false) {
    if (!dtoModel) {
        throw new Error("Model is required attribute!")
    }
    if ("default" === dtoModel) {
        return jsonObj;
    }
    if (!jsonObj) {
        return jsonObj;
    }
    if (Array.isArray(jsonObj)) {
        return jsonObj.map(item => {
            return j2cMapper(item, dtoModel, skipNotDefine);
        });
    }
    return j2cMapper(jsonObj, dtoModel, skipNotDefine);
}