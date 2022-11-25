import {
    checkSeparateCondition,
    convertArgs,
    convertResponse,
    createLookupId
} from "../../../src/core/rest-api-decorators/common";
import {JsonField, TypeString} from "../../../src";

describe("rest api decorators. Common functions", () => {

    it("convertResponse", (done) => {
        let data = {
            prop1: "qwerty",
            prop2: "asdfgh",
            prop3: "zxcvbn"
        }

        class Model {
            @JsonField("prop1") @TypeString prop1;
            @JsonField("prop2") @TypeString prop2;
            @JsonField("prop3") @TypeString prop3;
        }

        let originalMethodPromise = (arg1, arg2, arg3) => {
            return new Promise(resolve => {
                let newData = JSON.parse(JSON.stringify(data));
                newData.prop1 = arg1;
                newData.prop2 = arg2;
                newData.prop3 = arg3;
                resolve({
                    data: newData
                })
            });
        };

        let originalMethodStandard = (arg1, arg2, arg3) => {
            let newData = JSON.parse(JSON.stringify(data));
            newData.prop1 = arg1;
            newData.prop2 = arg2;
            newData.prop3 = arg3;
            return {
                data: newData
            }
        };

        let response2 = convertResponse(Model, originalMethodStandard, ["arg1", "arg2", "arg3"]);
        expect(response2).toBeDefined();
        expect(response2).toBeInstanceOf(Model);
        expect(response2.prop1).toEqual("arg1");
        expect(response2.prop2).toEqual("arg2");
        expect(response2.prop3).toEqual("arg3");

        convertResponse(Model, originalMethodPromise, ["arg1", "arg2", "arg3"])
            .then(response => {
                expect(response).toBeDefined();
                expect(response).toBeInstanceOf(Model);
                expect(response.prop1).toEqual("arg1");
                expect(response.prop2).toEqual("arg2");
                expect(response.prop3).toEqual("arg3");
                done();
            });
    });

    it("convertArgs", () => {
        class Model {
            @JsonField("prop1") @TypeString prop1 = "prop1";
            @JsonField("prop2") @TypeString prop2 = "prop2";
            @JsonField("prop3") @TypeString prop3 = "prop3";
        }

        let dto = new Model();
        let dtoArgNumber = 1;
        let newArgs = convertArgs([1, dto, "qwerty"], dtoArgNumber);
        expect(newArgs).toBeDefined();
        expect(newArgs.length).toEqual(3);
        expect(newArgs[dtoArgNumber]).toBeInstanceOf(Object);
        expect(newArgs[dtoArgNumber].prop2).toEqual("prop2");
    });

    it("createLookupId", () => {
        let data = {
            prop1: "prop1",
            prop2: "prop2",
            prop3: "prop3"
        };

        let lookupId = createLookupId(data);
        expect(lookupId).toBeDefined();
        data.prop2 = "arg2";
        expect(createLookupId(data)).not.toEqual(lookupId);

        let data2 = ["qwerty", "asdfgh", "zxcvbn"];
        let lookupId2 = createLookupId(data2);
        expect(lookupId2).toBeDefined();
    });

    it("checkSeparateCondition", () => {
        let separateStorageConf = {
            argIdx: 1,
            conditions: {
                arg_0: value => 2 * value === 4,
                arg_2: value => value === "arg2"
            }
        };

        let result = checkSeparateCondition(separateStorageConf, [2, {data: "data"}, "arg2"]);
        expect(result).toBeInstanceOf(Object);
        expect(result.data).toEqual("data");

        let result2 = checkSeparateCondition(separateStorageConf, [3, {data: "data"}, "arg2"]);
        expect(result2).toBeFalse();

        let result3 = checkSeparateCondition({argIdx: 0}, [3, {data: "data"}, "arg2"]);
        expect(result3).toEqual(3);

        let result4 = checkSeparateCondition(null, [3, {data: "data"}, "arg2"]);
        expect(result4).toBeNull();
    });
});