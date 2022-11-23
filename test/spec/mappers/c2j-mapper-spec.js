import {
    c2jMapper,
    c2jMapperWrapper,
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

describe("C2J: dto class to json", () => {

    class PersonDto {
        @JsonField("first_name") @TypeString firstName;
        @JsonField("second_name") @TypeString secondName;
        @JsonField("age") @TypeNumber age;

        static createInstance(firstName, secondName, age) {
            let dto = new PersonDto();
            dto.firstName = firstName;
            dto.secondName = secondName;
            dto.age = age;
            return dto;
        }
    }

    class BaseDto {
        @JsonField("prop_str") @TypeString propStr = "qwerty";
        @JsonField("prop_num") @TypeNumber propNum = 12345;
        @JsonField("prop_bool") @TypeBool propBool = false;
        @JsonField("prop_yes_no") @TypeYesNo propYesNo = false;
        @JsonField("prop_date") @TypeDate("YYYY/MM/DD") propDate = moment("2022-01-01", "YYYY-MM-DD");
        @JsonField("prop_date_2") @TypeDate("DD.MM.YYYY") propDate2 = moment("01.01.2022", "DD.MM.YYYY");
        @JsonField("prop_datetime") @TypeDateTime("YYYY/MM/DDTHH:mm:ss") propDatetime = moment("2022-01-01T22:02:12", "YYYY-MM-DDTHH:mm:ss");
        @JsonField("prop_datetime_2") @TypeDateTime("DD.MM.YYYY HH:mm:ss") propDatetime2 = moment("01.01.2022 22:01:23", "DD.MM.YYYY HH:mm:ss");
        @JsonField("prop_json") @TypeJsonObj propJson = {
            data: "qwert",
            result: "result",
            startDate: "2022-02-02"
        };
        @JsonField("prop_custom") @TypeCustom(PersonDto) propCustom = PersonDto.createInstance("Danila", "Ivanov", 24);
        @JsonField("prop_arr") @TypeArr(DATA_TYPE.STRING) propArr = ["qwerty", "asdfgh", "zxcvbn"];
        @JsonField("prop_arr_2") @TypeArr(DATA_TYPE.CUSTOM, PersonDto) propArr2 = [
            PersonDto.createInstance("Danila", "Ivanov", 24),
            PersonDto.createInstance("Alex", "Ivanov", 52),
            PersonDto.createInstance("Kristina", "Ivanova", 24)
        ];
    }

    it("c2jMapper", () => {
        let dto = new BaseDto();
        let json = c2jMapper(dto);
        expect(json).toEqual(jasmine.any(Object));
        expect(json["prop_str"]).toEqual("qwerty");
        expect(json["prop_num"]).toEqual(12345);
        expect(json["prop_bool"]).toEqual(false);
        expect(json["prop_yes_no"]).toEqual("N");
        expect(json["prop_date"]).toEqual("2022/01/01");
        expect(json["prop_date_2"]).toEqual("01.01.2022");
        expect(json["prop_datetime"]).toEqual("2022/01/01T22:02:12");
        expect(json["prop_datetime_2"]).toEqual("01.01.2022 22:01:23");
        expect(json["prop_json"]).toEqual({
            data: "qwert",
            result: "result",
            startDate: "2022-02-02"
        });
        expect(json["prop_custom"]).toEqual({
            first_name: "Danila",
            second_name: "Ivanov",
            age: 24
        });
        expect(json["prop_arr"]).toEqual(["qwerty", "asdfgh", "zxcvbn"]);
        expect(json["prop_arr_2"].length).toEqual(3);
        expect(json["prop_arr_2"][1]).toEqual({first_name: "Alex", second_name: "Ivanov", age: 52});

    });

    it("c2jMapperWrapper", () => {
        let personDto = PersonDto.createInstance("Danila", "Ivanov", 24);
        let personDtoArr = [
            PersonDto.createInstance("Danila", "Ivanov", 24),
            PersonDto.createInstance("Alex", "Ivanov", 52),
            PersonDto.createInstance("Kristina", "Ivanova", 24)
        ];

        expect(c2jMapperWrapper(null)).toEqual(null);
        expect(c2jMapperWrapper(personDto)).toEqual({
            first_name: "Danila",
            second_name: "Ivanov",
            age: 24
        });
        let jsonArr = c2jMapperWrapper(personDtoArr);
        expect(jsonArr.length).toEqual(3);
        expect(jsonArr[1]).toEqual({first_name: "Alex", second_name: "Ivanov", age: 52});

        personDto.addedField = "addedField";
        expect(() => c2jMapperWrapper(personDto)).toThrow(jasmine.any(Error));
        expect(c2jMapperWrapper(personDto, true)).toEqual({
            first_name: "Danila",
            second_name: "Ivanov",
            age: 24
        });
    });

    it("after and before hooks", () => {
        let sourceJson = {
            first_name: "Danila",
            second_name: "Ivanov",
            age: 24
        };

        class Model {
            @JsonField("first_name") @TypeString firstName;
            @JsonField("second_name") @TypeString secondName;
            @JsonField("age") @TypeNumber age;

            beforeC2jMapping(dtoModel, resultJsonObj) {
                resultJsonObj["beforeC2j"] = "beforeC2j";
            }

            afterC2jMapping(dtoModel, resultJsonObj) {
                resultJsonObj["afterC2j"] = "afterC2j";
            }

            static createInstance(firstName, secondName, age) {
                let dto = new Model();
                dto.firstName = firstName;
                dto.secondName = secondName;
                dto.age = age;
                return dto;
            }
        }

        let dto = Model.createInstance("Danila", "Ivanov", 24);
        let json = c2jMapperWrapper(dto, true);
        expect(json).toBeInstanceOf(Object);
        expect(json.beforeC2j).toEqual("beforeC2j");
        expect(json.afterC2j).toEqual("afterC2j");
    });
});