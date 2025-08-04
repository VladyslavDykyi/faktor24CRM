'use strict';

// import {GoogleMapsManager} from "./function_on_pages-create.min.js";
//
// // Usage example:
// const mapsManager = new GoogleMapsManager();
//
// // Modal open handler
// $('#geoModal').on('show.bs.modal', async function () {
// 	try {
// 		await mapsManager.loadAPI();
// 		mapsManager.initializeMap('map-container');
// 	} catch (error) {
// 		console.error('Error:', error);
// 		alert('Error: ' + error.message);
// 	}
// });
//
// // Modal close handler
// $('#geoModal').on('hidden.bs.modal', function () {
// 	mapsManager.clearFields();
// });
// Initialize map when modal opens
document.addEventListener("DOMContentLoaded", function() {
	let map = null; // Declare map variable in a higher scope
	let marker = null; // Declare marker variable in a higher scope
	
	document.getElementById("mapModal").addEventListener("shown.bs.modal", function() {
		// Initialize map only if it hasn't been initialized yet
		if (map === null) {
			map = L.map("map-container").setView([50.4501, 30.5234], 12);
			
			L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
				attribution: "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors"
			} ).addTo(map);
			
			marker = L.marker(map.getCenter(), {
				draggable: true
			}).addTo(map);
		}
		
		// Invalidate size directly after the modal is shown, no setTimeout needed
		map.invalidateSize();
		
		// If the map was already initialized, ensure its view is correct
		// This might be useful if the user moved the map and closed the modal
		// and you want to reset it or keep the last view.
		// For now, we'll just ensure the marker is centered if it's a fresh open.
		if (marker) {
			marker.setLatLng(map.getCenter());
		}
	});
	
	document.getElementById("mapModal").addEventListener("hidden.bs.modal", function() {
		// No need to remove the map if we are reusing it.
		// If you truly want to destroy and recreate, you'd call map.remove() here
		// and set map = null, but then you'd need to ensure the map-container is clean
		// before re-initialization.
		// For this revised code, we assume map persistence.
	});
});