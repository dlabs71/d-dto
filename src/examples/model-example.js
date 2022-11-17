import {JsonField, TypeBool, TypeCustom, TypeDate, TypeNumber, TypeString} from '../core/annotation'
import {BusinessDto} from "../core/common-models";

// example with afterPropertySet
class OrganizationDto {
    @JsonField("id") @TypeNumber id;
    @JsonField("code") @TypeString code;
    @JsonField("fullName") @TypeString fullName;
    @JsonField("shortName") @TypeString shortName;
    @JsonField("office") @TypeBool office;
    @JsonField("orgLevel") @TypeString orgLevel;
    @JsonField("parentId") @TypeNumber parentId;

    afterPropertySet() {
        Object.defineProperty(this, "complexName", {
            enumerable: false,
            configurable: false,
            writable: false,
            value: `(${this.shortName}) ${this.fullName}`
        });
    }
}

// example with CustomType
class CommonInfo {
    @JsonField("documentType") @TypeString type;
    @JsonField("documentStatus") @TypeString status;
    @JsonField("documentKindCode") @TypeString kindCode;
    @JsonField("documentNumber") @TypeString number;
    @JsonField("documentDate") @TypeDate date;
    @JsonField("executionDate") @TypeDate extDate;
    @JsonField("organizationId") @TypeNumber orgId;
    @JsonField("createdByOrgId") @TypeNumber createdByOrgId;
    @JsonField("comment") @TypeString comment;
}

class DocumentDto extends BusinessDto {
    @JsonField("id") @TypeNumber id;
    @JsonField("show") @TypeBool show;
    @JsonField("sectionType") @TypeString sectionType;
    @JsonField("mainBlock") @TypeCustom(CommonInfo) commonInfo = new CommonInfo();
}

// example with several name json field
class LookupElement {
    @JsonField(["value", "id"]) value;
    @JsonField(["title", "name"]) @TypeString title;

    bindValue(value) {
        this.value = value;
        return this;
    }

    bindTitle(title) {
        this.title = title;
        return this;
    }
}

export default {
    OrganizationDto,
    DocumentDto,
    LookupElement
}