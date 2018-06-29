import axios from 'axios';

export const GET_CATEGORY_TREE = 'GET_CATEGORY_TREE';
export const GET_LOCALES = 'GET_LOCALES';
export const GET_FIELD_TREE = 'GET_FIELD_TREE';
export const SET_SELECTED_KEY_IN_MAINTENANCE_TREE = 'SET_SELECTED_KEY_IN_MAINTENANCE_TREE';
export const SET_SELECTED_KEY_IN_EXPORT_PAGE_TREE = 'SET_SELECTED_KEY_IN_EXPORT_PAGE_TREE';


export const getLocales = () => (dispatch, getState) => {
    axios.get('http://localhost:4000/locale').then((result)=>{
      dispatch( ({type: GET_LOCALES, locales: result.data}) );
    }).catch(function (error) {
      console.log(error);
    });
}

export const getCategoryTree = () => (dispatch, getState) => {
    //let pagination = getState().pagination;
    axios.get('http://localhost:4000/categoryproduct/tree').then(result => {
      dispatch( ({type: GET_CATEGORY_TREE, categoryTree: result.data}) );
    }).catch(function (error) {
      console.log(error);
    });
}

export const getFieldTreeData = (treeBranch) => (dispatch, getState) => { 
    let url = treeBranch.nodeType === "category" ? 
              `http://localhost:4000/categories?category_master_id=${treeBranch.masterId}&locale=en_GL` :
              `http://localhost:4000/products?product_master_id=${treeBranch.masterId}&locale=en_GL`;
    axios.get(url).then(result => {
          //let url= {type: nodeType, mid: mid};
          dispatch( ({type: GET_FIELD_TREE, fieldTree: result.data}) );
    }).catch(function (error) {
        console.log(error);
    });
}

export const setSelectedKeysInMaintenance = (selectedKeys) => (dispatch) => { 
  dispatch( ({type: SET_SELECTED_KEY_IN_MAINTENANCE_TREE, selectedKeys: selectedKeys}) );
  dispatch( ({type: SET_SELECTED_KEY_IN_EXPORT_PAGE_TREE, selectedKeys: selectedKeys}) );
}
 