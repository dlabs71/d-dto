import {DeleteMapper, GetMapper, JsonField, PostMapper, PutMapper, TypeString} from "../../../src";

export class Model {
    @JsonField("prop1") @TypeString prop1;
    @JsonField("prop2") @TypeString prop2;
    @JsonField("prop3") @TypeString prop3;
}

export class Model2 {
    @JsonField("arg1") @TypeString arg1;
    @JsonField("arg2") @TypeString arg2;
    @JsonField("arg3") @TypeString arg3;
}

export default {
    @GetMapper(Model)
    getData() {
        return new Promise(resolve => {
            resolve({
                data: {
                    prop1: "qwerty",
                    prop2: "asdfgh",
                    prop3: "zxcvbn"
                }
            });
        });
    },

    @GetMapper(Model)
    getData2() {
        return new Promise(resolve => {
            resolve({
                data: null
            });
        });
    },

    @PostMapper(Model)
    sendData(dto, arg1, arg2) {
        return new Promise(resolve => {
            dto.prop1 = arg1;
            dto.prop2 = arg2;

            resolve({
                data: dto
            });
        });
    },

    @PostMapper(Model, Model2, 1)
    sendData2(arg1, dto, arg2) {
        return new Promise(resolve => {
            dto.prop1 = arg1;
            dto.prop2 = arg2;

            resolve({
                data: {
                    arg1: "prop1",
                    arg2: "prop2",
                    arg3: "prop3"
                }
            });
        });
    },

    @PutMapper(Model, Model2, 1)
    putData(arg1, dto, arg2) {
        return new Promise(resolve => {
            dto.prop1 = arg1;
            dto.prop2 = arg2;

            resolve({
                data: {
                    arg1: "prop1",
                    arg2: "prop2",
                    arg3: "prop3"
                }
            });
        });
    },

    @DeleteMapper(Model)
    deleteData() {
        return new Promise(resolve => {
            resolve({
                data: {
                    prop1: "qwerty",
                    prop2: "asdfgh",
                    prop3: "zxcvbn"
                }
            });
        });
    }
}