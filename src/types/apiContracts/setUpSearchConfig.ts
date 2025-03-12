import { TJustJoinItSeniorities, TJustJoinItCategories, TNoFluffJobsCategories, TNoFluffJobsSeniorities, TNoFluffJobsTechnologies } from "..";

export interface ICreateSearchConfig {
    justJoinIt: IJustJoinItConfig;
    noFluffJobs: INoFluffJobsConfig;
    companyRating: string;
    userId: string;
};

export interface IJustJoinItConfig {
    searchLine: string;
    excludeSearchLine: string;
    category: TJustJoinItCategories;
    seniorities: TJustJoinItSeniorities[]
};

export interface INoFluffJobsConfig {
    searchLine: string;
    excludeSearchLine: string;
    categories: TNoFluffJobsCategories[];
    seniorities: TNoFluffJobsSeniorities[];
    technologies: TNoFluffJobsTechnologies[];
};
