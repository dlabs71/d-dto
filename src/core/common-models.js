import {JsonField, TypeDateTime, TypeNumber, TypeString} from "./annotation";
import {mapper, model2json} from "../core/core-mapper";

class ModelExtension {

    $clone() {
        let jsonObj = model2json(this);
        return mapper(jsonObj, this.constructor);
    }

    $toString() {
        return JSON.stringify(model2json(this));
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
