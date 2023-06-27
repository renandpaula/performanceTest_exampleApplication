/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.68387001911483, "KoPercent": 0.3161299808851639};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.594143654163304, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.7247104247104247, 500, 1500, "Step 2: Select flight-5"], "isController": false}, {"data": [0.7061776061776062, 500, 1500, "Step 2: Select flight-4"], "isController": false}, {"data": [0.7299382716049383, 500, 1500, "Step 3: Confirm informations and purchase-5"], "isController": false}, {"data": [0.7088803088803088, 500, 1500, "Step 2: Select flight-3"], "isController": false}, {"data": [0.49071925754060325, 500, 1500, "Step 1: Search for flight-0"], "isController": false}, {"data": [0.7104247104247104, 500, 1500, "Step 2: Select flight-2"], "isController": false}, {"data": [0.7303240740740741, 500, 1500, "Step 3: Confirm informations and purchase-3"], "isController": false}, {"data": [1.0, 500, 1500, "Step 2: Select flight-1"], "isController": false}, {"data": [0.7380401234567902, 500, 1500, "Step 3: Confirm informations and purchase-4"], "isController": false}, {"data": [0.661003861003861, 500, 1500, "Step 2: Select flight-0"], "isController": false}, {"data": [1.0, 500, 1500, "Step 3: Confirm informations and purchase-1"], "isController": false}, {"data": [0.7337962962962963, 500, 1500, "Step 3: Confirm informations and purchase-2"], "isController": false}, {"data": [0.1523076923076923, 500, 1500, "Step 2: Select flight"], "isController": false}, {"data": [0.685570987654321, 500, 1500, "Step 3: Confirm informations and purchase-0"], "isController": false}, {"data": [0.6279969064191802, 500, 1500, "Step 1: Search for flight-5"], "isController": false}, {"data": [0.545630317092034, 500, 1500, "Step 1: Search for flight-2"], "isController": false}, {"data": [0.9992266047950503, 500, 1500, "Step 1: Search for flight-1"], "isController": false}, {"data": [0.4203402938901779, 500, 1500, "Step 1: Search for flight-4"], "isController": false}, {"data": [0.0, 500, 1500, "Purchase ticket flow"], "isController": true}, {"data": [0.4895591647331787, 500, 1500, "Step 1: Search for flight-3"], "isController": false}, {"data": [0.1723076923076923, 500, 1500, "Step 3: Confirm informations and purchase"], "isController": false}, {"data": [0.048846153846153845, 500, 1500, "Step 1: Search for flight"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 27204, 86, 0.3161299808851639, 1206.0810542567333, 26, 18586, 551.0, 2908.800000000003, 5924.850000000002, 9085.950000000008, 80.5149833518313, 2291.904209443211, 120.47920424065853], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Step 2: Select flight-5", 1295, 3, 0.23166023166023167, 817.8664092664105, 166, 9946, 417.0, 1565.0000000000018, 2875.2, 7471.639999999997, 4.16382647614883, 0.8463675637917508, 3.7257687454583746], "isController": false}, {"data": ["Step 2: Select flight-4", 1295, 1, 0.07722007722007722, 887.1320463320471, 166, 9844, 442.0, 1776.0000000000014, 3681.4000000000005, 7536.3999999999905, 4.143893916315742, 4.276653017682747, 3.7084144395903467], "isController": false}, {"data": ["Step 3: Confirm informations and purchase-5", 1296, 2, 0.15432098765432098, 913.8873456790128, 164, 7561, 381.5, 2086.499999999999, 4778.199999999996, 7159.9, 4.141911607259851, 0.7080771770603294, 3.709114202985628], "isController": false}, {"data": ["Step 2: Select flight-3", 1295, 3, 0.23166023166023167, 901.9382239382234, 166, 9916, 436.0, 1740.0000000000014, 3801.400000000003, 7831.28, 4.165058535957803, 2.0744383603499292, 3.7268366360317766], "isController": false}, {"data": ["Step 1: Search for flight-0", 1293, 0, 0.0, 1234.3147718484154, 446, 10481, 746.0, 1986.800000000001, 4124.199999999996, 8692.419999999995, 4.145772146054302, 29.81799285251087, 3.5344326987357477], "isController": false}, {"data": ["Step 2: Select flight-2", 1295, 2, 0.15444015444015444, 880.3845559845576, 166, 9943, 453.0, 1709.8000000000025, 3550.4000000000037, 7659.239999999999, 4.165219293167111, 1.711377818156818, 3.718845285422054], "isController": false}, {"data": ["Step 3: Confirm informations and purchase-3", 1296, 3, 0.23148148148148148, 918.7368827160495, 165, 8371, 365.0, 2280.7999999999984, 4671.449999999997, 7218.079999999999, 4.144202912453713, 0.712622131674373, 3.711166084687554], "isController": false}, {"data": ["Step 2: Select flight-1", 1295, 0, 0.0, 33.37683397683396, 26, 291, 32.0, 36.0, 40.0, 80.19999999999982, 4.167001850213177, 2.902723031131848, 3.6328187846914974], "isController": false}, {"data": ["Step 3: Confirm informations and purchase-4", 1296, 5, 0.38580246913580246, 853.6998456790112, 166, 9664, 362.0, 1968.599999999999, 4036.19999999998, 6962.929999999997, 4.086175421780955, 0.7068406342321238, 3.6592020134503276], "isController": false}, {"data": ["Step 2: Select flight-0", 1295, 0, 0.0, 1001.5135135135141, 261, 8555, 559.0, 1788.2000000000003, 3883.800000000001, 7929.239999999997, 4.159506640756741, 27.292725405311, 3.737056747554885], "isController": false}, {"data": ["Step 3: Confirm informations and purchase-1", 1296, 0, 0.0, 31.513888888888857, 26, 68, 31.0, 34.0, 35.149999999999864, 45.02999999999997, 4.147744184036945, 1.0562542055517683, 3.617124566743157], "isController": false}, {"data": ["Step 3: Confirm informations and purchase-2", 1296, 2, 0.15432098765432098, 914.788580246913, 164, 8099, 382.0, 2378.3999999999983, 4425.549999999995, 7298.389999999999, 4.140257616029442, 0.7118438801817113, 3.6995466002606827], "isController": false}, {"data": ["Step 2: Select flight", 1300, 14, 1.0769230769230769, 3022.2923076923094, 168, 16668, 2060.5, 7104.9000000000015, 8563.550000000001, 10252.19, 4.152001584148296, 38.89177887717102, 22.132061671396222], "isController": false}, {"data": ["Step 3: Confirm informations and purchase-0", 1296, 0, 0.0, 1034.175925925926, 255, 8487, 475.5, 2214.2999999999993, 5013.299999999994, 7509.0999999999985, 4.142573573832744, 23.382885992923104, 4.138528091827047], "isController": false}, {"data": ["Step 1: Search for flight-5", 1293, 4, 0.30935808197989173, 1056.8615622583136, 173, 10287, 614.0, 1862.6000000000035, 3874.0999999999985, 8061.719999999997, 4.148765156789953, 16.429261303018684, 3.3668201614184095], "isController": false}, {"data": ["Step 1: Search for flight-2", 1293, 4, 0.30935808197989173, 1143.5204949729284, 167, 10555, 686.0, 1998.6000000000001, 4008.3999999999996, 8230.299999999994, 4.1468358327667385, 117.00232821039019, 3.35310553665123], "isController": false}, {"data": ["Step 1: Search for flight-1", 1293, 0, 0.0, 161.44083526682124, 129, 745, 159.0, 174.0, 183.0, 251.29999999999973, 4.15202913163827, 340.52222345595413, 3.4181255448936145], "isController": false}, {"data": ["Step 1: Search for flight-4", 1293, 2, 0.15467904098994587, 1391.5274555297747, 370, 10706, 933.0, 2423.2000000000007, 4239.299999999999, 8242.079999999998, 4.1433941223406805, 512.1431340837026, 3.3543688744340088], "isController": false}, {"data": ["Purchase ticket flow", 1295, 50, 3.861003861003861, 9903.847104247112, 2680, 31780, 8998.0, 16220.400000000003, 18055.8, 22864.999999999985, 4.037588546343411, 1202.548344739716, 63.23610298364543], "isController": true}, {"data": ["Step 1: Search for flight-3", 1293, 4, 0.30935808197989173, 1161.9010054137682, 166, 10854, 746.0, 1963.8000000000031, 3789.7, 8347.179999999997, 4.14977710593967, 159.53339730104017, 3.3635888651659425], "isController": false}, {"data": ["Step 3: Confirm informations and purchase", 1300, 16, 1.2307692307692308, 3231.3576923076876, 168, 15589, 2191.0, 7466.6, 8237.8, 10885.710000000001, 4.0933794310832345, 26.88279587064606, 22.257639958153067], "isController": false}, {"data": ["Step 1: Search for flight", 1300, 21, 1.6153846153846154, 3711.2730769230793, 345, 18586, 2613.0, 8500.8, 9706.9, 11746.67, 4.157751487995292, 1172.0878317755758, 20.348598602875565], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["429/Too Many Requests", 51, 59.30232558139535, 0.1874724305249228], "isController": false}, {"data": ["Assertion failed", 35, 40.69767441860465, 0.12865755036024115], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 27204, 86, "429/Too Many Requests", 51, "Assertion failed", 35, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Step 2: Select flight-5", 1295, 3, "429/Too Many Requests", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Step 2: Select flight-4", 1295, 1, "429/Too Many Requests", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Step 3: Confirm informations and purchase-5", 1296, 2, "429/Too Many Requests", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Step 2: Select flight-3", 1295, 3, "429/Too Many Requests", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Step 2: Select flight-2", 1295, 2, "429/Too Many Requests", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Step 3: Confirm informations and purchase-3", 1296, 3, "429/Too Many Requests", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Step 3: Confirm informations and purchase-4", 1296, 5, "429/Too Many Requests", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Step 3: Confirm informations and purchase-2", 1296, 2, "429/Too Many Requests", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Step 2: Select flight", 1300, 14, "Assertion failed", 9, "429/Too Many Requests", 5, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Step 1: Search for flight-5", 1293, 4, "429/Too Many Requests", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Step 1: Search for flight-2", 1293, 4, "429/Too Many Requests", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Step 1: Search for flight-4", 1293, 2, "429/Too Many Requests", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Step 1: Search for flight-3", 1293, 4, "429/Too Many Requests", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Step 3: Confirm informations and purchase", 1300, 16, "Assertion failed", 12, "429/Too Many Requests", 4, "", "", "", "", "", ""], "isController": false}, {"data": ["Step 1: Search for flight", 1300, 21, "Assertion failed", 14, "429/Too Many Requests", 7, "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
