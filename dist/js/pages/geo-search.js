'use strict';

import {GoogleMapsManager} from "./function_on_pages-create.min.js";

// Usage example:
const mapsManager = new GoogleMapsManager();

// Modal open handler
$('#geoModal').on('show.bs.modal', async function () {
	try {
		await mapsManager.loadAPI();
		mapsManager.initializeMap('map-container');
	} catch (error) {
		console.error('Error:', error);
		alert('Error: ' + error.message);
	}
});

// Modal close handler
$('#geoModal').on('hidden.bs.modal', function () {
	mapsManager.clearFields();
});
