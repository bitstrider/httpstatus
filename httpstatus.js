var request = require('request');

if (process.argv.length < 5) {
	console.log("Usage: node recordStatus.js [urlsFilePath] [resultsFilePath] [delayInMilliseconds]");
	process.exit();
}
//get url file path from cmd arg
var urlsFilePath = process.argv[2];

//get results file path from cmd arg
var resultsFilePath = process.argv[3];

var checkDelay = process.argv[4];

//read list of urls from a file (synchronous so we can write results in the same order)
var fs = require('fs');
var urls = fs.readFileSync(urlsFilePath).toString().split("\n");

//helper variables for parsing urls
var urlsLastIdx = urls.length - 1;
var urlsIdx = 0;
var finishCount = 0; //track how many requests are finished


var recordUrlStatus = function(array, idx) {

	var url = array[idx];

	//sanitize the url for #request
	//1. add http:// if necessary
	if (url.substring(0, 4) != "http") {
		url = "http://" + url;
	}


	//check each url for 404
	request(url, function(error, response, body) {
		if (!error) {
			fs.appendFileSync(resultsFilePath, array[idx].trim() + "," + response.statusCode + "\n");
			finishCount++;
		} else {
			console.log(err);
			process.exit(1);
		}

		if (finishCount < array.length) {
			console.log("Waiting: " + (urlsLastIdx - finishCount) + " urls...");
		} else {
			console.log("Finished: results were written to "+resultsFilePath);
			process.exit();
		}
	})

}

var checkInterval;
var checkUrls = function() {
	//delete current file

	if (fs.existsSync(resultsFilePath)) {
		console.log("Warning: "+resultsFilePath+" already exists!  Timestamping...");
		resultsFilePath += "." + process.hrtime();
		//fs.unlinkSync(path);
	}

	console.log("Task: Recording the response status for " + urls.length + " urls (atleast " + estimateCheckTimeInSeconds() + " secs...)")
		

	//set up a delayed loop to check each url
	//spacing out the checks good because you can easily overload your bandwidth with big url lists
	checkInterval = setInterval(function() {

		if (urlsIdx < urls.length) {
			console.log("Checking: " + urls[urlsIdx]);
			recordUrlStatus(urls, urlsIdx);
			urlsIdx++;
		} else {
			clearInterval(checkInterval); //kill interval
		}

	}, checkDelay);

}

var estimateCheckTimeInSeconds = function() {
	return checkDelay * (urls.length - 1) / 1000.0;
}


//now that everything is set up, call the main function
checkUrls();