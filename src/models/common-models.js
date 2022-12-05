import { c2jMapperWrapper, j2cMapperWrapper } from '../core/mappers/index.js';
import {
    JsonField, TypeDateTime, TypeNumber, TypeString,
} from '../core/model-decorators/index.js';

/**
 * Class with helper method for dto class
 */
class ModelExtension {
    /**
     * Clone the dto
     * @returns {DtoModel}
     */
    $clone() {
        const jsonObj = c2jMapperWrapper(this);
        return j2cMapperWrapper(jsonObj, this.constructor);
    }

    /**
     * Create json string from the dto
     * @returns {string}
     */
    $toString() {
        return JSON.stringify(c2jMapperWrapper(this));
    }

    /**
     * Method for equal two dto
     * @param model - other dto
     * @returns {boolean}
     */
    $equals(model) {
        return this.$toString() === model.$toString();
    }
}

/**
 * Basic dto with service fields
 */
class BusinessDto extends ModelExtension {
    @JsonField('createdBy') @TypeString createdBy;

    @JsonField('creationDate') @TypeDateTime creationDate;

    @JsonField('lastUpdatedBy') @TypeString lastUpdatedBy;

    @JsonField('lastUpdateDate') @TypeDateTime lastUpdateDate;

    @JsonField('version') @TypeNumber version;
}

export { BusinessDto, ModelExtension };
