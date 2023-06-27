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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6168769881497536, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.7426923076923077, 500, 1500, "Step 2: Select flight-5"], "isController": false}, {"data": [0.74, 500, 1500, "Step 2: Select flight-4"], "isController": false}, {"data": [0.7688461538461538, 500, 1500, "Step 3: Confirm informations and purchase-5"], "isController": false}, {"data": [0.7253846153846154, 500, 1500, "Step 2: Select flight-3"], "isController": false}, {"data": [0.5299769408147579, 500, 1500, "Step 1: Search for flight-0"], "isController": false}, {"data": [0.7430769230769231, 500, 1500, "Step 2: Select flight-2"], "isController": false}, {"data": [0.77, 500, 1500, "Step 3: Confirm informations and purchase-3"], "isController": false}, {"data": [1.0, 500, 1500, "Step 2: Select flight-1"], "isController": false}, {"data": [0.7726923076923077, 500, 1500, "Step 3: Confirm informations and purchase-4"], "isController": false}, {"data": [0.6892307692307692, 500, 1500, "Step 2: Select flight-0"], "isController": false}, {"data": [1.0, 500, 1500, "Step 3: Confirm informations and purchase-1"], "isController": false}, {"data": [0.7653846153846153, 500, 1500, "Step 3: Confirm informations and purchase-2"], "isController": false}, {"data": [0.1580769230769231, 500, 1500, "Step 2: Select flight"], "isController": false}, {"data": [0.7203846153846154, 500, 1500, "Step 3: Confirm informations and purchase-0"], "isController": false}, {"data": [0.6644888547271329, 500, 1500, "Step 1: Search for flight-5"], "isController": false}, {"data": [0.584934665641814, 500, 1500, "Step 1: Search for flight-2"], "isController": false}, {"data": [0.9896233666410453, 500, 1500, "Step 1: Search for flight-1"], "isController": false}, {"data": [0.42736356648731744, 500, 1500, "Step 1: Search for flight-4"], "isController": false}, {"data": [0.0, 500, 1500, "Purchase ticket flow"], "isController": true}, {"data": [0.4907763259031514, 500, 1500, "Step 1: Search for flight-3"], "isController": false}, {"data": [0.21346153846153845, 500, 1500, "Step 3: Confirm informations and purchase"], "isController": false}, {"data": [0.07532667179093006, 500, 1500, "Step 1: Search for flight"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 27307, 0, 0.0, 884.4696597941862, 26, 8319, 483.0, 2381.9000000000015, 3029.0, 4328.970000000005, 80.80715418669065, 2293.9243263820254, 120.96080516781682], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Step 2: Select flight-5", 1300, 0, 0.0, 656.376153846155, 165, 4271, 354.5, 1699.8000000000002, 2237.9, 2954.4800000000005, 4.43551276233499, 0.7580355284572263, 3.9720363311144395], "isController": false}, {"data": ["Step 2: Select flight-4", 1300, 0, 0.0, 654.8546153846161, 165, 3963, 371.5, 1811.2000000000016, 2296.9, 2893.6900000000005, 4.438662801615673, 0.7672431379980266, 3.9748572158999735], "isController": false}, {"data": ["Step 3: Confirm informations and purchase-5", 1300, 0, 0.0, 624.6369230769228, 163, 4637, 328.5, 1653.7000000000003, 2283.8500000000004, 3373.080000000001, 4.4325032050407795, 0.7575078719552112, 3.969341249045307], "isController": false}, {"data": ["Step 2: Select flight-3", 1300, 0, 0.0, 681.8261538461546, 163, 4095, 388.5, 1808.7000000000003, 2262.6000000000004, 2940.6100000000006, 4.440178836741455, 0.7631557375649376, 3.976214837199135], "isController": false}, {"data": ["Step 1: Search for flight-0", 1301, 0, 0.0, 956.3697156033812, 442, 3879, 682.0, 1962.1999999999998, 2468.9999999999973, 3174.7000000000003, 3.8655696887042765, 27.802656989557615, 3.2955491584363608], "isController": false}, {"data": ["Step 2: Select flight-2", 1300, 0, 0.0, 654.4076923076929, 163, 4161, 366.0, 1719.7000000000012, 2262.3500000000004, 2937.94, 4.426707346972131, 0.7608536266651229, 3.9555051000776373], "isController": false}, {"data": ["Step 3: Confirm informations and purchase-3", 1300, 0, 0.0, 641.0799999999995, 163, 4440, 334.5, 1743.0000000000036, 2423.6500000000005, 3775.3100000000013, 4.451414522568672, 0.7650868710664905, 3.9862764816362035], "isController": false}, {"data": ["Step 2: Select flight-1", 1300, 0, 0.0, 35.77615384615384, 26, 306, 32.0, 38.0, 49.950000000000045, 263.99, 4.443183643615658, 1.131489825109456, 3.8747685485827947], "isController": false}, {"data": ["Step 3: Confirm informations and purchase-4", 1300, 0, 0.0, 613.5253846153847, 165, 4492, 325.0, 1526.8000000000002, 2237.95, 3260.84, 4.432306742902343, 0.7661311459899558, 3.969165315665477], "isController": false}, {"data": ["Step 2: Select flight-0", 1300, 0, 0.0, 777.919230769231, 259, 4096, 468.0, 1858.7000000000003, 2343.9, 3054.96, 4.435285768873847, 29.102231524475954, 3.984827057972597], "isController": false}, {"data": ["Step 3: Confirm informations and purchase-1", 1300, 0, 0.0, 34.73615384615386, 26, 319, 31.0, 36.0, 50.0, 114.99000000000001, 4.45354947893471, 1.1352135091571829, 3.8838082858288057], "isController": false}, {"data": ["Step 3: Confirm informations and purchase-2", 1300, 0, 0.0, 636.8499999999999, 164, 4459, 334.5, 1656.6000000000022, 2484.5000000000014, 3724.370000000001, 4.450164998425326, 0.7648854809943721, 3.97646579449138], "isController": false}, {"data": ["Step 2: Select flight", 1300, 0, 0.0, 2166.2269230769202, 442, 6465, 2075.0, 3488.5000000000014, 3990.3000000000006, 5273.000000000001, 4.41844735759854, 33.15465882788788, 23.64128229715078], "isController": false}, {"data": ["Step 3: Confirm informations and purchase-0", 1300, 0, 0.0, 733.8915384615384, 257, 4547, 446.0, 1662.9, 2384.700000000001, 3601.790000000001, 4.449190247374978, 25.113593388503293, 4.444845335024026], "isController": false}, {"data": ["Step 1: Search for flight-5", 1301, 0, 0.0, 806.2513451191397, 170, 5366, 548.0, 1774.7999999999997, 2235.8999999999987, 3105.9, 3.8660636280971596, 15.35477799014466, 3.137401245067129], "isController": false}, {"data": ["Step 1: Search for flight-2", 1301, 0, 0.0, 868.0107609531124, 243, 3662, 625.0, 1853.7999999999993, 2335.399999999999, 3205.76, 3.866488746764305, 109.42842809567999, 3.1264186350789496], "isController": false}, {"data": ["Step 1: Search for flight-1", 1301, 0, 0.0, 181.44811683320523, 132, 4631, 158.0, 180.0, 232.49999999999932, 679.8200000000002, 3.86939814649583, 317.3426756964396, 3.1854517944296727], "isController": false}, {"data": ["Step 1: Search for flight-4", 1301, 0, 0.0, 1157.618754803998, 444, 5692, 910.0, 2110.8, 2593.9999999999986, 3576.7400000000002, 3.855294584807591, 477.2696800185134, 3.121132041802239], "isController": false}, {"data": ["Purchase ticket flow", 1300, 0, 0.0, 6880.936923076926, 2392, 16316, 6688.0, 9371.600000000002, 10307.95, 12263.67, 4.374747610714766, 1303.3611285797213, 68.76129179145914], "isController": true}, {"data": ["Step 1: Search for flight-3", 1301, 0, 0.0, 976.680245964643, 290, 7356, 716.0, 2013.6, 2537.7999999999997, 3338.76, 3.8620239261436162, 148.9293092476326, 3.130351424510939], "isController": false}, {"data": ["Step 3: Confirm informations and purchase", 1300, 0, 0.0, 2095.815384615386, 442, 8258, 1789.0, 3675.4000000000005, 4648.6, 5893.540000000001, 4.427461157542691, 29.163399285475883, 24.13485173965166], "isController": false}, {"data": ["Step 1: Search for flight", 1301, 0, 0.0, 2618.5049961567975, 1053, 8319, 2526.0, 3910.6, 4371.299999999999, 5624.720000000002, 3.849932530006392, 1092.7559047572634, 18.926328472707205], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 27307, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
