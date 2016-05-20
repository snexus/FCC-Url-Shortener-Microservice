'use strict';

var path = process.cwd();
var useragent = require('useragent');

var urlShortener = require(path + '/app/controllers/urlShortener.js');
module.exports = function (app) {
	
	app.route('/')
		.get(function (req, res) {
		res.sendFile(path + '/public/index.html');
		});

	app.route('/new/:url*')
		.get(function (req, res) {

			var url = req.params.url+req.params['0'];
			urlShortener.getShort(url, function(err, shortUrl){
							if (err) {return res.json({"error":"An error has occured"});}
							else{
							return res.json(shortUrl);
							}
			});


		
		});
	app.route("/:shortUrl").get(function (req, res) {
			var shortUrl = req.params.shortUrl;
			console.log("shortUrl = ", shortUrl);
			urlShortener.getLong(shortUrl, function(err, longUrl){
					if (err)  {return res.json({"error":"An error has occured"});}
					else{
						if (longUrl == "URL Error")
						{
							return res.json({"error":"The shortened URL wasn't found in database"});
						}
						else
						{
							return res.redirect(longUrl);
						}
					}
			});

		});
	
};
