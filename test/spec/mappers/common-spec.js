import {
    findPropertyDescription,
    getCastTypeProp,
    getJsonFieldProp,
    getProperty,
    getPropertyFromDto
} from "../../../src/core/mappers/common";
import {
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
import {JSON_NAME_TMPL} from "../../../src/core/constants";
import moment from "moment";

xdescribe("mapper tests. Common functions", () => {

    it("findPropertyDescription", () => {
        class BaseModel {
            @JsonField("property_json") @TypeNumber property;
        }

        class Model extends BaseModel {
            @JsonField("data_json") @TypeString data;
        }

        let desc1 = findPropertyDescription(JSON_NAME_TMPL("data"), Model);
        expect(desc1.value).toEqual("data_json");

        let desc2 = findPropertyDescription(JSON_NAME_TMPL("property"), Model);
        expect(desc2.value).toEqual("property_json");

        let desc3 = findPropertyDescription(JSON_NAME_TMPL("www"), Model);
        expect(desc3).toEqual(null);
    });

    it("getJsonFieldProp", () => {
        class BaseModel {
            @JsonField("property_json") @TypeNumber property;
        }

        class Model extends BaseModel {
            @JsonField("data_json") @TypeString data;
        }

        let jsonFieldName1 = getJsonFieldProp("data", Model);
        expect(jsonFieldName1).toEqual("data_json");

        let jsonFieldName2 = getJsonFieldProp("property", Model);
        expect(jsonFieldName2).toEqual("property_json");

        expect(() => getJsonFieldProp("property_data", Model))
            .toThrow(new Error("Not found jsonFieldName for \"property_data\" in Model"));

        expect(getJsonFieldProp("property_data", Model, true)).toEqual(null);
    });

    it("getCastTypeProp", () => {
        class BaseModel {
            @JsonField("property_json") @TypeNumber property;
        }

        class Model extends BaseModel {
            @JsonField("data_json") @TypeString data;
        }

        let castFn = getCastTypeProp("data", Model);
        expect(castFn).toEqual(jasmine.any(Function));
        expect(castFn("data")).toEqual("data");

        let castFn2 = getCastTypeProp("property", Model);
        expect(castFn2).toEqual(jasmine.any(Function));
        expect(castFn2(123)).toEqual(123);

        let castFn3 = getCastTypeProp("property_1", Model);
        expect(castFn3).toBeNull();
    });

    it("getProperty", () => {
        let obj = {
            prop1: "qwerty",
            prop2: "asdfgh",
            prop3: "zxcvbn"
        };
        let prop = getProperty(obj, "prop1");
        expect(prop).toEqual("qwerty");

        let prop1 = getProperty(obj, "prop1", (value) => value + "123");
        expect(prop1).toEqual("qwerty123");

        let prop2 = getProperty(obj, ["prop22", "prop2", "prop33"]);
        expect(prop2).toEqual("asdfgh");
    });

    it("getPropertyFromDto", () => {
        class CustomModel {
            @JsonField("data") @TypeString data = "qwerty";
        }

        class Model {
            @TypeString prop1 = "qwerty";
            @TypeNumber prop2 = 123;
            @TypeBool prop3 = true;
            @TypeYesNo prop4 = true;
            @TypeDate() prop5 = moment("01.01.2022", "DD.MM.YYYY");
            @TypeDateTime() prop6 = moment("01.01.2022 23:32:12", "DD.MM.YYYY HH:mm:ss");
            @TypeJsonObj prop7 = {data: "data"};
            @TypeCustom(CustomModel) prop8 = new CustomModel();
            @TypeArr("string") prop9 = ["qwerty", "asdfgh", "zxcvbn"];
        }

        let dto = new Model();

        expect(getPropertyFromDto(dto, "prop1")).toEqual("qwerty");
        expect(getPropertyFromDto(dto, "prop2")).toEqual(123);
        expect(getPropertyFromDto(dto, "prop3")).toEqual(true);
        expect(getPropertyFromDto(dto, "prop4")).toEqual("Y");
        expect(getPropertyFromDto(dto, "prop5")).toEqual("2022-01-01");
        expect(getPropertyFromDto(dto, "prop6")).toEqual("2022-01-01T23:32:12+03:00");
        expect(getPropertyFromDto(dto, "prop7")).toEqual({data: "data"});
        expect(getPropertyFromDto(dto, "prop8")).toEqual({data: "qwerty"});
        expect(getPropertyFromDto(dto, "prop9")).toEqual(["qwerty", "asdfgh", "zxcvbn"]);
    });
});