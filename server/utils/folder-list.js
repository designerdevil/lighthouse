module.exports = `<!doctype html>
<html lang='en'>
    <head>
        <title> Generated Performance Reports </title>
        <style>
            body {
                padding:0;
                margin:0;
            }
            body > div {
                font-family: 'Arial';
                background: #febbbb;
                background: -moz-linear-gradient(-45deg, #505d8e 0%, #68b3b7 45%, #d2e663 100%);
                background: -webkit-linear-gradient(-45deg, #505d8e 0%,#68b3b7 45%,#d2e663 100%);
                background: linear-gradient(135deg, #505d8e 0%,#68b3b7 45%,#d2e663 100%);
                filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#505d8e', endColorstr='#68b3b7',GradientType=1 );
                position: fixed;
                width: 100%;
                height: 100%;
                overflow: auto;
            }
            h1 {
                font-size: 20px;
                text-align: center;
                color: white;
            }
            h1 span{
                background: #6c488e52;
                padding: 5px 20px;
                border-radius: 4px;
                font-weight: normal;
            }
            a {
                background-color: Crimson;  
                border-radius: 5px;
                color: white;
                padding: 3px;
                text-decoration: none;
                font-size: 10px;
            }

            a:focus,
            a:hover {
                background-color: FireBrick;
                color: White;
            }
            table {
                background-color: #fff;
                margin: 20px auto;
            }
            th, td {
                font-weight: unset;
                padding-right: 10px;
            }
            tr th {
                padding-top: 14px;
                padding-bottom: 10px;
                padding-left: 10px;
            }
            
            tr td {
                padding-top: 3px;
                padding-bottom: 3px;
            }
            table tbody tr {
                border-bottom: 1px solid #e5e5e5;
            }
            
            table td {
                font-size: 12px;
                color: #808080;
                line-height: 1.4;
                padding-left: 25px;
            }
            td:first-child {
                width: 500px;
                word-break: break-word;
            }
            table th {
                font-size: 11px;
                color: #fff;
                line-height: 1.4;
                text-transform: uppercase;
                font-weight: bold;
                background-color: #6c7ae0;
            }
            
            table tr:hover td {
                background-color: #fcebf5;
            }
            
            table .hov-column-ver3 {
                background-color: #fcebf5;
            }
            
            table .hov-column-head-ver3 {
                background-color: #7b88e3 !important;
            }
            
            table tr td:first-child:hover {
                background-color: #e03e9c;
                color: #fff;
            }
            a.primary {
                font-size: 16px;
                margin: 0 auto;
                display: block;
                background: rgba(42, 50, 111, 0.45);
                border-radius: 5px;
                padding: 10px 20px;
                max-width: 140px;
                text-align: center;
            }
        </style>
    </head>
    <body>
        <div>
        <h1>Generated Reports for  <span>my-title</span></h1>
        <table>
        <thead>
        <tr>
        <th>
            Report Date
        </th>
        <th>
            Files
        </th>
        <th>
            Action
        </th>
        </tr>
        </thead>
        <tbody>
        report-list
        </tbody>
        </table>
        <a href="/generateWebReport" class="primary">Trigger New</a>
    </div></body>
</html>`