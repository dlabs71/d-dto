import {PREFIX_PROPERTY_EX} from '../constants.js';
import {getJsonFieldProp, getPropertyFromDto} from './common.js';

/**
 * Function for mapping from instance of class dto to json object
 * @param dtoModel - instance of class dto
 * @param skipIfNotDefine - returned null if attribute of dto class is not tagged the
 * JsonField decorators (@JsonFiled), else threw exception
 * @returns {object} json object created from dto
 */
export function c2jMapper(dtoModel, skipIfNotDefine = false) {
    const resultJsonObj = {};

    if (dtoModel.beforeC2jMapping) {
        dtoModel.beforeC2jMapping(dtoModel, resultJsonObj);
    }

    Object.keys(dtoModel)
        .filter((item) => PREFIX_PROPERTY_EX.filter((prefix) => item.startsWith(prefix)).length === 0)
        .forEach((dtoAttr) => {
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

/**
 * Wrapper function for mapping from instance of class dto to json object
 * If dtoModel is Array, then c2jMapper function will apply to every item of this array
 *
 * @param dtoModel - instance of class dto
 * @param skipIfNotDefine - returned null if attribute of dto class is not tagged the
 * JsonField decorators (@JsonFiled), else threw exception
 * @returns {object} json object created from dto
 */
export function c2jMapperWrapper(dtoModel, skipIfNotDefine = false) {
    if (!dtoModel) {
        return dtoModel;
    }
    if (Array.isArray(dtoModel)) {
        return dtoModel.map((item) => c2jMapper(item, skipIfNotDefine));
    }
    return c2jMapper(dtoModel, skipIfNotDefine);
}
