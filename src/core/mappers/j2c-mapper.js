import { PREFIX_PROPERTY_EX } from '../constants.js';
import { getCastTypeProp, getJsonFieldProp, getProperty } from './common.js';

export function j2cMapper(jsonObj, DtoModel, skipNotDefine = false) {
    const dto = new DtoModel();

    if (dto.beforeJ2cMapping) {
        dto.beforeJ2cMapping(jsonObj, DtoModel);
    }

    Object.keys(dto)
        .filter((item) => PREFIX_PROPERTY_EX.filter((prefix) => item.startsWith(prefix)).length === 0)
        .forEach((dtoAttr) => {
            const jsonFieldName = getJsonFieldProp(dtoAttr, DtoModel, skipNotDefine);
            if (!jsonFieldName) {
                return;
            }

            const castFn = getCastTypeProp(dtoAttr, DtoModel);
            dto[dtoAttr] = getProperty(jsonObj, jsonFieldName, castFn);
        });

    if (dto.afterJ2cMapping) {
        dto.afterJ2cMapping(jsonObj, DtoModel);
    }
    return dto;
}

export function j2cMapperWrapper(jsonObj, dtoModel, skipNotDefine = false) {
    if (!dtoModel) {
        throw new Error('Model is required attribute!');
    }
    if (dtoModel === 'default') {
        return jsonObj;
    }
    if (!jsonObj) {
        return jsonObj;
    }
    if (Array.isArray(jsonObj)) {
        return jsonObj.map((item) => j2cMapper(item, dtoModel, skipNotDefine));
    }
    return j2cMapper(jsonObj, dtoModel, skipNotDefine);
}
