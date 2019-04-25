
const items = []
const itemWithData = []

const auditView = {
    init: () => {
        const looper = []
        reportData.containers.forEach(item => items.push(...item.files))
        items.map((v, i) => {
            $.getJSON(v.url, function (data) {
                const categories = data.categories
                itemWithData.push({
                    name: v.name,
                    time: v.time,
                    url: data.finalUrl,
                    data: {
                        "accessibility": `${(categories["accessibility"] && categories["accessibility"].score) || null}`,
                        "best-practices": `${(categories["best-practices"] && categories["best-practices"].score) || null}`,
                        "performance": `${(categories["performance"] && categories["performance"].score) || null}`,
                        "pwa": `${(categories["pwa"] && categories["pwa"].score) || null}`,
                        "seo": `${(categories["seo"] && categories["seo"].score) || null}`
                    }
                });
                looper.push(i)
                if (looper.length == items.length) {
                    auditView.mapFiles(itemWithData)
                }
            });
        });
    },
    mapFiles: (items) => {
        let files = [...new Set(items.map(item => item.name))];
        const pageData = (files.map((v, i) => items.filter(item => item.name === v)))
        auditView.generatePageData(pageData);
    },
    generateChartData: (data) => {
        const chartArray = []
        $.each(data, function (key, value) {
            const tempArray = [],
                scoreData = value.data
            tempArray.push(value.time)
            tempArray.push(parseFloat(scoreData['performance']) * 100)
            tempArray.push(parseFloat(scoreData['accessibility']) * 100)
            tempArray.push(parseFloat(scoreData['seo']) * 100)
            tempArray.push(parseFloat(scoreData['best-practices']) * 100)
            tempArray.push(parseFloat(scoreData['pwa']) * 100)
            chartArray.push(tempArray)
        });
        return JSON.stringify(chartArray);
    },
    generateChart: (data, element) => {
        $('.chart_data').each(function (i, v) {
            const chartData = JSON.parse($(v).attr('data-chart'));
            const element = $(v).attr('id')
            google.charts.load('current', { packages: ['corechart', 'line'] });
            google.charts.setOnLoadCallback(drawBasic);
            function drawBasic() {
                var data = new google.visualization.DataTable();
                data.addColumn('string', 'Date');
                data.addColumn('number', 'Performance');
                data.addColumn('number', 'Accessibility');
                data.addColumn('number', 'SEO');
                data.addColumn('number', 'Best Practices');
                data.addColumn('number', 'PWA');
                data.addRows(chartData);
                var options = {
                    height: 400,
                    pointSize: 6,
                    hAxis: {
                        title: 'Date & Time',
                        textStyle: {
                            color: '#000',
                            fontSize: 10,
                            bold: false,
                            italic: true
                        },
                        titleTextStyle: {
                            color: '#333',
                            fontSize: 12,
                            bold: true,
                            italic: false
                        }
                    },
                    vAxis: {
                        title: 'Score Percentage',
                        textStyle: {
                            color: '#000',
                            fontSize: 10,
                            fontName: 'Arial',
                            bold: true,
                            italic: true
                        },
                        titleTextStyle: {
                            color: '#333',
                            fontSize: 12,
                            bold: true,
                            italic: false
                        }
                    }
                };

                const chart = new google.visualization.LineChart(document.getElementById(element));
                google.visualization.events.addListener(chart, 'onmouseover', uselessHandler);
                google.visualization.events.addListener(chart, 'onmouseout', uselessHandler1);
                function uselessHandler() {
                    $(`#${element}`).css('cursor', 'pointer')
                }
                function uselessHandler1() {
                    $(`#${element}`).css('cursor', 'default')
                }
                chart.draw(data, options);
                google.visualization.events.addListener(chart, 'select', function () {
                    try {
                        const selection = chart.getSelection();
                        const rowValue = data.getValue(chart.getSelection()[0].row, 0)
                        const reportURL = items.filter((item) => item.time === rowValue)[0].reporturl;
                        window.open(reportURL, '_blank');
                    } catch (err) {
                        console.log(err);
                    }
                });
            }
        });
    },
    generatePageData: (data) => {
        let html = "<div class='holder'>";
        $.each(data, function (key, value) {
            const filename = value[0].name.replace('.json', '');
            const url = value[0].url;
            html += `
                <div class='page_container'>
                <h2><a href="${url}" target="_blank">${filename}</a></h2>
                <hr>
                <div id='${filename}_chart' class='chart_data' data-chart='${auditView.generateChartData(value)}'>
                    
                </div>
                </div>
            `
        });
        html += `</div>`;
        $("#pages").html(html);
        auditView.generateChart();
    }
}


auditView.init();