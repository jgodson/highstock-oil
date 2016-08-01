'use strict';

// Set up jQuery variables for ease of use
var $success = $('#success');
var $error = $('#error');
var $loading = $('#loading');
var $main = $('.container');

// Load data from the API
function loadData() {
	var req = new XMLHttpRequest();
	req.open("GET", "https://www.quandl.com/api/v1/datasets/CHRIS/CME_CL1.json", true);
	req.onreadystatechange = function() {
		if (req.readyState === 4) {
			if (req.status === 200) {
				var chartData = JSON.parse(req.responseText);
				$success.fadeIn();
				setTimeout(function() {
					$success.fadeOut();
				}, 3000);
				
				renderChart(chartData);
				
				// Populate main area with data from the latest data point in the array
				$('#main h1').append(chartData.data[0][6].toFixed(2) + ' USD'); // Closing Price
				$('#main h5').append(chartData.data[0][0]); // Date of latest data point
				
				// Hide the loading div and show the content
				$main.css('visibility', 'visible');
				$loading.fadeOut();
			}
			else {
				$loading.fadeOut();
				$error.fadeIn();
				setTimeout(function() {
					$error.fadeOut();
				}, 3000);
			}
		}
	};
	req.send();
}

// Render chart using given data
function renderChart(data) {
	// Get what we need out of the data for our chart
	var parsedData = parseData(data);
	// Create the chart
	$('#chartContainer').highcharts('StockChart', {
		rangeSelector : {
			selected : 1
		},
		title : {
			text : data.name
		},
		series : [{
			name : 'Closing Price',
			data : parsedData,
			tooltip: {
				valueDecimals: 2,
				valuePrefix: '$',
				valueSuffix: ' USD'
			}
		}]
	});
};

// Function to take the first element (date) and 7th element (closing price) out of the array
// and place it in a new array
function parseData(data) {
	var startTime = Date.now(); // For logging time taken
	var returnData = [];
	data.data.forEach(function(point) {
		returnData.push([ Date.parse(point[0]), point[6] ]);
	});
	var endTime = Date.now(); // For logging time taken
	// Log the time taken in the loop
	console.log("Completed " + returnData.length + " points in " + (endTime - startTime) + " milliseconds");
	// Sort ascending order as they are given in decending order
	return returnData.reverse();
}

// Load the data from the API as soon as the page loads
$(document).ready(loadData());