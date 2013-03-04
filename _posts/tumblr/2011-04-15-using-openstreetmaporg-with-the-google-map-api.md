--- 
layout: default
title: Using OpenStreetMap.org with the Google map API
tags: 
- javascript
- programming
- google map api
---
Using a custom map type, its really simple to use the Google map API with
tiles from open street map.

    
    
    function OSMMapType() {}
    OSMMapType.prototype = {
    	tileSize: new google.maps.Size(256,256),
    	maxZoom: 18,
    	getTile: function(coord, zoom, ownerDocument) {
    		var tileUrl = http://tile.openstreetmap.org/ + zoom + / + coord.x + / + coord.y + .png;
    
    		var tile = ownerDocument.createElement(img);
    		tile.width = this.tileSize.width;
    		tile.height = this.tileSize.height;
    		tile.src = tileUrl;
    
    		return tile;
    	}
    };
    

With this map type we instantiate a google map, and tell it to use our custom
type

    
    
    var latLng = new google.maps.LatLng(54.572061655658494, -3.7408447265625);
    var map = new google.maps.Map(document.getElementById("map"), {
    	zoom: 5,
    	center: latLng,
     	mapTypeId: osm
    });
    
    map.mapTypes.set(osm, new OSMMapType());
    map.setMapTypeId(osm);
    

So you you end up with something like this:
[![](http://static.bytespider.eu/images/osm-map-
thumb.png)](http://static.bytespider.eu/images/osm-map.png)

