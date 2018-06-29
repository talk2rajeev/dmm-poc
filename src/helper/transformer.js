export function test(){
    return 1;
}

export function transformCoreData(){

}

export function mergeKeys(arr){
    let newObj={};

    arr.forEach(el=>{ 
        newObj = Object.assign({},el,newObj); 
    });
    let deepCopy = JSON.stringify(newObj);
    return JSON.parse(deepCopy);
}

export function transformProductData(data){
    return data.map(el=>{
        return {key: el, name: el}
    })
}

let name=null;

export function getCheckedTreeNodesArray(tree, keyArr){
    let newArr = [];
    keyArr.forEach(item=>{
        name=null;
        newArr.push({key: item.key, name: getCheckedTreeNodeDispayName(tree, item.key) });
    })
    return newArr;
}

export function getCheckedTreeNodeDispayName(tree, pattern){  
    if(tree && tree.length > 0){
        tree.forEach( (item) => {
            item.key.includes(pattern) ? name=item.name : getCheckedTreeNodeDispayName(item.childNodes, pattern);
        });
    } 
    return name;
}

export function contains(root, n) {
    let node = n;
    while (node) {
        if (node === root) {
        return true;
        }
        node = node.parentNode;
    }
    return false;
}

/*

1. FUNCTION: Join Master + Locale(s) object and create master-key
2. FUNCTION: Create a associative array with provided master-Key and value from Locale-Result
3. FUNCTION: 







    
 
    */
/*
   

*/   