import {
    DATA_TYPE,
    j2cMapper,
    j2cMapperWrapper,
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

describe("J2C: json to dto class", () => {

    let sourceJson = {
        prop_str: "qwerty",
        prop_num: 12345,
        prop_bool: false,
        prop_yes_no: "N",
        prop_date: "2022-01-01",
        prop_date_2: "01.01.2022",
        prop_date_3: "01 января 2022",
        prop_datetime: "2022-01-01T22:02:12",
        prop_datetime_2: "01.01.2022 22:01:23",
        prop_datetime_3: "01 января 2022 22:01:23",
        prop_json: {
            data: "qwert",
            result: "result",
            startDate: "2022-02-02"
        },
        prop_custom: {
            first_name: "Danila",
            second_name: "Ivanov",
            age: 24
        },
        prop_arr: ["qwerty", "asdfgh", "zxcvbn"],
        prop_arr_2: [
            {first_name: "Danila", second_name: "Ivanov", age: 24},
            {first_name: "Alex", second_name: "Ivanov", age: 52},
            {first_name: "Kristina", second_name: "Ivanova", age: 24}
        ]
    };

    class PersonDto {
        @JsonField("first_name") @TypeString firstName;
        @JsonField("second_name") @TypeString secondName;
        @JsonField("age") @TypeNumber age;
    }

    class BaseDto {
        @JsonField("prop_str") @TypeString propStr;
        @JsonField("prop_num") @TypeNumber propNum;
        @JsonField("prop_bool") @TypeBool propBool;
        @JsonField("prop_yes_no") @TypeYesNo propYesNo;
        @JsonField("prop_date") @TypeDate() propDate;
        @JsonField("prop_date_2") @TypeDate() propDate2;
        @JsonField("prop_date_3") @TypeDate("DD MMMM YYYY", "ru") propDate3;
        @JsonField("prop_datetime") @TypeDateTime() propDatetime;
        @JsonField("prop_datetime_2") @TypeDateTime() propDatetime2;
        @JsonField("prop_datetime_3") @TypeDateTime("DD MMMM YYYY HH:mm:ss", "ru") propDatetime3;
        @JsonField("prop_json") @TypeJsonObj propJson;
        @JsonField("prop_custom") @TypeCustom(PersonDto) propCustom;
        @JsonField("prop_arr") @TypeArr(DATA_TYPE.STRING) propArr;
        @JsonField("prop_arr_2") @TypeArr(DATA_TYPE.CUSTOM, PersonDto) propArr2;
    }

    it("j2cMapper", () => {
        let dto = j2cMapper(sourceJson, BaseDto);
        expect(dto).toBeDefined();
        expect(dto).toBeInstanceOf(BaseDto);
        expect(dto.propStr).toEqual("qwerty");
        expect(dto.propNum).toEqual(12345);
        expect(dto.propBool).toEqual(false);
        expect(dto.propYesNo).toEqual(false);

        expect(moment.isMoment(dto.propDate)).toEqual(true);
        expect(dto.propDate.format("D/M/YY")).toEqual("1/1/22");

        expect(moment.isMoment(dto.propDate2)).toEqual(true);
        expect(dto.propDate2.format("D/M/YY")).toEqual("1/1/22");

        expect(moment.isMoment(dto.propDate3)).toEqual(true);
        expect(dto.propDate3.format("D/M/YY")).toEqual("1/1/22");

        expect(moment.isMoment(dto.propDatetime)).toEqual(true);
        expect(dto.propDatetime.format("D/M/YY H:m:s")).toEqual("1/1/22 22:2:12");

        expect(moment.isMoment(dto.propDatetime2)).toEqual(true);
        expect(dto.propDatetime2.format("D/M/YY H:m:s")).toEqual("1/1/22 22:1:23");

        expect(moment.isMoment(dto.propDatetime3)).toEqual(true);
        expect(dto.propDatetime3.format("D/M/YY H:m:s")).toEqual("1/1/22 22:1:23");

        expect(dto.propJson).toEqual({
            data: "qwert",
            result: "result",
            startDate: "2022-02-02"
        });

        expect(dto.propCustom).toBeInstanceOf(PersonDto);
        expect(dto.propCustom.firstName).toEqual("Danila");
        expect(dto.propCustom.secondName).toEqual("Ivanov");
        expect(dto.propCustom.age).toEqual(24);


        expect(dto.propArr.length).toEqual(3);
        expect(dto.propArr[1]).toEqual("asdfgh");

        expect(dto.propArr2.length).toEqual(3);
        expect(dto.propArr2[1]).toBeInstanceOf(PersonDto);
        expect(dto.propArr2[1].firstName).toEqual("Alex");
        expect(dto.propArr2[1].secondName).toEqual("Ivanov");
        expect(dto.propArr2[1].age).toEqual(52);
    });

    it("j2cMapperWrapper", () => {
        let sourceJson = {
            first_name: "Danila",
            second_name: "Ivanov",
            age: 24
        };

        let jsonArr = [
            {first_name: "Danila", second_name: "Ivanov", age: 24},
            {first_name: "Alex", second_name: "Ivanov", age: 52},
            {first_name: "Kristina", second_name: "Ivanova", age: 24}
        ];

        expect(() => j2cMapperWrapper(null, null))
            .toThrow(new Error("Model is required attribute!"));
        expect(j2cMapperWrapper(null, "default"))
            .toEqual(null);

        let dto = j2cMapperWrapper(sourceJson, PersonDto);
        expect(dto).toBeInstanceOf(PersonDto);
        expect(dto.firstName).toEqual("Danila");

        expect(dto).toBeInstanceOf(PersonDto);
        expect(dto.firstName).toEqual("Danila");

        let dtoArr = j2cMapperWrapper(jsonArr, PersonDto);
        expect(dtoArr.length).toEqual(3);
        expect(dtoArr[1].firstName).toEqual("Alex");

        class Model {
            @JsonField("first_name") @TypeString firstName;
            @JsonField("second_name") @TypeString secondName;
            @JsonField("age") @TypeNumber age;
            addedField = "addedField";
        }

        expect(() => j2cMapperWrapper(sourceJson, Model, false)).toThrow(jasmine.any(Error));
        expect(j2cMapperWrapper(sourceJson, Model, true).addedField).toEqual("addedField");
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

            beforeJ2cMapping(jsonObj, dto) {
                this.beforeJ2c = jsonObj["first_name"];
            }

            afterJ2cMapping(jsonObj, dto) {
                this.afterJ2c = jsonObj["second_name"];
            }
        }

        let dto = j2cMapperWrapper(sourceJson, Model);
        expect(dto).toBeInstanceOf(Model);
        expect(dto.beforeJ2c).toEqual("Danila");
        expect(dto.afterJ2c).toEqual("Ivanov");
    });
});