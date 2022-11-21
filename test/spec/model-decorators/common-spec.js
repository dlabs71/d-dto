import {castCustomType, castDateType, castSimpleType} from "../../../src/core/model-decorators/type/common.js";
import {DATA_TYPE} from "../../../src/core/constants.js";
import moment from "moment";
import {JsonField, TypeNumber, TypeString} from "../../../src";

xdescribe("model decorator tests. Common functions", () => {

    it("castSimpleType with type STRING", () => {
        let castWrapper = (value) => {
            return castSimpleType(value, DATA_TYPE.STRING)
        };
        expect(castWrapper("qwerty")).toEqual("qwerty");
        expect(castWrapper(123)).toEqual("123");
        expect(castWrapper(true)).toEqual("true");
        let obj = {
            a: "asd",
            b: "sdf",
            data: 123
        }
        expect(castWrapper(obj)).toEqual(JSON.stringify(obj));
        expect(castWrapper(undefined)).toEqual(undefined);
        expect(castWrapper(null)).toEqual(null);
        expect(castWrapper(NaN)).toEqual("NaN");
    });

    it("castSimpleType with type NUMBER", () => {
        let castWrapper = (value) => {
            return castSimpleType(value, DATA_TYPE.NUMBER)
        };
        expect(castWrapper("qwerty")).toEqual(NaN);
        expect(castWrapper("123")).toEqual(123);
        expect(castWrapper(123)).toEqual(123);
        expect(castWrapper(true)).toEqual(1);
        let obj = {
            a: "asd",
            b: "sdf",
            data: 123
        }
        expect(castWrapper(obj)).toEqual(NaN);
        expect(castWrapper(undefined)).toEqual(undefined);
        expect(castWrapper(null)).toEqual(null);
        expect(castWrapper(NaN)).toEqual(NaN);
    });

    it("castSimpleType with type BOOL", () => {
        let castWrapper = (value) => {
            return castSimpleType(value, DATA_TYPE.BOOL)
        };
        expect(castWrapper("qwerty")).toEqual(false);
        expect(castWrapper(123)).toEqual(false);
        expect(castWrapper(true)).toEqual(true);
        expect(castWrapper(false)).toEqual(false);
        let obj = {
            a: "asd",
            b: "sdf",
            data: 123
        }
        expect(castWrapper(obj)).toEqual(false);
        expect(castWrapper(undefined)).toEqual(undefined);
        expect(castWrapper(null)).toEqual(null);
        expect(castWrapper(NaN)).toEqual(false);
    });

    it("castSimpleType with type YES_NO", () => {
        let castWrapper = (value) => {
            return castSimpleType(value, DATA_TYPE.YES_NO)
        };
        expect(castWrapper("qwerty")).toEqual(false);
        expect(castWrapper(123)).toEqual(false);
        expect(castWrapper(true)).toEqual(false);
        expect(castWrapper("Y")).toEqual(true);
        let obj = {
            a: "asd",
            b: "sdf",
            data: 123
        }
        expect(castWrapper(obj)).toEqual(false);
        expect(castWrapper(undefined)).toEqual(undefined);
        expect(castWrapper(null)).toEqual(null);
        expect(castWrapper(NaN)).toEqual(false);
    });

    it("castSimpleType with type OBJECT", () => {
        let castWrapper = (value) => {
            return castSimpleType(value, DATA_TYPE.OBJECT)
        };
        expect(castWrapper("qwerty")).toEqual(null);
        expect(castWrapper(123)).toEqual(null);
        expect(castWrapper(true)).toEqual(null);
        let obj = {
            a: "asd",
            b: "sdf",
            data: 123
        };
        expect(castWrapper(obj)).toEqual(obj);
        expect(castWrapper(JSON.stringify(obj))).toEqual(obj);
        let arr = [
            {a: "asd"},
            {b: "asd"},
            {c: "sdf"}
        ];
        expect(castWrapper(arr)).toEqual(arr);
        expect(castWrapper(JSON.stringify(arr))).toEqual(arr);
        expect(castWrapper(undefined)).toEqual(undefined);
        expect(castWrapper(null)).toEqual(null);
        expect(castWrapper(NaN)).toEqual(null);
    });

    it("castDateType with type DATE", () => {
        let castWrapper = (value, format = null) => {
            return castDateType(value, DATA_TYPE.DATE, format)
        };
        expect(castWrapper("qwerty")).toEqual(null);
        expect(castWrapper(123)).toEqual(null);
        expect(castWrapper(true)).toEqual(null);

        expect(castWrapper("20.01.2022").format("YYYY-MM-DD"))
            .toEqual("2022-01-20");
        expect(castWrapper("2022-01-22").format("YYYY-MM-DD"))
            .toEqual("2022-01-22");
        expect(castWrapper("1.1.22", "D.M.YY").format("YYYY-MM-DD"))
            .toEqual("2022-01-01");

        expect(castWrapper(moment("2022-01-01")).format("YYYY-MM-DD"))
            .toEqual("2022-01-01");
        expect(castWrapper(new Date(2022, 0, 1)).format("YYYY-MM-DD"))
            .toEqual("2022-01-01");

        expect(castWrapper(undefined)).toEqual(undefined);
        expect(castWrapper(null)).toEqual(null);
        expect(castWrapper(NaN)).toEqual(null);
    });

    it("castDateType with type DATETIME", () => {
        let castWrapper = (value, format = null) => {
            return castDateType(value, DATA_TYPE.DATE_TIME, format)
        };
        expect(castWrapper("qwerty")).toEqual(null);
        expect(castWrapper(123)).toEqual(null);
        expect(castWrapper(true)).toEqual(null);

        expect(castWrapper("20.01.2022").format())
            .toEqual("2022-01-20T00:00:00+03:00");
        expect(castWrapper("20.01.2022T20:01:22").format())
            .toEqual("2022-01-20T20:01:22+03:00");
        expect(castWrapper("22.1.1T20/01/22", "YY.M.DTHH/mm/ss").format())
            .toEqual("2022-01-01T20:01:22+03:00");

        expect(castWrapper(moment("2022-01-01T20:01:02")).format("YYYY-MM-DDTHH:mm:ss"))
            .toEqual("2022-01-01T20:01:02");
        expect(castWrapper(new Date(2022, 0, 1, 20, 1, 2))
            .format("YYYY-MM-DDTHH:mm:ss"))
            .toEqual("2022-01-01T20:01:02");

        expect(castWrapper(undefined)).toEqual(undefined);
        expect(castWrapper(null)).toEqual(null);
        expect(castWrapper(NaN)).toEqual(null);
    });

    it("castCustomType with type CUSTOM", () => {
        class Model {
            @JsonField("object_id") @TypeNumber id;
            @JsonField("object_name") @TypeString name;
            @JsonField("object_type") @TypeString type;
        }

        let jsonObject = {
            object_id: 123,
            object_name: "name",
            object_type: "type"
        }

        let dto = castCustomType(jsonObject, Model);
        expect(dto.id).toEqual(123);
        expect(dto.name).toEqual("name");
        expect(dto.type).toEqual("type");

        let jsonObject2 = castCustomType(dto, Model, true);
        expect(jsonObject2).toEqual(jsonObject);
    });
});