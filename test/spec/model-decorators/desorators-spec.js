import {
    JsonField,
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

function testTypeDecorator(modelClass) {
    let model = new modelClass();
    expect(model.__proto__["&_data_castFn"]).toBeDefined();
    let descriptor = Object.getOwnPropertyDescriptor(model.__proto__, "&_data_castFn");
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

    it("simple decorator OBJECT", () => {
        class Model {
            @TypeJsonObj data;
        }

        testTypeDecorator(Model);
        let model = new Model();
        expect(model["&_data_castFn"]({a: "qwerty"})).toEqual({a: "qwerty"});
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

    it("simple decorator CUSTOM", () => {
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
});