// POPULATE REALTIME PRICES
$(document).ready(function(){

    // Parse last btc price from api
    function parseResponse(jsonData,elementID,bid_askElementID){
        parsedData = jsonData.result
        $(elementID).text(parsedData.Last.toFixed(2) + ' $' );
        $(bid_askElementID).text(
            'Bid: ' + parsedData.Bid.toFixed(2) + ' $' + '    |    ' +
            'Ask: ' + parsedData.Ask.toFixed(2) + ' $'  );

    }

    // GET api btc last price
    function apiCall2(coinPair,callbackFunction,elementID,id_askElementID) {
        $.ajax({
            url: 'https://bittrex.com/api/v1.1/public/getticker?market='+ coinPair,
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                callbackFunction(data,elementID,id_askElementID);
            }
            
        })
    }

    // script execution
    apiCall2("USDT-BTC",parseResponse,'#btc-last-price','#btc-bid-ask-price');
    apiCall2("USDT-ETH",parseResponse,'#eth-last-price','#eth-bid-ask-price');
    
})





// POPULATE DATATABLES
$(document).ready(function () {
    
        // populate datatable with JS object
        // inputs: table htrml ID, dataSet(array of objects), columns object defining raw order
        function populateDataTable(tableID, dataSet,columNames){
            var columns = []
            for (i = 0; i < columNames.length; i++) { 
                var item = {'title':columNames[i]}
                columns.push(item)
            }
            
            $(tableID).DataTable({
                data: dataSet,
                columns: columns
            })
        };
    
        // parse api response JSON and populate market object with data.
        // input: data Json to parse; output: array of object 
        function parseResponse(jsonResponse, marketBaseCurrency,decimalRound) {
            var parsedData = [];
            var array = jsonResponse.result;
            $.each(array, function () {
                if (this.MarketName.includes(marketBaseCurrency)) {
                    var item = [ 
                        this.MarketName.replace(marketBaseCurrency + '-',""),
                        this.PrevDay.toFixed(decimalRound),
                        this.Low.toFixed(decimalRound),
                        this.Last.toFixed(decimalRound),
                        this.High.toFixed(decimalRound),
                        this.TimeStamp
                    ]
                    parsedData.push(item);
                }
            })
            return parsedData;
        }
    

        // API callback function - execute upon request success
        // contains all functions that shuld be called after api call
        function callBackFunction(data,parseParam,tableID,decimalRound,columNames){
            var parsedData = parseResponse(data, parseParam,decimalRound);
            populateDataTable (tableID,parsedData,columNames);
        }
        
        // Create api call and parse output on success
        // Za input se zadaju api parametri i callback FUNKCIJA koja se poziva u sucess bloku. 
        // Samo na ovaj nacin se u success blok mozgu koristiti fukncije
        function apiCall_datatables(params) {
            $.ajax({
                url: params.url,
                type: params.type,
                dataType: params.dataType,
                success: function(data) {
                    params.callBackFunction(data, params.currency[0], params.dataTableID[0], params.decimalRound[0], params.columNames)
                    params.callBackFunction(data, params.currency[1], params.dataTableID[1], params.decimalRound[1], params.columNames)
                } 
                
            })
        }
    
    
        
    
        //SCRIPT EXECUTION
        var input_params = {
            url: 'https://bittrex.com/api/v1.1/public/getmarketsummaries',
            type: 'GET',
            dataType: 'json',
            callBackFunction: callBackFunction,
            columNames: ["MarketName","Yesterday","Low","Last","High","TimeStamp"],
            currency: ['USDT','BTC'],
            dataTableID: ['#coin-list-usd','#coin-list-btc'],
            decimalRound: [2,8]
        }
        
        apiCall_datatables(input_params);
        //
    
    
    })