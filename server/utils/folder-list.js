module.exports = `<!doctype html>
<html lang='en'>
    <head>
        <title> Generated Performance Reports </title>
        <style>
            body {
                font-family: 'Arial';
                background: #febbbb;
                background: -moz-linear-gradient(-45deg, #505d8e 0%, #68b3b7 45%, #d2e663 100%);
                background: -webkit-linear-gradient(-45deg, #505d8e 0%,#68b3b7 45%,#d2e663 100%);
                background: linear-gradient(135deg, #505d8e 0%,#68b3b7 45%,#d2e663 100%);
                filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#505d8e', endColorstr='#68b3b7',GradientType=1 );
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
            }
            
            th, td {
                font-weight: unset;
                padding-right: 10px;
            }
            
            
            tr th {
                padding-top: 14px;
                padding-bottom: 10px;
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
        </style>
    </head>
    <body>
        <table>
        <thead>
        <tr>
        <th>
            Report Date
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
    </body>
</html>`