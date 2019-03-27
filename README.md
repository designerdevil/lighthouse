# lighthouse reporting tool

## Description
A simple tool for 

Flow1 => auditing the webpage(and all the links present on the root page).   
Flow2 => auditing the pages provided.

This tool uses lighthouse cli and chrome launcher for outputing the report.

## How to start?   
1. npm install

2. specify website(flow1)  --or--  urls(flow2) in urlConfig   
```config > urlConfig.js```

3. specify port
```
"scripts": {
    "start": ... PORT=4002  ...
}
```

4. run 
```
npm start
```

5. To view the report list (flow 1)  --OR--  To generate the physical reports
 http://localhost:4002


## Configure   
Change the runtimeConfig file for your feature output
```config > runtimeConfig.js```


## How does it work?   

### flow 1
![Flow 1](https://github.com/designerdevil/lighthouse/blob/master/docs/dataflow.jpg)