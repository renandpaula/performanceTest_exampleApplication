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

    var data = {"OkPercent": 99.99129185352898, "KoPercent": 0.008708146471023642};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6231363541449154, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.7677130044843049, 500, 1500, "Step 2: Select flight-5"], "isController": false}, {"data": [0.7730941704035874, 500, 1500, "Step 2: Select flight-4"], "isController": false}, {"data": [0.7472194135490394, 500, 1500, "Step 3: Confirm informations and purchase-5"], "isController": false}, {"data": [0.752914798206278, 500, 1500, "Step 2: Select flight-3"], "isController": false}, {"data": [0.5429056924384027, 500, 1500, "Step 1: Search for flight-0"], "isController": false}, {"data": [0.7408071748878924, 500, 1500, "Step 2: Select flight-2"], "isController": false}, {"data": [0.7659251769464105, 500, 1500, "Step 3: Confirm informations and purchase-3"], "isController": false}, {"data": [1.0, 500, 1500, "Step 2: Select flight-1"], "isController": false}, {"data": [0.7517694641051568, 500, 1500, "Step 3: Confirm informations and purchase-4"], "isController": false}, {"data": [0.7085201793721974, 500, 1500, "Step 2: Select flight-0"], "isController": false}, {"data": [1.0, 500, 1500, "Step 3: Confirm informations and purchase-1"], "isController": false}, {"data": [0.7482305358948432, 500, 1500, "Step 3: Confirm informations and purchase-2"], "isController": false}, {"data": [0.19641255605381167, 500, 1500, "Step 2: Select flight"], "isController": false}, {"data": [0.717896865520728, 500, 1500, "Step 3: Confirm informations and purchase-0"], "isController": false}, {"data": [0.6826677994902294, 500, 1500, "Step 1: Search for flight-5"], "isController": false}, {"data": [0.596856414613424, 500, 1500, "Step 1: Search for flight-2"], "isController": false}, {"data": [0.9995751911639762, 500, 1500, "Step 1: Search for flight-1"], "isController": false}, {"data": [0.4464740866610025, 500, 1500, "Step 1: Search for flight-4"], "isController": false}, {"data": [0.0, 500, 1500, "Purchase ticket flow"], "isController": true}, {"data": [0.5076465590484283, 500, 1500, "Step 1: Search for flight-3"], "isController": false}, {"data": [0.19312436804853386, 500, 1500, "Step 3: Confirm informations and purchase"], "isController": false}, {"data": [0.08411214953271028, 500, 1500, "Step 1: Search for flight"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 22967, 2, 0.008708146471023642, 1056.2739147472412, 26, 13830, 506.0, 2852.0, 4512.950000000001, 7155.0, 54.31528263244775, 1650.5121462290645, 81.08513593749261], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Step 2: Select flight-5", 1115, 0, 0.0, 690.8995515695061, 165, 8469, 313.0, 1548.1999999999998, 2782.6000000000004, 5431.479999999998, 2.7111275372749644, 0.46332745998351443, 2.4278358903136157], "isController": false}, {"data": ["Step 2: Select flight-4", 1115, 0, 0.0, 740.9273542600904, 165, 8471, 308.0, 1757.3999999999992, 3351.6000000000026, 5451.959999999998, 2.6902086057722467, 0.4650067609586794, 2.4091028237237793], "isController": false}, {"data": ["Step 3: Confirm informations and purchase-5", 989, 0, 0.0, 802.3629929221439, 165, 9642, 330.0, 1896.0, 3357.5, 7539.300000000009, 2.4774797342658745, 0.4233974155239531, 2.2186024573455145], "isController": false}, {"data": ["Step 2: Select flight-3", 1115, 1, 0.08968609865470852, 745.6959641255602, 165, 7306, 352.0, 1773.5999999999997, 3200.8000000000025, 5629.84, 2.690189133566081, 0.4624610797188692, 2.4090853862110313], "isController": false}, {"data": ["Step 1: Search for flight-0", 1177, 0, 0.0, 1080.6457094307557, 442, 9950, 660.0, 2123.2000000000007, 3859.299999999998, 5512.9800000000005, 2.818716083206008, 20.273285110168214, 2.403065567030122], "isController": false}, {"data": ["Step 2: Select flight-2", 1115, 0, 0.0, 803.1426008968606, 164, 8834, 346.0, 2098.1999999999994, 3477.8000000000006, 5565.919999999995, 2.7123740205653903, 0.4661892847846764, 2.4236545203294257], "isController": false}, {"data": ["Step 3: Confirm informations and purchase-3", 989, 0, 0.0, 746.1314459049545, 165, 8926, 309.0, 1796.0, 3143.0, 5607.200000000007, 2.4918994371179632, 0.428305058001542, 2.2315154139034887], "isController": false}, {"data": ["Step 2: Select flight-1", 1115, 0, 0.0, 30.13632286995518, 26, 98, 29.0, 32.0, 36.0, 66.0, 2.7157763466840734, 0.6902994645779951, 2.3683479273328882], "isController": false}, {"data": ["Step 3: Confirm informations and purchase-4", 989, 0, 0.0, 804.3478260869565, 164, 8620, 329.0, 1979.0, 3344.0, 6696.4000000000015, 2.4659221526577855, 0.42623849709026174, 2.2082525527218646], "isController": false}, {"data": ["Step 2: Select flight-0", 1115, 0, 0.0, 908.8547085201794, 257, 10976, 452.0, 1854.4, 3599.4000000000087, 5904.919999999995, 2.713615046326155, 17.805448726821712, 2.4380135181836544], "isController": false}, {"data": ["Step 3: Confirm informations and purchase-1", 989, 0, 0.0, 30.360970677451988, 26, 95, 28.0, 33.0, 38.0, 68.0, 2.4936209696126186, 0.6336876468689803, 2.1746128182266293], "isController": false}, {"data": ["Step 3: Confirm informations and purchase-2", 989, 0, 0.0, 824.2861476238622, 165, 8984, 324.0, 2106.0, 3773.5, 6222.500000000003, 2.4926970780751034, 0.4284323102941584, 2.2273611586315623], "isController": false}, {"data": ["Step 2: Select flight", 1115, 1, 0.08968609865470852, 2647.6475336322887, 453, 13830, 1839.0, 5543.799999999999, 6711.6, 9628.919999999976, 2.6878674724644247, 20.167704605624756, 14.381665900031821], "isController": false}, {"data": ["Step 3: Confirm informations and purchase-0", 989, 0, 0.0, 808.0899898887772, 252, 7966, 442.0, 1787.0, 2905.5, 4950.200000000005, 2.489052197110787, 14.049532909472996, 2.486621482074546], "isController": false}, {"data": ["Step 1: Search for flight-5", 1177, 0, 0.0, 965.0934579439254, 172, 8967, 497.0, 2168.2000000000003, 3981.0999999999945, 6171.5400000000045, 2.818709332873527, 11.195010602340462, 2.2874486871268562], "isController": false}, {"data": ["Step 1: Search for flight-2", 1177, 0, 0.0, 1007.9141886151234, 243, 7669, 601.0, 2131.6000000000004, 3567.3999999999987, 5966.3, 2.8116661451029947, 79.57509428831044, 2.2734956720168746], "isController": false}, {"data": ["Step 1: Search for flight-1", 1177, 0, 0.0, 150.4392523364484, 130, 1173, 142.0, 161.0, 171.0999999999999, 339.10000000000014, 2.821121257879725, 231.36860783538268, 2.3224660355396565], "isController": false}, {"data": ["Step 1: Search for flight-4", 1177, 0, 0.0, 1225.6924384027195, 433, 7841, 812.0, 2383.6000000000004, 3851.099999999998, 5643.54, 2.8136758511548745, 348.32154858177705, 2.277868438093155], "isController": false}, {"data": ["Purchase ticket flow", 978, 1, 0.10224948875255624, 8627.215746421263, 2764, 26167, 8109.0, 13488.300000000001, 15376.2, 19922.210000000003, 2.4569962843583797, 732.0041862204714, 38.618510934324334], "isController": true}, {"data": ["Step 1: Search for flight-3", 1177, 0, 0.0, 1061.2565845369575, 291, 9540, 647.0, 2268.2, 3444.299999999998, 6072.500000000005, 2.8178118266698586, 108.66186856595642, 2.2839685704452957], "isController": false}, {"data": ["Step 3: Confirm informations and purchase", 989, 0, 0.0, 2723.678463094033, 425, 11972, 1960.0, 5604.0, 7040.5, 9289.5, 2.46125820315708, 16.21023708586033, 13.416741494162912], "isController": false}, {"data": ["Step 1: Search for flight", 1177, 0, 0.0, 3236.0382327952407, 1008, 13254, 2452.0, 6231.200000000001, 7111.2, 9311.680000000004, 2.808231434536236, 797.0806087831793, 13.805309610796302], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["429/Too Many Requests", 1, 50.0, 0.004354073235511821], "isController": false}, {"data": ["Assertion failed", 1, 50.0, 0.004354073235511821], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 22967, 2, "429/Too Many Requests", 1, "Assertion failed", 1, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Step 2: Select flight-3", 1115, 1, "429/Too Many Requests", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Step 2: Select flight", 1115, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
