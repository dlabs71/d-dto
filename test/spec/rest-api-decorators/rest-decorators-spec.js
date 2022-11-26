import {DeleteMapper, GetMapper, PostMapper, PutMapper} from "../../../src";
import Service, {Model, Model2} from './test-service';

describe("rest api decorators. Testing decorators", () => {

    it("GetMapper", (done) => {
        Service.getData().then(result => {
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(Model);
            expect(result.prop1).toEqual("qwerty");
            expect(result.prop2).toEqual("asdfgh");
            expect(result.prop3).toEqual("zxcvbn");
            done();
        });
    });

    it("GetMapper 2", (done) => {
        Service.getData2().then(result => {
            expect(result).toBeNull();
            done();
        });
    });

    it("PostMapper", (done) => {
        let dto = new Model();
        dto.prop1 = "prop1";
        dto.prop2 = "prop2";
        dto.prop3 = "prop3";

        Service.sendData(dto, "arg1", "arg2").then(result => {
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(Model);
            expect(result.prop1).toEqual("arg1");
            expect(result.prop2).toEqual("arg2");
            expect(result.prop3).toEqual("prop3");
            done();
        });
    });

    it("PostMapper 2", (done) => {
        let dto = new Model();
        dto.prop1 = "prop1";
        dto.prop2 = "prop2";
        dto.prop3 = "prop3";

        Service.sendData2("arg1", dto, "arg2").then(result => {
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(Model2);
            expect(result.arg1).toEqual("prop1");
            expect(result.arg2).toEqual("prop2");
            expect(result.arg3).toEqual("prop3");
            done();
        });
    });

    it("PutMapper", (done) => {
        let dto = new Model();
        dto.prop1 = "prop1";
        dto.prop2 = "prop2";
        dto.prop3 = "prop3";

        Service.putData("arg1", dto, "arg2").then(result => {
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(Model2);
            expect(result.arg1).toEqual("prop1");
            expect(result.arg2).toEqual("prop2");
            expect(result.arg3).toEqual("prop3");
            done();
        });
    });

    it("DeleteMapper", (done) => {
        let dto = new Model();
        dto.prop1 = "prop1";
        dto.prop2 = "prop2";
        dto.prop3 = "prop3";

        Service.deleteData().then(result => {
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(Model);
            expect(result.prop1).toEqual("qwerty");
            expect(result.prop2).toEqual("asdfgh");
            expect(result.prop3).toEqual("zxcvbn");
            done();
        });
    });
});