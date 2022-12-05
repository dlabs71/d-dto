import { PREFIX_PROPERTY_EX } from '../constants.js';
import { getCastTypeProp, getJsonFieldProp, getProperty } from './common.js';

/**
 * Function for mapping json object to dto class
 * @param jsonObj - source json object
 * @param DtoModel - class name for target dto
 * @param skipNotDefine - returned null, if skip json filed name which is not define in dto class
 * else threw exception
 * @returns {DtoModel} DtoModel parameter class instance
 */
export function j2cMapper(jsonObj, DtoModel, skipNotDefine = true) {
    const dto = new DtoModel();

    if (dto.beforeJ2cMapping) {
        dto.beforeJ2cMapping(jsonObj, dto);
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
        dto.afterJ2cMapping(jsonObj, dto);
    }
    return dto;
}

/**
 * Wrapper function for mapping json object to dto class
 * Set "default" to DtoModel and then the function will return the original json object
 * If jsonObj is Array, then j2cMapper function will apply to every item of this array
 *
 * @param jsonObj - source json object.
 * @param DtoModel - class name for target dto
 * @param skipNotDefine - returned null, if skip json filed name which is not define in dto class
 * else threw exception
 * @returns {DtoModel} DtoModel parameter class instance
 */
export function j2cMapperWrapper(jsonObj, DtoModel, skipNotDefine = true) {
    if (!DtoModel) {
        throw new Error('Model is required attribute!');
    }
    if (DtoModel === 'default') {
        return jsonObj;
    }
    if (!jsonObj) {
        return jsonObj;
    }
    if (Array.isArray(jsonObj)) {
        return jsonObj.map((item) => j2cMapper(item, DtoModel, skipNotDefine));
    }
    return j2cMapper(jsonObj, DtoModel, skipNotDefine);
}
