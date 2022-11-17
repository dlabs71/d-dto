import {StoreServiceMapper} from '../service-mapper';
import {LookupElement} from 'global-lib/src/lib/json2model/examples/model-example';

export default {
    @StoreServiceMapper(store, LookupElement, "lossKinds")
    getLossKinds() {
        return new Promise(resolve => {
            resolve([
                {
                    value: 1,
                    title: "asd"
                },
                {
                    value: 2,
                    title: "asda"
                }
            ])
        });
    },

    @StoreServiceMapper(store, LookupElement, "documentKindsByST", {
        'separateArgIdx': 0,
        'conditions': {
            'arg_0': (value) => !!value,
            'arg_1': (value) => !value
        }
    })
    getDocumentKindsByMap(sectionType, documentType = null, withoutSpinner = false) {
        sectionType = sectionType.toUpperCase();
        if (documentType !== null) {
            documentType = documentType.toUpperCase();
        }
        // return axios.get(`/lookup/document-kinds/${sectionType}`, {
        //     params: {
        //         withoutSpinner: withoutSpinner,
        //         documentType: documentType
        //     }
        // });
    },

}
