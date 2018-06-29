var express = require("express");
var bodyParser = require("body-parser");
var url = require('url');
var inits = require('inits');
var fs = require('fs');

var app = express();

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

var winston = require('winston');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;
 
// Connection URL
const mongoURL = 'mongodb://localhost:27017';
 
// Database Name
const dbName = 'cadc';

var db;
var globalClient;

inits.init(function(callback)
{
    MongoClient.connect(mongoURL, function(err, client) {
        if (err)
        {
            logger.error('failure - ' + err);
            callback(err);
        }
        globalClient = client
        db = client.db(dbName);
        logger.info("Mongo DB Connection is created.");
        callback(null);
    });
});

inits.finish(function(callback)
{
    globalClient.close();
    logger.info("Mongo DB Connection is closed.");
    callback(null);
});

const myFormat = printf(info => {
    return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
  });

const logger = winston.createLogger({
    level: 'info',
    format: combine(
        label({ label: 'dmm-ui-backend-api' }),
        timestamp(),
        myFormat
      ),
    transports: [
      //
      // - Write to all logs with level `info` and below to `combined.log` 
      // - Write all logs error (and below) to `error.log`.
      //
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' })
    ]
  });
  
  //
  // If we're not in production then log to the `console` with the format:
  // `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
  // 
  if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: combine(
            label({ label: 'dmm-ui-backend-api' }),
            timestamp(),
            myFormat
          )
    }));
  }

// parse application/x-www-form-urlencoded
// for easier testing with Postman or plain HTML forms
app.use(bodyParser.urlencoded({
  extended: true
}));

// parse application/json
app.use(bodyParser.json())


app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Pass to next layer of middleware
    next();
});

app.get('/categories/entireTree', (req, res) => {

    logger.info('Request URL - ' + req.url);

    MongoClient.connect(mongoURL, function(err, client) {
        assert.equal(null, err);
        const db = client.db(dbName);
        const collection = db.collection('categories');
        collection.find({}).project({ name: 1, catDisplayName: 1, catLevel: 1, descendants: 1}).toArray(function(err, docs) {
            if (err) {
                logger.error('failure - ' + err);
                res.send({'error':'An error has occurred - ' + err});
            } else {
                // Convert Json Array to Map
                var categoryMap = {};
                docs.forEach(function myFunction(category) {
                    categoryMap[category._id] = category;
                })

                // Start Building the Tree
                var tree = {};
                var key = "0-0";
                tree["name"] = "master";
                tree["key"] = key;
                tree["nodeType"] = "category";
                tree["childNodes"] = [];

                // Read the list of locales
                require('fs').readFile('locales.json', 'utf8', function (err, data) {
                    if (err) {
                        logger.error('failure - ' + err);
                        res.send({'error':'An error has occurred - ' + err});
                    } else {                
                        key = key + "-";
                        var index = 0;
                        var locales = JSON.parse(data);
                        
                        locales.forEach(function myFunction(locale) {
                            var localeId = "_" + locale.toLowerCase()
                            var newKey = key + index
                            var newNode = {};
                            newNode["name"] = locale;
                            newNode["key"] = newKey;
                            newNode["childNodes"] = [];
                            var currentMasterId = "urn:sony:category:web_category:electronics";
                            var currentCatLevel = 0;
                            var currentNode = categoryMap[currentMasterId + localeId];
                            newNode["childNodes"].push(buildCategoryTree(categoryMap, currentNode, currentCatLevel, newKey + "-0", localeId))
                            tree["childNodes"].push(newNode);
                            index += 1;
                        })

                        res.send(tree);
                    }
                });
            }
            logger.info("Closing Connection");
            client.close();
        });
    });

      
});

app.get('/categories/tree', (req, res) => {
    
    logger.info('Request URL - ' + req.url);

    const collection = db.collection('categories');
    collection.find({locale: "en_GL"}).project({ name: 1, catDisplayName: 1, masterId: 1, catLevel: 1, descendants: 1}).toArray(function(err, docs) {
        if (err) {
            logger.error('failure - ' + err);
            res.send({'error':'An error has occurred - ' + err});
        } else {
            // Convert Json Array to Map
            var categoryMap = {};
            docs.forEach(function myFunction(category) {
                categoryMap[category._id] = category;
            })

            // Start Building the Tree
            var key = "0-0";
            var localeId = "_en_gl";
            var currentMasterId = "urn:sony:category:web_category:electronics";
            var currentCatLevel = 0;
            var currentNode = categoryMap[currentMasterId + localeId];
            var tree = buildCategoryTree(categoryMap, currentNode, currentCatLevel, key, localeId);
            res.send(tree);
        }
    });
});

app.get('/locale', function(req, res){

    logger.info('Request URL - ' + req.url);
    
    require('fs').readFile('locale.json', 'utf8', function (err, data) {
        if (err) 
           // error handling
           logger.error('failure - ' + err);
        var obj = JSON.parse(data);
        res.send(JSON.parse(data));
    });

});

app.get('/categoryproduct/tree', (req, res) => {

    logger.info('Request URL - ' + req.url);

    const collection = db.collection('categories');
    collection.find({locale: "en_GL"}).project({ _id: 0, name: 1, catDisplayName: 1, masterId: 1, catLevel: 1, descendants: 1}).toArray(function(err, docs) {
        if (err) {
            logger.error('failure - ' + err);
            res.send({'error':'An error has occurred - ' + err});
        } else if (docs.length == 0) {
            let errorMessage = "No records found in database for table - categories - locale - en_GL";
            logger.error(errorMessage);
            res.status(404);
            res.send({'error':'An error has occurred - ' + errorMessage});
        } else {
            // Convert Json Array to Map
            var categoryMap = {};
            docs.forEach(function myFunction(category) {
                categoryMap[category.masterId] = category;
            })

            const collection = db.collection('products');
            collection.find({ locale: "en_GL" }).project({ _id: 0, name: 1, masterId: 1, type: 1, parentId: 1, categories: 1}).toArray(function(err, pr_docs) {
                if (err) {
                    logger.error('failure - ' + err);
                    res.send({'error':'An error has occurred - ' + err});
                } else {
                    // Convert Json Array to Map
                    var productMap = {};
                    pr_docs.forEach(function myFunction(product) {
                        productMap[product.masterId] = product;
                    })

                    // Create Parent ID based lookup
                    var productParentLookup = {}
                    pr_docs.forEach(function myFunction(product) {
                        if (product.parentId) {
                            if (productParentLookup[product.parentId]) {
                                productParentLookup[product.parentId].push(product.masterId); 
                            } else {
                                productParentLookup[product.parentId] = [product.masterId];
                            }
                        } else if (product.categories && product.categories.globalWebClassification) {
                            var categoryMasterId = product.categories.globalWebClassification[0];
                            if (productParentLookup[categoryMasterId]) {
                                productParentLookup[categoryMasterId].push(product.masterId); 
                            } else {
                                productParentLookup[categoryMasterId] = [product.masterId];
                            }
                        }
                    })

                    // Start Building the Tree
                    var key = "0-0";
                    var currentMasterId = "urn:sony:category:web_category:electronics";
                    var currentCatLevel = 0;
                    var currentNode = categoryMap[currentMasterId];
                    var tree = buildCategoryProductTree(categoryMap, productMap, productParentLookup, currentNode, currentCatLevel, key);
                    res.send(tree);
                }
            });
        }
    });
});

app.get('/categories', (req, res) => {

    logger.info('Request URL - ' + req.url);

    var categoryMasterId = url.parse(req.url, true).query.category_master_id;
    var locale = url.parse(req.url, true).query.locale;

    const collection = db.collection('categories');
    collection.find({"masterId": categoryMasterId, "locale": locale}).project({dependents: 0, descendants: 0}).toArray(function(err, docs) {
        if (err) {
            logger.error('failure - ' + err);
            res.send({'error':'An error has occurred - ' + err});
        } else if (docs.length == 0) {
            let errorMessage = "No records found in database for table - categories, locale - " + locale + ", masterId - " + categoryMasterId;
            logger.error(errorMessage);
            res.status(404);
            res.send({'error':'An error has occurred - ' + errorMessage});
        } else {
            var key = "0-0";
            var heirarchyTree = buildCategoryHeirarchy(docs[0], key, "");
            heirarchyTree["nodeType"] = "category";
            res.send(heirarchyTree);
        }
    });
});

app.get('/products', (req, res) => {

    logger.info('Request URL - ' + req.url);

    var productMasterId = url.parse(req.url, true).query.product_master_id;
    var locale = url.parse(req.url, true).query.locale;

    const collection = db.collection('products');
    collection.find({"masterId": productMasterId, "locale": locale}).project({dependents: 0, descendants: 0}).toArray(function(err, docs) {
        if (err) {
            logger.error('failure - ' + err);
            res.send({'error':'An error has occurred - ' + err});
        } else if (docs.length == 0) {
            let errorMessage = "No records found in database for table - products, locale - " + locale + ", masterId - " + productMasterId;
            logger.error(errorMessage);
            res.status(404);
            res.send({'error':'An error has occurred - ' + errorMessage});
        } else {
            var key = "0-0";
            var nodeType = docs[0].type.split(":").pop();
            var heirarchyTree = buildCategoryHeirarchy(docs[0], key, "");
            heirarchyTree["nodeType"] = nodeType;
            res.send(heirarchyTree);
        }
    });
});

app.get('/', (req, res) => {

    logger.info('Request URL - ' + req.url);

    require('fs').readFile('categories.json', 'utf8', function (err, data) {
        if (err) 
           // error handling
           logger.error('failure - ' + err);
        var obj = JSON.parse(data);
        res.send(JSON.parse(data));
    });
    //res.json({"message": "Welcome to EasyNotes application. Take notes quickly. Organize and keep track of all your notes."});
});





app.listen(4000, function() {
  logger.info("Express running....");
});

function buildCategoryTree(categoryMap, currentNode, currentCatLevel, key, locale) {

    var tree = {};
    tree["name"] = currentNode.name;
    tree["masterId"] = currentNode.masterId;
    tree["key"] = key;
    tree["nodeType"] = "category";
    tree["childNodes"] = [];

    /********* Check for Descendents Array and build sub tree **********/
	if (currentNode.descendants.length > 0) {
        key = key + "-";
        currentCatLevel += 1;
        var index = 0;
        currentNode.descendants.forEach((childMasterId)=> {
            var childNode = categoryMap[childMasterId + locale];
            if (childNode) {
                if (childNode.catLevel == currentCatLevel) {
                    var newKey = key + index;
                    tree["childNodes"].push(buildCategoryTree(categoryMap, childNode, currentCatLevel, newKey, locale));
                    index += 1;
                }
            }
        });
    }
	return tree;
}

function buildCategoryHeirarchy(category, hKey, objectKeyName) {

    var heirarchy = {};
    heirarchy["key"] = hKey;
    heirarchy["name"] = objectKeyName;
    heirarchy["childNodes"] = [];
    hKey = hKey + "-";

    if (typeof category === 'number' || typeof category === 'boolean' || category === null || typeof category === 'string') {
        // ToDo for Array of String and Numbers
    }
	/*********CHECK FOR ARRAY**********/
	else if (Array.isArray(category)) {
		//check for empty array
		if (category[0] === undefined)
            heirarchy;
		else {
            var arrayIndex = 0;
            var arrVals = [];
			category.forEach((el)=> {
                if (typeof el === 'number' || typeof el === 'boolean' || el === null || typeof el === 'string') {
                    arrVals.push(el);
                } else {
                    var newHKey = hKey + arrayIndex;
                    heirarchy["childNodes"].push(buildCategoryHeirarchy(el, newHKey, arrayIndex.toString()));
                    arrayIndex += 1;
                }
            });
            if (arrVals.length > 0) {
                heirarchy[objectKeyName] = arrVals;
            }
		}
	}
	/*********CHECK FOR OBJECT**********/
	else if (category instanceof Object) {
		//get object keys
		var objKeys = Object.keys(category);
        //set key output
        var index = 0;
		objKeys.forEach((key)=> {
			var keyValOut = category[key];
			//skip functions and undefined properties
			if (keyValOut instanceof Function || typeof keyValOut === undefined)
                heirarchy;
			else if (typeof keyValOut === 'boolean' || typeof keyValOut === 'number' || keyValOut === null || typeof keyValOut === 'string')
                heirarchy[key] = keyValOut;
            else if (Array.isArray(keyValOut)) {
                //check for empty array
                if (keyValOut[0] === undefined)
                    heirarchy;
                else {
                    var arrayIndex = 0;
                    var arrVals = [];
                    keyValOut.forEach((el)=> {
                        if (typeof el === 'number' || typeof el === 'boolean' || el === null || typeof el === 'string') {
                            arrVals.push(el);
                        }
                    });
                    if (arrVals.length > 0) {
                        heirarchy[key] = arrVals;
                    } else {
                        var newHKey = hKey + index;
                        heirarchy["childNodes"].push(buildCategoryHeirarchy(keyValOut, newHKey, key));
                        index += 1;
                    }
                }
            }
			//check for nested objects, call recursively until no more objects
			else if (keyValOut instanceof Object) {
                var newHKey = hKey + index;
                heirarchy["childNodes"].push(buildCategoryHeirarchy(keyValOut, newHKey, key));
                index += 1;
			}
		});
    }
    return heirarchy;
}

function buildCategoryProductTree(categoryMap, productMap, productParentLookup, currentNode, currentCatLevel, key) {

    var tree = {};
    tree["name"] = currentNode.name;
    tree["masterId"] = currentNode.masterId;
    tree["key"] = key;
    tree["nodeType"] = "category";
    tree["childNodes"] = [];

    /********* Check for Descendents Array and build sub tree **********/
    var index = 0;
    key = key + "-";
	if (currentNode.descendants.length > 0) {
        currentCatLevel += 1;
        currentNode.descendants.forEach((childMasterId)=> {
            var childNode = categoryMap[childMasterId];
            if (childNode) {
                if (childNode.catLevel == currentCatLevel) {
                    var newKey = key + index;
                    tree["childNodes"].push(buildCategoryProductTree(categoryMap, productMap, productParentLookup, childNode, currentCatLevel, newKey));
                    index += 1;
                }
            }
        });
    }

    // Check if any Child Products are there
    tree = getChildProducts(tree, key, index, productMap, productParentLookup);
	return tree;
}

function getChildProducts(tree, key, index, productMap, productParentLookup) {
    var childProducts = productParentLookup[tree.masterId];
    if (childProducts) {
        var productNodes = [];
        childProducts.forEach((productMasterId)=> {
            var childProduct = productMap[productMasterId];
            if (childProduct) {
                var newKey = key + index;
                var productNode = {};
                productNode["name"] = childProduct.name;
                productNode["masterId"] = childProduct.masterId;
                productNode["key"] = newKey;
                productNode["nodeType"] = childProduct.type.split(":").pop();
                productNode["childNodes"] = [];
                productNode = getChildProducts(productNode, newKey + "-", 0, productMap, productParentLookup);
                productNodes.push(productNode);
                index += 1;
            }
        });
        tree["childNodes"] = tree["childNodes"].concat(productNodes);
    }
	return tree;
}