var mongo = require('mongodb').MongoClient;
var db = process.env.MONGO_URI;
module.exports = {

    getShort: function(url, callback) {
        var re = /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/;
        if (!re.test(url)) {
            console.log("url check failed")
            return callback(null,{"error":"Invalid URL"});
        }
            console.log("getting short")
            var short = generateShort(7);
            processDatabase("urls", short, url, callback);
    },
    
    getLong: function(shortUrl, callback)
    {
        

          mongo.connect(db, function(err, db) {
                if (err) return "getLong: Error connecting to database";
                console.log("DB connection successful");
        
               
                var collection = db.collection("urls");
                collection.find({"shortUrl": shortUrl}).toArray(function(err, documents) {
                    if (err) console.log(err);
                    console.log("err, docs = ", err, documents);
                    if (documents.length == 0)
                    {
                       
                        return callback(err,"URL Error");
                    }
                    else 
                    {
                        return callback(err,documents[0]["longUrl"]);
                    }
                        
                });
           
                });
            }

};


function processDatabase(collectionName, shortUrl, longUrl, callback) {

    mongo.connect(db, function(err, db) {
        if (err) return "Error connecting to database";
        console.log("DB connection successful");

        console.log("short = ", generateShort(7));
        var collection = db.collection(collectionName);
        collection.find({
            "shortUrl": shortUrl
        }).toArray(function(err, documents) {
            if (err) 
                console.log(err);
                console.log("documents = ", documents);
                if (documents.length == 0)
                {
                    var obj = {"shortUrl":shortUrl, "longUrl":longUrl};
                     collection.insert(obj, function(err, data) {
                        if (err) console.log(err);
                        console.log("Insert succesfull");
                        db.close();
                        console.log(obj);
                       return callback(err, {"shortUrl":shortUrl, "longUrl":longUrl});
        });
                    
                }
                else
                {
                    db.close();
                    return callback(err,{"error":"Internal Error has occured"});
                }


        });
    });
}


function generateShort(n) {
    var short = "";
    for (var i = 0; i < n; i++) {
        short = short + String.fromCharCode(97 + Math.floor(Math.random() * 25));
    }
    return short;
}