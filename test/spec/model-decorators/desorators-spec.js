import {
    DATA_TYPE,
    JsonField,
    TypeArr,
    TypeBool,
    TypeCustom,
    TypeDate,
    TypeDateTime,
    TypeJsonObj,
    TypeNumber,
    TypeString,
    TypeYesNo
} from "../../../src";
import moment from "moment";

function testTypeDecorator(modelClass, nameProperty = "&_data_castFn") {
    let model = new modelClass();
    expect(model.__proto__[nameProperty]).toBeDefined();
    let descriptor = Object.getOwnPropertyDescriptor(model.__proto__, nameProperty);
    expect(descriptor.configurable).toEqual(false);
    expect(descriptor.enumerable).toEqual(false);
    expect(descriptor.writable).toEqual(false);
}

describe("model decorator tests. Decorators", () => {

    it("simple decorator STRING", () => {
        class Model {
            @TypeString data;
        }

        testTypeDecorator(Model);
        let model = new Model();
        expect(model["&_data_castFn"]("qwerty")).toEqual("qwerty");
    });

    it("simple decorator NUMBER", () => {
        class Model {
            @TypeNumber data;
        }

        testTypeDecorator(Model);
        let model = new Model();
        expect(model["&_data_castFn"](123)).toEqual(123);
    });

    it("simple decorator BOOL", () => {
        class Model {
            @TypeBool data;
        }

        testTypeDecorator(Model);
        let model = new Model();
        expect(model["&_data_castFn"](true)).toEqual(true);
    });

    it("simple decorator YES_NO", () => {
        class Model {
            @TypeYesNo data;
        }

        testTypeDecorator(Model);
        let model = new Model();
        expect(model["&_data_castFn"]("Y")).toEqual(true);
    });

    it("simple decorator DATE", () => {
        class Model {
            @TypeDate data;
        }

        testTypeDecorator(Model);
        let model = new Model();
        expect(model["&_data_castFn"]("2022-01-01").format())
            .toEqual(moment("2022-01-01", "YYYY-MM-DD").format());
    });

    it("simple decorator DATETIME", () => {
        class Model {
            @TypeDateTime data;
        }

        testTypeDecorator(Model);
        let model = new Model();
        expect(model["&_data_castFn"]("2022-01-01T20:01:02").format())
            .toEqual(moment("2022-01-01T20:01:02", "YYYY-MM-DDTHH:mm:ss").format());
    });

    it("complex decorator OBJECT", () => {
        class Model {
            @TypeJsonObj data;
        }

        testTypeDecorator(Model);
        let model = new Model();
        expect(model["&_data_castFn"]({a: "qwerty"})).toEqual({a: "qwerty"});
    });

    it("complex decorator CUSTOM", () => {
        class CustomModel {
            @JsonField("property") @TypeString property;
        }

        class Model {
            @JsonField("data") @TypeCustom(CustomModel) data;
        }

        testTypeDecorator(Model);
        let model = new Model();
        let jsonObject = {
            property: "qwerty"
        }
        let casted = model["&_data_castFn"](jsonObject);
        expect(casted).toBeInstanceOf(CustomModel);
        expect(casted.property).toEqual("qwerty");
    });

    it("complex decorator ARRAY STRING", () => {
        class Model {
            @JsonField("data") @TypeArr(DATA_TYPE.STRING) data;
        }

        testTypeDecorator(Model);
        let model = new Model();
        let stringArr = ["qwerty", "asdfghj", "zxcvbn"];
        let casted = model["&_data_castFn"](stringArr);
        expect(casted).toBeInstanceOf(Array);
        expect(casted.length).toEqual(3);
        expect(casted[0]).toEqual("qwerty");
    });

    it("complex decorator ARRAY DATETIME", () => {
        class Model {
            @JsonField("data") @TypeArr(DATA_TYPE.DATE_TIME, null, "D/M/YY HH:mm") data;
        }

        testTypeDecorator(Model);
        let model = new Model();
        let datetimeArr = ["2/3/22 23:03", "1/2/22 23:03", "4/4/22 23:03"];
        let casted = model["&_data_castFn"](datetimeArr);
        expect(casted).toBeInstanceOf(Array);
        expect(casted.length).toEqual(3);
        expect(casted[0].format("D/M/YY HH:mm")).toEqual("2/3/22 23:03");
    });

    it("complex decorator ARRAY CUSTOM", () => {
        class CustomModel {
            @JsonField("property") @TypeString property;
        }

        class Model {
            @JsonField("data") @TypeArr(DATA_TYPE.CUSTOM, CustomModel) data;
        }

        testTypeDecorator(Model);
        let model = new Model();
        let customArr = [{property: "qwerty"}, {property: "asdfgh"}, {property: "zxcvbn"}];
        let casted = model["&_data_castFn"](customArr);
        expect(casted).toBeInstanceOf(Array);
        expect(casted.length).toEqual(3);
        expect(casted[0].property).toEqual("qwerty");
    });

    it("decorator JsonField", () => {
        class Model {
            @JsonField("result_data") data;
        }

        testTypeDecorator(Model, "&_data_jsonField");
        let model = new Model();
        let jsonField = model["&_data_jsonField"];
        expect(jsonField).toEqual("result_data");
    });
});