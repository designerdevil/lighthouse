# lighthouse reporting tool

### Description
A simple tool for auditing the webpage(and all the links present on the root page).

This tool uses lighthouse cli and chrome launcher for outputing the report.

### How to start   

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

5. View the report list on the port mentioned above
 http://localhost:4002


### Configure   
Change the runtimeConfig file for your feature output
```server > config > runtimeConfig.js```


### How it works

![Data Flow](https://github.com/designerdevil/lighthouse/blob/master/docs/dataflow.jpg)