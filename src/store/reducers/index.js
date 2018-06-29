import { combineReducers } from 'redux'

import {
    GET_CATEGORY_TREE,
    GET_LOCALES,
    GET_FIELD_TREE,
    SET_SELECTED_KEY_IN_MAINTENANCE_TREE,
    SET_SELECTED_KEY_IN_EXPORT_PAGE_TREE
} from '../actions/index';


export const getCategoryTree = (state={}, action) => {
    switch(action.type){
        case GET_CATEGORY_TREE:
            return  { ...state, categoryTree: action.categoryTree }           
        default: 
            return state;
    }
}

export const getLocales = (state=[], action) => {
    switch(action.type){
        case GET_LOCALES:
            return  { ...state, locales:action.locales }         
        default: 
            return state;
    }
}

export const getTreeBranch = (state={}, action) => {
    switch(action.type){
        case GET_FIELD_TREE:
            return  { ...state, fieldTree: action.fieldTree }         
        default: 
            return state;
    }
}

export const selectedKeysInMaintenance = (state={}, action) => {
    switch(action.type){
        case SET_SELECTED_KEY_IN_MAINTENANCE_TREE:
            return  { ...state, selectedKeysInMaintenance: action.selectedKeys }         
        default: 
            return state;
    }
}

export const selectedKeysInExport = (state={}, action) => {
    switch(action.type){
        case SET_SELECTED_KEY_IN_EXPORT_PAGE_TREE:
            return  { ...state, selectedKeysInExport: action.selectedKeys }         
        default: 
            return state;
    }
}


const allReducers = combineReducers({
    categoryTree: getCategoryTree,
    locales: getLocales,
    fieldTree: getTreeBranch,
    selectedKeysInMaintenance,
    selectedKeysInExport
});

export default allReducers;