# lighthouse reporting tool

### Description
A simple tool for scrapping the root page of the website and gathering the urls for auditing it for the website.

This tool uses lighhout cli and chrome launcher for outputing the report.

###How to start   

1. npm install

2. specify website in package json

```
"scripts": {
    "start": WEBSITE=http://website.com  ...
    ...
}
```

3. specify port
```
"scripts": {
    "start": ... PORT=4002  ...
    ...
}
```

4. ```npm run start``` / ```npm start```

5. View the report list on http://localhost:4002


###Configure   
Change the runtimeConfig file for your feature output
```server > config > runtimeConfig.js```