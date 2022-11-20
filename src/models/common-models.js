import {c2jMapperWrapper, j2cMapperWrapper} from "../core/mappers";
import {JsonField, TypeDateTime, TypeNumber, TypeString} from "../core/model-decorators";

class ModelExtension {

    $clone() {
        let jsonObj = c2jMapperWrapper(this);
        return j2cMapperWrapper(jsonObj, this.constructor);
    }

    $toString() {
        return JSON.stringify(c2jMapperWrapper(this));
    }

    $equals(model) {
        return this.$toString() === model.$toString();
    }
}

class BusinessDto extends ModelExtension {
    @JsonField("createdBy") @TypeString createdBy;
    @JsonField("creationDate") @TypeDateTime creationDate;
    @JsonField("lastUpdatedBy") @TypeString lastUpdatedBy;
    @JsonField("lastUpdateDate") @TypeDateTime lastUpdateDate;
    @JsonField("version") @TypeNumber version;
}

export {BusinessDto, ModelExtension}
