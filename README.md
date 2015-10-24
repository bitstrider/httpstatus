#httpstatus
httpstatus v0.0.1

Records the response status for a text file list of urls.  Outputs in CSV format.

Installing Dependencies:
> npm install

Usage: 
> node httpstatus.js [urlsFilePath] [resultsFilePath] [delayInMilliseconds]

Example: 
> node httpstatus.js data/urls.txt data/results.csv 1000 //checks a url from the list every 1 second.

Notes: 
If [resultsFilePath] points to an existing file, [resultsFilePath] will be timestamped to prevent accidental overwrites.