import { Schema, model } from 'mongoose';

const searchConfigs = new Schema({
    justJoinIt: {
        searchLine: {
            type: String,
        },
        excludeSearchLine: {
            type: String,
        },
        category: {
            type: String,
        },
        seniorities: {
            type: Array,
        },
    },
    noFluffJobsConfig: {
        searchLine: {
            type: String,
        },
        excludeSearchLine: {
            type: String,
        },
        categories: {
            type: Array,
        },
        seniorities: {
            type: Array,
        },
        technologies: {
            type: Array,
        },
    },

    companyRating: {
        type: Number,
    },
    userId: {
        required: true,
        type: String,
    }
});

export const SearchConfigsModel = model('search-configs', searchConfigs)
