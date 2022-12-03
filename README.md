# D-dto

Библиотека для создания классов DTO, предоставляющая поддержку конвертации из json в dto класс и обратно

[![NPM Version][npm-image]][npm-url]
[![License][license-image]][license-url]

# Установка NPM

```sh
npm i @dlabs71/d-dto
```

# Использование

Данная библиотека может быть использована в любом js приложении, вне зависимости от фреймворка. Она предназначена для
определения классов DTO описывающих инфо модели API-интерфейса. Также библиотека предоставляет декораторы функций
реализующих REST запросы, они конвертируют JSON результат в экземпляры указанных классов DTO.

Для того чтобы создать dto класс, достаточно определить класс с полями над которыми будут вспомогательные декораторы.
Список всех декораторов смотрите в документации

```js
import {JsonField, TypeString, TypeNumber} from '@dlabs71/d-dto';

class ArticleDto {
    @JsonField("article_id") @TypeNumber id;
    @JsonField("article_name") @TypeString name;
    @JsonField("article_desc") @TypeString description;
}
```

Далее данный dto класс можно использовать в декораторах функций API.

```js
import axios from 'axios';
import {GetMapper} from '@dlabs71/d-dto';

export default {

    @GetMapper(ArticleDto)
    getArticleById(articleId) {
        return axios.get(`/article/${articleId}`);
    }
}
```

В результате выполнения функции будет следующий ответ

```js
/*
    JSON response API: {
        config: ....,
        status: 200,
        data: {
            article_id: 123,
            article_name: "Name",
            article_desc: "Description"
        }
    }
 */


getArticleById(123).then(dto => {
    /*  
        dto = ArticleDto {
            id = 123;
            name = "Name";
            description = "Description";
        }
     */
});
```

# Документация

## 1. Создание DTO-моделей

DTO-модель - это класс(-ы) описывающий REST API представление, которым клиент и сервер обмениваются между друг другом.
Простыми словами, DTO-модель - это класс описывающий JSON, который передаётся в теле запроса или ответа. Для создания
DTO-модели применяются специальные JS декораторы, предоставляемые библиотекой.

### 1.1 Декоратор @JsonField

Данный декоратор предназначен для определения наименования поля в JSON объекте. При конвертации из JSON в DTO-модель
значение в поле класса будет записано из указанного наименования поля JSON в данном декораторе. При создании JSON
объекта из DTO-модели наименование поля будет создано из наименования указанного в декораторе.

```js
import {JsonField} from '@dlabs71/d-dto';

class ArticleDto {
    @JsonField("article_id") id;
    @JsonField("article_name") name;
    @JsonField("article_desc") description;
}

/*
Соответствующий JSON для данной модели будет следующим:
{
    article_id: 123,
    article_name: "Name",
    article_desc: "Description"  
}
 */
```

Параметр данного декоратора также может быть и массивом. При этом при конвертации из JSON объекта в DTO-модель значение
для записи в поле класса будет выбрано из поля в JSON, которое первое найдется из списка. При конвертации в JSON для
наименования поля будет использовано первое значение из списка в параметре декоратора.

```js
import {JsonField} from '@dlabs71/d-dto';

class LookupDto {
    @JsonField(["value", "id"]) value;
    @JsonField(["title", "text"]) title;
}

/*
Соответствующие JSON-ы для данной модели будет следующим:
{
    value: 123,
    title: "Name"
},
{
    id: 123,
    title: "Name"
},
{
    id: 123,
    text: "Name"
}

При преобразовании из DTO-модели в JSON:
{
    value: 123,
    title: "Name"
}
 */
```

### 1.1 Декораторы типов

Декораторы типов предназначены для указания какого типа должно быть значение поля. Для каждого типа создан специальны
декоратор.

#### 1.1.1 Декоратор @TypeString

@TypeString - предназначен для преобразования в string. Если в json поле содержится значение другого типа, то оно будет
конвертировано в string. Если это объект или массив, то к нему будет применена функция `JSON.stringify`.

```js
import {JsonField, TypeString} from '@dlabs71/d-dto';

class Dto {
    @JsonField("value") @TypeString value;
}
```

| **Значение JSON**                 | **Значение DTO**                    | 
| :---------------------------------| :-----------------------------------| 
| "value"                           | "value"                             |
| 123                               | "123"                               |
| true                              | "true"                              |
| undefined                         | undefined                           |
| null                              | null                                |
| NaN                               | "NaN"                               |
| { a: "qwe", b: "qwe", data: 123 } | "{ a: "qwe", b: "qwe", data: 123 }" |
| [123, 234, 345]                   | "[123, 234, 345]"                   |

#### 1.1.2 Декоратор @TypeNumber

@TypeNumber - предназначен для преобразования в number.

```js
import {JsonField, TypeNumber} from '@dlabs71/d-dto';

class Dto {
    @JsonField("value") @TypeNumber value;
}
```

| **Значение JSON**                 | **Значение DTO**                    | 
| :---------------------------------| :-----------------------------------| 
| "value"                           | NaN                                 |
| 123                               | 123                                 |
| "123"                             | 123                                 |
| true                              | 1                                   |
| false                             | 0                                   |
| undefined                         | undefined                           |
| null                              | null                                |
| NaN                               | NaN                                 |
| { a: "qwe", b: "qwe", data: 123 } | NaN                                 |
| [123, 234, 345]                   | NaN                                 |

#### 1.1.3 Декоратор @TypeBool

@TypeBool - предназначен для преобразования в boolean.

```js
import {JsonField, TypeBool} from '@dlabs71/d-dto';

class Dto {
    @JsonField("value") @TypeBool value;
}
```

| **Значение JSON**                 | **Значение DTO**                    | 
| :---------------------------------| :-----------------------------------| 
| "value"                           | false                               |
| 123                               | false                               |
| true                              | true                                |
| false                             | false                               |
| undefined                         | undefined                           |
| null                              | null                                |
| NaN                               | false                               |
| { a: "qwe", b: "qwe", data: 123 } | false                               |
| [123, 234, 345]                   | false                               |

#### 1.1.4 Декоратор @TypeYesNo

@TypeYesNo - предназначен для преобразования из "Y"/"N" в boolean.

```js
import {JsonField, TypeYesNo} from '@dlabs71/d-dto';

class Dto {
    @JsonField("value") @TypeYesNo value;
}
```

| **Значение JSON**                 | **Значение DTO**                    | 
| :---------------------------------| :-----------------------------------| 
| "value"                           | false                               |
| "Y"                               | true                                |
| 123                               | false                               |
| true                              | false                               |
| false                             | false                               |
| undefined                         | undefined                           |
| null                              | null                                |
| NaN                               | false                               |
| { a: "qwe", b: "qwe", data: 123 } | false                               |
| [123, 234, 345]                   | false                               |

#### 1.1.5 Декоратор @TypeDate()

@TypeDate() - предназначен для преобразования из строки в дату (экземпляр класса moment.Moment). Смотрите документацию
по [moment](https://momentjs.com/).

Данный декоратор имеет параметр: **`format`** - формат даты. Форматы смотрите
в [документации к библиотеки moment](https://momentjs.com/docs/#/parsing/string/)

```js
import {JsonField, TypeDate} from '@dlabs71/d-dto';

class Dto {
    @JsonField("value") @TypeDate() value;
    @JsonField("value1") @TypeDate("YYYY-MM-DD") value1;
}
```

| **Значение JSON**                 | **Значение DTO**                   | 
| :---------------------------------| :----------------------------------| 
| "value"                           | null                               |
| 123                               | null                               |
| true                              | null                               |
| false                             | null                               |
| undefined                         | undefined                          |
| null                              | null                               |
| NaN                               | null                               |
| { a: "qwe", b: "qwe", data: 123 } | null                               |
| [123, 234, 345]                   | null                               |
| "20.01.2022"                      | moment("2022-01-20", "YYYY-MM-DD") |

Форматы, которые могут быть распознаны по умолчанию указаны в списке ниже:

- DD.MM.YYYY
- DD-MM-YYYY
- DD/MM/YYYY
- YYYY-MM-DD

#### 1.1.6 Декоратор @TypeDateTime()

@TypeDateTime() - предназначен для преобразования из строки в дату со временем (экземпляр класса moment.Moment).
Смотрите документацию по [moment](https://momentjs.com/).

Данный декоратор имеет параметр: **`format`** - формат даты. Форматы смотрите
в [документации к библиотеки moment](https://momentjs.com/docs/#/parsing/string/)

```js
import {JsonField, TypeDateTime} from '@dlabs71/d-dto';

class Dto {
    @JsonField("value") @TypeDateTime() value;
    @JsonField("value1") @TypeDateTime("YYYY-MM-DDTHH:mm:ss") value1;
}
```

| **Значение JSON**                          | **Значение DTO**                                     | 
| :------------------------------------------| :----------------------------------------------------| 
| "value"                                    | null                                                 |
| 123                                        | null                                                 |
| true                                       | null                                                 |
| false                                      | null                                                 |
| undefined                                  | undefined                                            |
| null                                       | null                                                 |
| NaN                                        | null                                                 |
| { a: "qwe", b: "qwe", data: 123 }          | null                                                 |
| [123, 234, 345]                            | null                                                 |
| "2022-01-01T20:01:22"                      | moment("2022-01-01T20:01:22", "YYYY-MM-DDTHH:mm:ss") |

Форматы, которые могут быть распознаны по умолчанию указаны в списке ниже:

Форматы обычных дат. При этом время будет выставлено в 00:00:00.

- DD.MM.YYYY
- DD-MM-YYYY
- DD/MM/YYYY
- YYYY-MM-DD

Форматы дат со временем:

- DD.MM.YYYY HH:mm:ss
- DD-MM-YYYY HH:mm:ss
- DD/MM/YYYY HH:mm:ss
- YYYY-MM-DD HH:mm:ss
- DD.MM.YYYY HH:mm:ssZ
- DD-MM-YYYY HH:mm:ssZ
- DD/MM/YYYY HH:mm:ssZ
- YYYY-MM-DD HH:mm:ssZ
- DD.MM.YYYYTHH:mm:ss
- DD-MM-YYYYTHH:mm:ss
- DD/MM/YYYYTHH:mm:ss
- YYYY-MM-DDTHH:mm:ss
- DD.MM.YYYYTHH:mm:ssZ
- DD-MM-YYYYTHH:mm:ssZ
- DD/MM/YYYYTHH:mm:ssZ
- YYYY-MM-DDTHH:mm:ssZ

#### 1.1.7 Декоратор @TypeJsonObj

@TypeJsonObj - предназначен для преобразования из простого JS объекта или массива.

```js
import {JsonField, TypeJsonObj} from '@dlabs71/d-dto';

class Dto {
    @JsonField("value") @TypeJsonObj value;
}
```

| **Значение JSON**                   | **Значение DTO**                   | 
| :-----------------------------------| :----------------------------------| 
| "value"                             | null                               |
| 123                                 | null                               |
| true                                | null                               |
| false                               | null                               |
| undefined                           | undefined                          |
| null                                | null                               |
| NaN                                 | null                               |
| { a: "qwe", b: "qwe", data: 123 }   | { a: "qwe", b: "qwe", data: 123 }  |
| "{ a: "qwe", b: "qwe", data: 123 }" | { a: "qwe", b: "qwe", data: 123 }  |
| [123, 234, 345]                     | [123, 234, 345]                    |
| "[123, 234, 345]"                   | [123, 234, 345]                    |

#### 1.1.8 Декоратор @TypeCustom()

@TypeCustom() - предназначен для преобразования из простого JS объекта в DTO-модель.

```js
import {JsonField, TypeCustom, TypeString} from '@dlabs71/d-dto';

class SubDto {
    @JsonField("value") @TypeString value;
}

class Dto {
    @JsonField("value") @TypeCustom(SubDto) value;
}
```

| **Значение JSON**                   | **Значение DTO**                   | 
| :-----------------------------------| :----------------------------------| 
| { a: "qwe", b: "qwe", data: 123 }   | SubDto { value: null }             |
| { value: "123" }                    | SubDto { value: "123" }            |
| undefined                           | undefined                          |
| null                                | null                               |
| NaN                                 | null                               |

#### 1.1.9 Декоратор @TypeArr()

@TypeArr() - предназначен для преобразования из массива. У данного декоратора есть три параметра:

- type - тип значения элемента массива. Используйте константу-перечисление DATA_TYPE для указания данного типа.
- customClass - класс DTO-модели. Используется если указан тип DATA_TYPE.CUSTOM
- format - строковый формат даты/даты со временем. Используется если указан тип DATA_TYPE.DATE или DATA_TYPE.DATE_TIME
  Смотрите документацию по декораторам [@TypeDate](#1.1.5_Декоратор_@TypeDate())
  и [@TypeDateTime](#1.1.5_Декоратор_@TypeDateTime())

```js
import {JsonField, TypeString, TypeArr, DATA_TYPE} from '@dlabs71/d-dto';

class SubDto {
    @JsonField("value") @TypeString value;
}

class Dto {
    @JsonField("arr1") @TypeArr(DATA_TYPE.CUSTOM, SubDto) arr1;
    @JsonField("arr2") @TypeArr(DATA_TYPE.STRING) arr1;
    @JsonField("arr3") @TypeArr(DATA_TYPE.DATE, null, "YYYY-MM-DD") arr3;
}

/*
{
    arr1: [{"value": "value1"}, {"value": "value2"}],
    arr2: ["value1", "value2"],
    arr3: ["2022-02-02", "2022-01-01"]
}
 */
```

| **Значение JSON**                   | **Значение DTO**                   | 
| :-----------------------------------| :----------------------------------|
| undefined                           | undefined                          |
| null                                | null                               |
| NaN                                 | null                               |

[npm-image]: https://img.shields.io/npm/v/@dlabs71/d-dto

[npm-url]: https://www.npmjs.com/package/@dlabs71/d-dto

[license-image]: https://img.shields.io/badge/license-MIT-blue.svg

[license-url]: LICENSE