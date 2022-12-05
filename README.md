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
    },

    @GetMapper(ArticleDto)
    getAllArticles() {
        return axios.get(`/article/all`);
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

getAllArticles().then(result => {
    /*  
        result = [
            ArticleDto {
                id = 123;
                name = "Name";
                description = "Description";
            },
            ArticleDto {
                id = 124;
                name = "Name 2";
                description = "Description 2";
            },
            ArticleDto {
                id = 125;
                name = "Name 3";
                description = "Description 3";
            }
        ]
     */
});
```

# Документация

## Оглавление

* [1. Создание DTO-моделей](#1._Создание_DTO-моделей)
    * [1.1. Декоратор @JsonField](#1.1._Декоратор_@JsonField)
    * [1.2. Декораторы типов](#1.2._Декораторы_типов)
        * [1.2.1. Декоратор @TypeString](#1.2.1._Декоратор_@TypeString)
        * [1.2.2. Декоратор @TypeNumber](#1.2.2._Декоратор_@TypeNumber)
        * [1.2.3. Декоратор @TypeBool](#1.2.3._Декоратор_@TypeBool)
        * [1.2.4. Декоратор @TypeYesNo](#1.2.4._Декоратор_@TypeYesNo)
        * [1.2.5. Декоратор @TypeDate()](#1.2.5._Декоратор_@TypeDate())
        * [1.2.6. Декоратор @TypeDateTime()](#1.2.6._Декоратор_@TypeDateTime())
        * [1.2.7. Декоратор @TypeJsonObj](#1.2.7._Декоратор_@TypeJsonObj)
        * [1.2.8. Декоратор @TypeCustom()](#1.2.8._Декоратор_@TypeCustom())
        * [1.2.9. Декоратор @TypeArr()](#1.2.9._Декоратор_@TypeArr())
    * [1.3. Хуки конвертаций DTO-моделей](#1.3._Хуки_конвертаций_DTO-моделей)
* [2. Создание API сервисов](#2._Создание_API_сервисов)
    * [2.1. Декораторы @GetMapper и @DeleteMapper](#2.1._Декораторы_@GetMapper_и_@DeleteMapper)
    * [2.2. Декораторы @PostMapper и @PutMapper](#2.2._Декораторы_@PostMapper_и_@PutMapper)
    * [2.3. Декораторы @StorableGetMapper и @VuexGetMapper](#2.3._Декораторы_@StorableGetMapper_и_@VuexGetMapper)
        * [2.3.1. Декоратор @StorableGetMapper](#2.3.1._Декоратор_@StorableGetMapper)
        * [2.3.2. Декоратор @VuexGetMapper](#2.3.2._Декоратор_@VuexGetMapper)
* [3. Использование функций мапперов](#3._Использование_функций_мапперов)

## 1. Создание DTO-моделей

DTO-модель - это класс(-ы) описывающий REST API представление, которым клиент и сервер обмениваются между друг другом.
Простыми словами, DTO-модель - это класс описывающий JSON, который передаётся в теле запроса или ответа. Для создания
DTO-модели применяются специальные JS декораторы, предоставляемые библиотекой.

### 1.1. Декоратор @JsonField

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

### 1.2. Декораторы типов

Декораторы типов предназначены для указания какого типа должно быть значение поля. Для каждого типа создан специальны
декоратор.

#### 1.2.1. Декоратор @TypeString

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

#### 1.2.2. Декоратор @TypeNumber

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

#### 1.2.3. Декоратор @TypeBool

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

#### 1.2.4. Декоратор @TypeYesNo

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

#### 1.2.5. Декоратор @TypeDate()

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

#### 1.2.6. Декоратор @TypeDateTime()

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

#### 1.2.7. Декоратор @TypeJsonObj

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

#### 1.2.8. Декоратор @TypeCustom()

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

#### 1.2.9. Декоратор @TypeArr()

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

### 1.3. Хуки конвертаций DTO-моделей

Для выполнения дополнительных действий при конвертации из JSON в DTO-модель и наоборот существует 4 функции:

| **Функция**                              | **Описание**                                                            |
| :----------------------------------------| :-----------------------------------------------------------------------|
| beforeJ2cMapping(jsonObj, dto)           | Функция будет выполнена до процесса конвертации из JSON в DTO-модель    |
| afterJ2cMapping(jsonObj, dto)            | Функция будет выполнена после процесса конвертации из JSON в DTO-модель |
| beforeC2jMapping(dto, resultJsonObj)     | Функция будет выполнена до процесса конвертации из DTO-модели в JSON    |
| afterC2jMapping(dto, resultJsonObj)      | Функция будет выполнена после процесса конвертации из DTO-модели в JSON |

Пример использования хуков конвертации из DTO-модели в JSON:

```js
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
}

let dto = new Model();
dto.firstName = "Danila";
dto.secondName = "Ivanov";
dto.age = 24;

let json = c2jMapperWrapper(dto);

/*
    json = {
        first_name: "Danila",
        second_name: "Ivanov",
        age: 24,
        beforeC2j: "beforeC2j",
        afterC2j: "afterC2j"
    }
 */
```

Пример использования хуков конвертации из JSON в DTO-модель:

```js
let sourceJson = {
    first_name: "Danila",
    second_name: "Ivanov",
    age: 24
};

class Model {
    @JsonField("first_name") @TypeString firstName;
    @JsonField("second_name") @TypeString secondName;
    @JsonField("age") @TypeNumber age;

    beforeJ2cMapping(jsonObj, dtoModel) {
        this.beforeJ2c = jsonObj["first_name"];
    }

    afterJ2cMapping(jsonObj, dtoModel) {
        this.afterJ2c = jsonObj["second_name"];
    }
}

let dto = j2cMapperWrapper(sourceJson, Model);

/*
    dto = Model {
        firstName = "Danila";
        secondName = "Ivanov";
        age = 24;
        beforeJ2c = "Danila";
        afterJ2c = "Ivanov";
    }
 */
```

## 2. Создание API сервисов

Под созданием API сервисов подразумевается создание функций реализующих REST API запросы. Для автоматической конвертации
ответов данных сервисов библиотека предоставляет декораторы.

### 2.1. Декораторы @GetMapper и @DeleteMapper

@GetMapper и @DeleteMapper - декораторы предназначенные для конвертации ответов GET и DELETE запросов. Они имеют
несколько параметров:

- modelResponse - класс DTO-модели описывающий тело ответа
- pathToData - путь до поля с данными ответа в JSON-е. По умолчанию = data.
- strict - если true то включается строгий режим конвертации (по умолчанию false). Т.е. все поля класса должны быть
  помечены декоратором @JsonField

Если функция возвращает `Promise`, то при применении декоратора он конвертирует ответ, который будет в `.then()`
и передаст его дальше по цепочке.

Если функция возвращает просто объект, то декоратор конвертирует этот объект и вернет экземпляр класса DTO-модели
указанной в его параметрах.

Если функция возвращает массив (вне зависимости в Promise или нет), то декоратор считает, что функция возвращает массив
объектов, каждый из которых может быть конвертируем в DTO-модель указанную в параметрах декоратора. Соответственно,
функция вернет массив экземпляров классов DTO-моделей.

```js
import axios from 'axios';
import {JsonField, TypeString, TypeNumber, GetMapper, DeleteMapper} from '@dlabs71/d-dto';

class ArticleDto {
    @JsonField("article_id") @TypeNumber id;
    @JsonField("article_name") @TypeString name;
    @JsonField("content") @TypeString content;
}

export default {

    /*
        пример получения одного объекта
        запрос вернет следующий JSON: {
            status: 200,
            statusText: 'OK',
            headers: {},
            config: {},
            request: {},
            data: {
                article_id: 1,
                article_name: "Name 1",
                content: "Content"
            }
        }
     */
    @GetMapper(ArticleDto)
    getArticleById(articleId) {
        return axios.get(`/article/${articleId}`);
    },

    /*
        пример получения массива объектов
        запрос вернет следующий JSON: {
            status: 200,
            statusText: 'OK',
            headers: {},
            config: {},
            request: {},
            data: [
                {
                    article_id: 1,
                    article_name: "Name 1",
                    content: "Content"
                },
                {
                    article_id: 2,
                    article_name: "Name 2",
                    content: "Content"
                },
                {
                    article_id: 3,
                    article_name: "Name 3",
                    content: "Content"
                }
            ]
        }
     */
    @GetMapper(ArticleDto)
    getAllArticles() {
        return axios.get(`/article/all`);
    },

    /*
        пример удаления
        запрос вернет следующий JSON: {
            status: 200,
            statusText: 'OK',
            headers: {},
            config: {},
            request: {},
            data: {
                article_id: 1,
                article_name: "Name 1",
                content: "Content"
            }
        }
     */
    @DeleteMapper(ArticleDto)
    deleteArticleById(articleId) {
        return axios.delete(`/article/${articleId}`);
    }
}


getArticleById(1).then(article => {
    /*
        article = ArticleDto {
            id = 1;
            name = "Name 1";
            content = "Content";
        }
     */
});

getAllArticles().then(articles => {
    /*
        articles = [
            ArticleDto {
                id = 1;
                name = "Name 1";
                content = "Content";
            },
            ArticleDto {
                id = 2;
                name = "Name 2";
                content = "Content";
            },
            ArticleDto {
                id = 3;
                name = "Name 3";
                content = "Content";
            },
        ]
     */
});

deleteArticleById(1).then(article => {
    /*
        article = ArticleDto {
            id = 1;
            name = "Name 1";
            content = "Content";
        }
     */
});
```

### 2.2. Декораторы @PostMapper и @PutMapper

@PostMapper и @PutMapper - декораторы предназначенные для конвертации ответов POST и PUT запросов. Они имеют несколько
параметров:

- modelRequest - класс DTO-модели описывающий тело запроса
- modelResponse - класс DTO-модели описывающий тело ответа. По умолчанию он будет равен modelRequest
- dtoArgNumber - индекс параметра функции в котором передается DTO для отправки в теле запроса. По умолчанию = 0.
- pathToData - путь до поля с данными ответа в JSON-е. По умолчанию = data
- strict - если true то включается строгий режим конвертации (по умолчанию false). Т.е. все поля класса должны быть
  помечены декоратором @JsonField

По обработке ответа данные декораторы работают
аналогично [@GetMapper и @DeleteMapper](#2.1_Декораторы_@GetMapper_и_@DeleteMapper).

Данные декораторы также могут конвертировать из экземпляра класса DTO-модели в JSON объект перед выполнением функции.
Для этого существуют параметры `modelRequest` и `dtoArgNumber`.

Если тело запроса и тело ответа одинаковое, то можно указать только параметр `modelRequest`.

```js
import axios from 'axios';
import {JsonField, TypeString, TypeNumber, TypeCustom, PostMapper, PutMapper} from '@dlabs71/d-dto';

class ArticleDto {
    @JsonField("article_id") @TypeNumber id;
    @JsonField("article_name") @TypeString name;
    @JsonField("content") @TypeString content;
}

class SendResponseDto {
    @JsonField("request_id") @TypeNumber requestId;
    @JsonField("request_status") @TypeString requestStatus;
    @JsonField("article") @TypeCustom(ArticleDto) article;
}

export default {

    /*
        пример создания объекта.
        запрос вернет следующий JSON: {
            status: 200,
            statusText: 'OK',
            headers: {},
            config: {},
            request: {},
            data: {
                article_id: 1,
                article_name: "Name 1",
                content: "Content"
            }
        }
     */
    @PostMapper(ArticleDto)
    createArticle(articleDto) {
        /*
            Так как указан декоратор @PostMapper, то перед выполнением данной функции параметр articleDto
            будет конвертирован в JSON объект. 
            И здесь он уже будет равен:
            articleDto = {
                article_id: 1,
                article_name: "Name 1",
                content: "Content"
            }
         */
        return axios.post(`/article`, articleDto);
    },

    /*
        пример создания объекта.
        запрос вернет следующий JSON: {
            status: 200,
            statusText: 'OK',
            headers: {},
            config: {},
            request: {},
            data: {
                request_id: 1,
                request_status: "SUCCESS",
                article: {
                    article_id: 1,
                    article_name: "Name 1",
                    content: "Content"
                }
            }
        }
     */
    @PostMapper(ArticleDto, SendResponseDto, 2)
    sendArticle(userIdFrom, userIdTo, articleDto) {
        /*
            Так как указан декоратор @PostMapper, то перед выполнением данной функции параметр с 
            индексом = 2 т.е. articleDto будет конвертирован в JSON объект. 
            И здесь он уже будет равен:
            articleDto = {
                article_id: 1,
                article_name: "Name 1",
                content: "Content"
            }
         */
        return axios.post(`/article/send/${userIdFrom}/${userIdTo}`, articleDto);
    },

    /*
        пример обновления объекта.
        запрос вернет следующий JSON: {
            status: 200,
            statusText: 'OK',
            headers: {},
            config: {},
            request: {},
            data: {
                article_id: 1,
                article_name: "Article Name",
                content: "Content article"
            }
        }
     */
    @PutMapper(ArticleDto)
    updateArticle(articleDto) {
        /*
            Так как указан декоратор @PutMapper, то перед выполнением данной функции параметр articleDto
            будет конвертирован в JSON объект. 
            И здесь он уже будет равен:
            articleDto = {
                article_id: 1,
                article_name: "Article Name",
                content: "Content article"
            }
         */
        return axios.put(`/article`, articleDto);
    },
}

let articleDto = new ArticleDto();
articleDto.id = 1;
articleDto.name = "Name 1";
articleDto.content = "Content";

createArticle(articleDto).then(article => {
    /*
        article = ArticleDto {
            id = 1;
            name = "Name 1";
            content = "Content";
        }
     */
});

sendArticle(1, 2, articleDto).then(sendResponse => {
    /*
        sendResponse = SendResponseDto {
            requestId = 1;
            requestStatus = "SUCCESS";
            article = ArticleDto {
                id = 1;
                name = "Name 1";
                content = "Content";
            }
        }
     */
});

articleDto.name = "Article Name";
articleDto.content = "Content article";
updateArticle(articleDto).then(article => {
    /*
        article = ArticleDto {
            id = 1;
            name = "Article Name";
            content = "Content article";
        }
     */
});
```

### 2.3. Декораторы @StorableGetMapper и @VuexGetMapper

@StorableGetMapper и @VuexGetMapper - декораторы работающие аналогично @GetMapper и умеющие кэшировать результаты
выполнения функции. И соответственно, при повторном вызове брать данные из кэша.

#### 2.3.1. Декоратор @StorableGetMapper

@StorableGetMapper - общий кэширующий декоратор, требующий описания функций сохранения и получения из кэша данных. Он не
только умеет работать с функциями возвращающими всегда одни и те же данные, но и сохранять данные в зависимости от
параметров функции.

Параметры:

- modelResponse - класс DTO-модели описывающий тело ответа
- separateStorageConf - конфигурация раздельного хранения данных на основе параметров функции.

```
  separateStorageConf = {
     argIdx: 1 // индекс параметра функции на основе которого будет происходить раздельное сохранение результата
     conditions: { // условия для параметров функции, которые должны быть выполнены, чтобы произошло сохранение в кэш
         arg_0: value => !!value,
         arg_1: value => !!value,
         arg_2: value => !!value
     }
 }
```

- saveToStoreFn - функция для сохранения данных в кэш. Принимает один аргумент — данные, которые нужно сохранить
- getFromStoreFn - функция получения данных из кэша.
- pathToData - путь до поля с данными ответа в JSON-е. По умолчанию = data
- strict - если true то включается строгий режим конвертации (по умолчанию false). Т.е. все поля класса должны быть
  помечены декоратором @JsonField

**`cache.js`**

```js
/**
 * Кэш для хранения справочников
 */
let CACHE = {};

/**
 * Функция сохранения данных в кэше
 * @param data - данные для сохранения
 * @param lookupName - имя справочника для его дальнейшей идентификации
 */
export function saveToCache(data, lookupName) {
    CACHE[lookupName] = data;
}

/**
 * Функция получения данных из кэша
 * @param lookupName - имя справочника (идентификатор)
 */
export function getFromCache(lookupName) {
    return CACHE[lookupName];
}
```

**`example.js`**

```js
import axios from 'axios';
import {saveToCache, getFromCache} from 'cache.js';
import {JsonField, TypeString, TypeNumber, StorableGetMapper} from '@dlabs71/d-dto';

class LookupDto {
    @JsonField("value") @TypeNumber value;
    @JsonField("title") @TypeString title;
}

export default {

    /*
       запрос вернет следующий JSON: {
           status: 200,
           statusText: 'OK',
           headers: {},
           config: {},
           request: {},
           data: [
                {value: 1, title: "Type 1"},
                {value: 2, title: "Type 2"},
                {value: 3, title: "Type 3"},
           ]
       }
    */
    @StorableGetMapper(
            LookupDto,
            null,
            (data) => saveToCache(data, "articleTypes"),
            () => getFromCache("articleTypes")
    )
    getArticleTypes() {
        return axios.get(`/article/types`);
    },

    /*
       При articleTypeValue = 1 запрос вернет следующий JSON: 
       {
           status: 200,
           statusText: 'OK',
           headers: {},
           config: {},
           request: {},
           data: [
                {value: 1, title: "Kind 1 1"},
                {value: 2, title: "Kind 1 2"},
                {value: 3, title: "Kind 1 3"},
           ]
       },
       
       При articleTypeValue = 2 запрос вернет следующий JSON: 
       {
           status: 200,
           statusText: 'OK',
           headers: {},
           config: {},
           request: {},
           data: [
                {value: 4, title: "Kind 2 1"},
                {value: 5, title: "Kind 2 2"},
                {value: 6, title: "Kind 2 3"},
           ]
       },
       
       При articleTypeValue = 2 и userId = 1 запрос вернет следующий JSON: 
       {
           status: 200,
           statusText: 'OK',
           headers: {},
           config: {},
           request: {},
           data: [
                {value: 7, title: "Kind 2 1 1"},
                {value: 8, title: "Kind 2 1 2"},
                {value: 9, title: "Kind 2 1 3"},
           ]
       }
    */
    @StorableGetMapper(
            LookupDto,
            {
                argIdx: 0, // это означает что раздельное хранение необходимо организовывать на основе articleTypeValue
                conditions: {
                    arg_0: value => !!value, // это означает что articleTypeValue не должно быть пустым
                    arg_1: value => value === null // это означает что userId должен быть null
                }
            },
            (data) => saveToCache(data, "articleTypes"),
            () => getFromCache("articleTypes")
    )
    getArticleKinds(articleTypeValue, userId) {
        return axios.get(`/article/kinds/${articleTypeValue}/${userId}`);
    }
}

getArticleTypes().then(result => {
    /*
        result = [
            LookupDto {value: 1, title: "Type 1"},
            LookupDto {value: 2, title: "Type 2"},
            LookupDto {value: 3, title: "Type 3"}
        ]
     */

    /*
        При повторном вызове данной функции, оргинальная функция уже не будет вызвана, а результат выполнения будет
        взят из кэша.
     */
});

getArticleKinds(1, null).then(result => {
    /*
        result = [
            LookupDto {value: 1, title: "Kind 1 1"},
            LookupDto {value: 2, title: "Kind 1 2"},
            LookupDto {value: 3, title: "Kind 1 3"}
        ]
     */


    /*
        При повторном вызове данной фкнкции с аналогичными параметрами, результат будет взят из кэша.
     */
});

getArticleKinds(2, null).then(result => {
    /*
        result = [
            LookupDto {value: 4, title: "Kind 2 1"},
            LookupDto {value: 5, title: "Kind 2 2"},
            LookupDto {value: 6, title: "Kind 2 3"}
        ]
     */


    /*
        При повторном вызове данной фкнкции с аналогичными параметрами, результат будет взят из кэша.
     */
});

getArticleKinds(2, 1).then(result => {
    /*
        result = [
            LookupDto {value: 7, title: "Kind 2 1 1"},
            LookupDto {value: 8, title: "Kind 2 1 2"},
            LookupDto {value: 9, title: "Kind 2 1 3"}
        ]
     */


    /*
        Так как второе условие в условиях сохранения в кэш не выполняется (userId != null), то результат 
        выполнения не будет сохранен в кэш. А значит при повторном вызове функции данные также будут запрошенны
        с сервера.
     */
});
```

#### 2.3.2. Декоратор @VuexGetMapper

@VuexGetMapper - частный случай декоратора @StorableGetMapper, предназначенный для сохранения кэша во VUEX хранилище.
Обладает следующими параметрами:

- store - экземпляр Vuex хранилища.
- modelResponse - класс DTO-модели описывающий тело ответа
- lookupName - идентификатор данных в кэше
- separateStorageConf - конфигурация раздельного хранения данных на основе параметров функции. Пример смотрите в пункте
  про [@StorableGetMapper](#2.3.1_Декоратор_@StorableGetMapper)
- pathToData - путь до поля с данными ответа в JSON-е. По умолчанию = data
- strict - если true то включается строгий режим конвертации (по умолчанию false). Т.е. все поля класса должны быть
  помечены декоратором @JsonField

Также библиотека предоставляет готовый модуль Vuex хранилища для хранения данных.
**`store.js`**

```js
import Vue from "vue";
import Vuex from "vuex";
import {serviceCacheModule} from '@dlabs71/d-dto';

const state = {};

const getters = {};

const mutation = {};

const actions = {};

export default new Vuex.Store({
    plugins: [],
    modules: {
        "serviceCache": serviceCacheModule
    },
    state,
    getters,
    mutation,
    actions,
    strict: true,
});
```

**`example.js`**

```js
import axios from 'axios';
import store from 'store.js';
import {JsonField, TypeString, TypeNumber, VuexGetMapper} from '@dlabs71/d-dto';

class LookupDto {
    @JsonField("value") @TypeNumber value;
    @JsonField("title") @TypeString title;
}

export default {

    /*
       запрос вернет следующий JSON: {
           status: 200,
           statusText: 'OK',
           headers: {},
           config: {},
           request: {},
           data: [
                {value: 1, title: "Type 1"},
                {value: 2, title: "Type 2"},
                {value: 3, title: "Type 3"},
           ]
       }
    */
    @VuexGetMapper(store, LookupDto)
    getArticleTypes() {
        return axios.get(`/article/types`);
    },

    /*
       При articleTypeValue = 1 запрос вернет следующий JSON: 
       {
           status: 200,
           statusText: 'OK',
           headers: {},
           config: {},
           request: {},
           data: [
                {value: 1, title: "Kind 1 1"},
                {value: 2, title: "Kind 1 2"},
                {value: 3, title: "Kind 1 3"},
           ]
       },
       
       При articleTypeValue = 2 запрос вернет следующий JSON: 
       {
           status: 200,
           statusText: 'OK',
           headers: {},
           config: {},
           request: {},
           data: [
                {value: 4, title: "Kind 2 1"},
                {value: 5, title: "Kind 2 2"},
                {value: 6, title: "Kind 2 3"},
           ]
       },
       
       При articleTypeValue = 2 и userId = 1 запрос вернет следующий JSON: 
       {
           status: 200,
           statusText: 'OK',
           headers: {},
           config: {},
           request: {},
           data: [
                {value: 7, title: "Kind 2 1 1"},
                {value: 8, title: "Kind 2 1 2"},
                {value: 9, title: "Kind 2 1 3"},
           ]
       }
    */
    @VuexGetMapper(
            store,
            LookupDto,
            {
                argIdx: 0, // это означает что раздельное хранение необходимо организовывать на основе articleTypeValue
                conditions: {
                    arg_0: value => !!value, // это означает что articleTypeValue не должно быть пустым
                    arg_1: value => value === null // это означает что userId должен быть null
                }
            }
    )
    getArticleKinds(articleTypeValue, userId) {
        return axios.get(`/article/kinds/${articleTypeValue}/${userId}`);
    }
}

getArticleTypes().then(result => {
    /*
        result = [
            LookupDto {value: 1, title: "Type 1"},
            LookupDto {value: 2, title: "Type 2"},
            LookupDto {value: 3, title: "Type 3"}
        ]
     */

    /*
        При повторном вызове данной функции, оргинальная функция уже не будет вызвана, а результат выполнения будет
        взят из кэша.
     */
});

getArticleKinds(1, null).then(result => {
    /*
        result = [
            LookupDto {value: 1, title: "Kind 1 1"},
            LookupDto {value: 2, title: "Kind 1 2"},
            LookupDto {value: 3, title: "Kind 1 3"}
        ]
     */


    /*
        При повторном вызове данной фкнкции с аналогичными параметрами, результат будет взят из кэша.
     */
});

getArticleKinds(2, null).then(result => {
    /*
        result = [
            LookupDto {value: 4, title: "Kind 2 1"},
            LookupDto {value: 5, title: "Kind 2 2"},
            LookupDto {value: 6, title: "Kind 2 3"}
        ]
     */


    /*
        При повторном вызове данной фкнкции с аналогичными параметрами, результат будет взят из кэша.
     */
});

getArticleKinds(2, 1).then(result => {
    /*
        result = [
            LookupDto {value: 7, title: "Kind 2 1 1"},
            LookupDto {value: 8, title: "Kind 2 1 2"},
            LookupDto {value: 9, title: "Kind 2 1 3"}
        ]
     */


    /*
        Так как второе условие в условиях сохранения в кэш не выполняется (userId != null), то результат 
        выполнения не будет сохранен в кэш. А значит при повторном вызове функции данные также будут запрошенны
        с сервера.
     */
});
```

## 3. Использование функций мапперов

Библиотека предоставляет готовые функции-мапперы для конвертации из DTO-модели в JSON и обратно.

Функция `c2jMapperWrapper` - предназначена для конвертации из DTO-модели в JSON. Параметры данной функции:

- dtoModel - экземпляр класса DTO-модели
- skipIfNotDefine - пропускать атрибуты класса не помеченные декоратором @JsonField. Если false - будет исключение.

Функция `j2cMapperWrapper` - предназначена для конвертации из JSON в DTO-модель. Параметры данной функции:

- jsonObj - исходный JSON объект
- DtoModel - класс DTO-модели
- skipIfNotDefine - пропускать атрибуты класса не помеченные декоратором @JsonField. Если false - будет исключение.

```js
class PersonDto {
    @JsonField("first_name") @TypeString firstName;
    @JsonField("second_name") @TypeString secondName;
    @JsonField("age") @TypeNumber age;
}

let dto = new PersonDto();
dto.firstName = "Danila";
dto.secondName = "Ivanov";
dto.age = 24;

let json = c2jMapperWrapper(dto);
/*
json = {
    first_name: "Danila",
    second_name: "Ivanov",
    age: 24
}
 */
```

```js
class PersonDto {
    @JsonField("first_name") @TypeString firstName;
    @JsonField("second_name") @TypeString secondName;
    @JsonField("age") @TypeNumber age;
}

let sourceJson = {
    first_name: "Danila",
    second_name: "Ivanov",
    age: 24
};

let dto = j2cMapperWrapper(sourceJson, PersonDto);

/*
dto = PersonDto {
    firstName = "Danila"
    secondName = "Ivanov"
    age = 24
}
 */
```

[npm-image]: https://img.shields.io/npm/v/@dlabs71/d-dto

[npm-url]: https://www.npmjs.com/package/@dlabs71/d-dto

[license-image]: https://img.shields.io/badge/license-MIT-blue.svg

[license-url]: LICENSE