import {PostServiceMapper, ServiceMapper} from '../service-mapper';
import {DocumentDto, OrganizationDto} from 'global-lib/src/lib/json2model/examples/model-example';

export default {

    @ServiceMapper(OrganizationDto)
    getOrganization() {
        return new Promise(resolve => {
            // simulation http response
            resolve({
                id: 4,
                code: "asdasd",
                fullName: "asadasd",
                shortName: "asdasdas",
                office: false,
                orgLevel: "1",
                parentId: 2
            })
        });
    },

    @ServiceMapper(OrganizationDto)
    getOrganizations() {
        return new Promise(resolve => {
            // simulation http response
            resolve([
                {
                    id: 4,
                    code: "asdasd",
                    fullName: "asadasd",
                    shortName: "asdasdas",
                    office: false,
                    orgLevel: "1",
                    parentId: 2
                },
                {
                    id: 4,
                    code: "asdasd",
                    fullName: "asadasd",
                    shortName: "asdasdas",
                    office: false,
                    orgLevel: "1",
                    parentId: 2
                }
            ])
        });
    },

    // documentDto = new DocumentDto()
    @PostServiceMapper(DocumentDto, DocumentDto)
    saveDocument1(documentDto) {
        return new Promise(resolve => {
            resolve()
        });
    },

    // documentDto = new DocumentDto()
    @PostServiceMapper(DocumentDto)
    saveDocument2(documentDto) {
        return new Promise(resolve => {
            resolve()
        });
    }
}
