const state = {
    lookups: [],
};

const getters = {
    getLookup: (st) => (lookupName) => st.lookups[lookupName],
};

const mutations = {
    SAVE_LOOKUP: (st, data) => {
        st.lookups[data.name] = data.data;
    },
};

const actions = {
    saveLookup({ commit }, data) {
        commit('SAVE_LOOKUP', data);
    },
};

export const SERVICE_CACHE_ACTIONS = {
    saveLookup: 'serviceCache/saveLookup',
};
export const SERVICE_CACHE_GETTERS = {
    getLookup: 'serviceCache/getLookup',
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};
