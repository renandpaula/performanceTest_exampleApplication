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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.66673266542589, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8157227387996618, 500, 1500, "Step 2: Select flight-5"], "isController": false}, {"data": [0.8009298393913779, 500, 1500, "Step 2: Select flight-4"], "isController": false}, {"data": [0.8158861340679523, 500, 1500, "Step 3: Confirm informations and purchase-5"], "isController": false}, {"data": [0.7992392223161454, 500, 1500, "Step 2: Select flight-3"], "isController": false}, {"data": [0.6004219409282701, 500, 1500, "Step 1: Search for flight-0"], "isController": false}, {"data": [0.8068469991546915, 500, 1500, "Step 2: Select flight-2"], "isController": false}, {"data": [0.8236914600550964, 500, 1500, "Step 3: Confirm informations and purchase-3"], "isController": false}, {"data": [1.0, 500, 1500, "Step 2: Select flight-1"], "isController": false}, {"data": [0.7874196510560147, 500, 1500, "Step 3: Confirm informations and purchase-4"], "isController": false}, {"data": [0.7514792899408284, 500, 1500, "Step 2: Select flight-0"], "isController": false}, {"data": [1.0, 500, 1500, "Step 3: Confirm informations and purchase-1"], "isController": false}, {"data": [0.8135904499540864, 500, 1500, "Step 3: Confirm informations and purchase-2"], "isController": false}, {"data": [0.2514792899408284, 500, 1500, "Step 2: Select flight"], "isController": false}, {"data": [0.7460973370064279, 500, 1500, "Step 3: Confirm informations and purchase-0"], "isController": false}, {"data": [0.7485232067510549, 500, 1500, "Step 1: Search for flight-5"], "isController": false}, {"data": [0.6316455696202532, 500, 1500, "Step 1: Search for flight-2"], "isController": false}, {"data": [0.9978902953586498, 500, 1500, "Step 1: Search for flight-1"], "isController": false}, {"data": [0.4759493670886076, 500, 1500, "Step 1: Search for flight-4"], "isController": false}, {"data": [0.0, 500, 1500, "Purchase ticket flow"], "isController": true}, {"data": [0.5936708860759494, 500, 1500, "Step 1: Search for flight-3"], "isController": false}, {"data": [0.25849403122130393, 500, 1500, "Step 3: Confirm informations and purchase"], "isController": false}, {"data": [0.12320675105485232, 500, 1500, "Step 1: Search for flight"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 24199, 0, 0.0, 800.8991693871644, 26, 8635, 459.0, 2075.9000000000015, 3146.9500000000007, 4555.980000000003, 57.2977094175755, 1668.7955601837273, 85.67331308839128], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Step 2: Select flight-5", 1183, 0, 0.0, 542.7007607776856, 162, 4925, 269.0, 1179.200000000001, 2098.9999999999995, 3633.000000000002, 2.9114696646026323, 0.4975656165092389, 2.607243830508412], "isController": false}, {"data": ["Step 2: Select flight-4", 1183, 0, 0.0, 589.5832628909553, 162, 4280, 307.0, 1374.8000000000018, 2502.3999999999996, 3579.600000000001, 2.9028893932887554, 0.5017785526961537, 2.5995601305134657], "isController": false}, {"data": ["Step 3: Confirm informations and purchase-5", 1089, 0, 0.0, 539.3526170798892, 161, 4621, 281.0, 1123.0, 1938.5, 3717.399999999986, 2.7150810410553166, 0.4640031076022269, 2.431376283835669], "isController": false}, {"data": ["Step 2: Select flight-3", 1183, 0, 0.0, 579.5131022823324, 162, 4676, 293.0, 1301.4000000000005, 2377.7999999999993, 3738.2800000000025, 2.9095434500839907, 0.5000873877563067, 2.605518890358417], "isController": false}, {"data": ["Step 1: Search for flight-0", 1185, 0, 0.0, 877.8556962025316, 426, 5478, 585.0, 1548.0, 2634.400000000002, 4225.680000000001, 2.9157962338247128, 20.971522716913096, 2.4858301876259516], "isController": false}, {"data": ["Step 2: Select flight-2", 1183, 0, 0.0, 590.641589180051, 162, 4694, 280.0, 1320.200000000001, 2592.3999999999974, 3635.4400000000005, 2.9038798584143786, 0.4991043506649713, 2.594775459423004], "isController": false}, {"data": ["Step 3: Confirm informations and purchase-3", 1089, 0, 0.0, 527.1836547291094, 162, 4476, 277.0, 1073.0, 1957.0, 3560.4999999999914, 2.715175813243775, 0.4666708429012738, 2.4314611530708414], "isController": false}, {"data": ["Step 2: Select flight-1", 1183, 0, 0.0, 33.38715131022826, 26, 102, 32.0, 36.0, 47.799999999999955, 68.0, 2.913800280296257, 0.7423913759639802, 2.541038721000544], "isController": false}, {"data": ["Step 3: Confirm informations and purchase-4", 1089, 0, 0.0, 624.1101928374674, 162, 4740, 289.0, 1415.0, 2740.5, 3818.7999999999975, 2.720615973438394, 0.4702724808382695, 2.436332859026374], "isController": false}, {"data": ["Step 2: Select flight-0", 1183, 0, 0.0, 699.7928994082844, 250, 4600, 405.0, 1448.6000000000001, 2372.199999999999, 3954.3200000000083, 2.908112971462144, 19.081670626246027, 2.61275774779802], "isController": false}, {"data": ["Step 3: Confirm informations and purchase-1", 1089, 0, 0.0, 34.123048668503316, 27, 151, 32.0, 36.0, 52.0, 71.09999999999991, 2.7215066500727234, 0.6935090762184303, 2.373345154799748], "isController": false}, {"data": ["Step 3: Confirm informations and purchase-2", 1089, 0, 0.0, 539.2341597796134, 162, 4582, 268.0, 1274.0, 1919.0, 3538.399999999988, 2.7167676203211224, 0.46695417980561016, 2.427580441986159], "isController": false}, {"data": ["Step 2: Select flight", 1183, 0, 0.0, 1967.5054945054942, 439, 8615, 1538.0, 3886.2000000000003, 4424.799999999999, 5960.480000000007, 2.897017516793151, 21.73870152837265, 15.500741186044603], "isController": false}, {"data": ["Step 3: Confirm informations and purchase-0", 1089, 0, 0.0, 722.3719008264462, 251, 5010, 409.0, 1515.0, 2545.5, 4145.0999999999985, 2.719562872098134, 15.350657617897669, 2.7169070489808504], "isController": false}, {"data": ["Step 1: Search for flight-5", 1185, 0, 0.0, 688.2278481012661, 169, 4475, 447.0, 1262.6000000000008, 2184.9000000000024, 3653.280000000005, 2.9192225260512896, 11.594216810010346, 2.3690174991685757], "isController": false}, {"data": ["Step 1: Search for flight-2", 1185, 0, 0.0, 824.6236286919828, 239, 5375, 579.0, 1550.8000000000006, 2392.5000000000027, 3861.540000000001, 2.921950630130366, 82.69633907403139, 2.3626710173319756], "isController": false}, {"data": ["Step 1: Search for flight-1", 1185, 0, 0.0, 166.2025316455697, 130, 1027, 153.0, 180.4000000000001, 252.80000000000018, 422.1400000000001, 2.924488954809859, 239.84776664136015, 2.4075626844772566], "isController": false}, {"data": ["Step 1: Search for flight-4", 1185, 0, 0.0, 1024.0717299578062, 442, 5774, 777.0, 1748.0000000000005, 2518.7000000000016, 4099.940000000002, 2.9220010652358317, 361.7317471062018, 2.365565315508305], "isController": false}, {"data": ["Purchase ticket flow", 1054, 0, 0.0, 6259.665085388996, 2257, 17192, 6099.0, 9106.5, 10379.0, 12745.95, 2.6281143404280787, 782.9904108267589, 41.30810577069328], "isController": true}, {"data": ["Step 1: Search for flight-3", 1185, 0, 0.0, 843.2016877637128, 288, 5622, 600.0, 1548.0000000000018, 2133.1000000000004, 4082.120000000026, 2.921633649329997, 112.66549760228799, 2.3681210243592745], "isController": false}, {"data": ["Step 3: Confirm informations and purchase", 1089, 0, 0.0, 1938.3994490358139, 439, 7781, 1500.0, 3945.0, 4605.5, 5521.299999999997, 2.7129098636320608, 17.86956789390131, 14.788537948041174], "isController": false}, {"data": ["Step 1: Search for flight", 1185, 0, 0.0, 2410.5704641350226, 949, 8635, 2024.0, 4300.6, 4906.7, 6134.84, 2.909481964894706, 825.8209144220996, 14.303058800078079], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 24199, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
