![Node version](https://img.shields.io/badge/node-%3E=20-green.svg)
![Webpack](https://img.shields.io/badge/tool-webpack-yellow.svg)
![Express](https://img.shields.io/badge/server-express-yellow.svg)
![lighthouse](https://img.shields.io/badge/package-lighthouse-lightgrey.svg)
![lighthouse](https://img.shields.io/badge/build-docker-orange.svg)

# lighthouse reporting tool   

A simple tool for generating lighthouse audit reports for custom urls with checklist. This tool uses lighthouse cli and chrome launcher for outputing the report. Below are some features that are implemented in the system.

## Generate Checklist   
Gather URLs(from root page) based on the website provided in config and create a checklist for audit run.

- use ```config > urlConfig.js``` for defining website
- run the application
- choose to "Generate Report" or "Download Report" for individual urls from the list   

![Flow 1](https://github.com/designerdevil/lighthouse/blob/master/docs/1.png)

## Generate Historical Data   
Directly run audit on the urls provided in config and generate physical reports on server. This is useful for collecting historical data. Flexibility to delete and download the generated reports is available.

- dont provide website in ```config > urlConfig.js```
- use ```config > urlConfig.js``` for defining urls
- run the application
- Trigger new audit run
- after report generation of all the urls as a batch is completed one can either download the archive or delete the generated reports from server(which are available in the list)   

![Flow 2](https://github.com/designerdevil/lighthouse/blob/master/docs/2.png)

## Webhook Support + Azure Blob Storage(ABS)
Gather the url checklist from a post request with the ABS connection string in header. This will enable the system for report generation and pushing the physical reports to ABS.

- make a ```POST``` request to ```/hookme``` endpoint of this application. Consider below pointers before triggering request
- provide ```x-event = 'deployment``` in headers for triggering webhook
- provide ```x-connection-string = <AZURE BLOB STORAGE CONNECTION STRING>``` in headers for azure connection
- provide ```x-type = azure``` for defining the type of storage
- provide ```x-brand = <Brand Name>``` in headers for report prefix (limit it to 10 chars, without any special characters, in lowercase)
- provide array of url object in body   ```[{ "name": "Page Name"  ,  "url": "http://websiteurl.com" }, ...]```   


## Webhook Support + Google Cloud Storage(GCS)
Gather the url checklist from a post request with the GCS project id in header. This will enable the system for report generation and pushing the physical reports to GCS.

- Use the GCS provided key for enabling GCS support. As mentioned [here](https://github.com/designerdevil/lighthouse/blob/master/key/)
- make a ```POST``` request to ```/hookme``` endpoint of this application. Consider below pointers before triggering request
- provide ```x-event = 'deployment``` in headers for triggering webhook
- provide ```x-connection-string = <GCS PROJECT ID>``` in headers for azure connection
- provide ```x-type = gcp``` for defining the type of storage
- provide ```x-brand = <Brand Name>``` in headers for report prefix (limit it to 10 chars, without any special characters, in lowercase)
- provide array of url object in body   ```[{ "name": "Page Name"  ,  "url": "http://websiteurl.com" }, ...]```

**For reference a postman data collection is present [here](https://github.com/designerdevil/lighthouse/blob/master/docs/Lighthouse.postman_collection.json)**

## Chart for existing AZURE & GCS reports
- Make GET call with specific headers, as mentioned in the [POSTMAN Collection](https://github.com/designerdevil/lighthouse/blob/master/docs/Lighthouse.postman_collection.json)
- Use ```/viewform``` route for viewing the Filter form. On submit you can view the Chart generated according to your filters.

![Filter Form](https://github.com/designerdevil/lighthouse/blob/master/docs/viewform.png)  
![Filtered Chart](https://github.com/designerdevil/lighthouse/blob/master/docs/chart.png)


## How to start?   
1. npm install
2. npm run dev (development)
3. npm run build && npm start (production)


## Configuration   
By default the audit runs on below parameters
- Performance
- PWA
- Best Practices
- SEO
- Accessibility

Change the runtimeConfig file for your feature output
```config > runtimeConfig.js```



## Dockerized Solution
- Create a build from the docker file included   
```docker build -t <image name> .```
- Alter and run below command for running the image through a container.   
```docker run -d -p <port to be exposed>:4002 --name <container name> --cap-add=SYS_ADMIN <image name>```