/**
* xkcd Widget
*
* @author Christopher Kaster(INF)
* @version 0.2.1

Copyright (C) 2013 Christopher "Kasoki" Kaster

This file is part of jwidget xkcd <https://github.com/Kasoki/jwidget-xkcd>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

margin_left = 0;
margin_top = 0;

panel_width = 0;
panel_height = 0;

interval = null;
aligned_to_bottom = false;

XKCD_OVERSIZE_LIST_IDENTIFIER = "XKCD_OVERSIZE_LIST_IDENT";

function setup() {
	panel_width = $("#xkcd").width();
	panel_height = $("#xkcd").height();

	// remove proplematic images setup
	add_number_to_oversize_list(1110);	

	load_image();
}

function load_image() {
	// get newest xkcd
	$.getJSON("http://anyorigin.com/get?url=http://xkcd.com/info.0.json&callback=?", function(data) {
		var current_xkcd_number = data.contents.num;
		
		var random_number = -1;
		
		while(!is_valid_number(random_number)) {
			random_number = generate_random_number(current_xkcd_number);
			
			console.log("try next random number: " + random_number);
		}
			
		// only use the following line for testing purpose
		//random_number = 1110;
		
		var url = "http://anyorigin.com/get?url=http://xkcd.com/" + random_number +
			"/info.0.json&callback=?";
		
		$.getJSON(url, function(data) {
			$("#xkcd-title").text(data.contents.title + " #" + data.contents.num);
			$("#xkcd-footer").text(data.contents.alt);
			
			retrieve_image_size(data.contents.img, function(size) {
				on_image_url_found(data.contents.img, size, data.contents.num);
			});
		});
	});
}

function on_image_url_found(url, size, xkcd_id) {
	var image_width = size.width;
	var image_height = size.height;
	var footer_height = $("#xkcd-footer").height();
	
	// check if image is smaller than the panel
	if(image_width <= panel_width && image_height <= (panel_height - footer_height)) {	
		console.log("load xkcd #" + xkcd_id);	
	
		// set image
		$("#xkcd-image").attr("src", url);
	} else {
		add_number_to_oversize_list(xkcd_id);
		
		load_image();
	}
}

function retrieve_image_size(url, callback) {
	$("<img/>").attr("src", url).load(function() {
		var size = {width:this.width, height:this.height};
		
		callback(size);
	}); 
}

function generate_random_number(max) {
	var random_number = Math.round(Math.random() * max);
		
	random_number = random_number > 0 ?
		random_number : random_number + 1;
	random_number = random_number < max ?
		random_number : random_number - 1;
		
	return random_number;
}

function is_valid_number(number) {
	if(!(number > 0)) {
		return false;
	}
	
	var list = localStorage.getItem(XKCD_OVERSIZE_LIST_IDENTIFIER);

	var is_valid = false;
	
	if(!list) {
		console.log("no list found");

		is_valid = true;
	} else {
		list = JSON.parse(list);
	}
	
	var found_something = false;

	list.forEach(function(element) {
		if(element == number) {
			console.log("#" + number + " is on list of oversized images");
			
			is_valid = false;
			found_something = true;
		}
	});
	
	return is_valid || !found_something;
}

function add_number_to_oversize_list(number) {
	var list = localStorage.getItem(XKCD_OVERSIZE_LIST_IDENTIFIER);
	
	if(!list) {
		list = [];
	} else {
		list = JSON.parse(list);
	}

	var item_already_in_list = false;

	list.forEach(function(element) {
		if(element == number) {
			// element is already in list
			item_already_in_list = true;
		}
	});
	
	if(!item_already_in_list) {
		list.push(number);
		console.log("added #" + number + " to the list of oversized images");
	
		localStorage.setItem(XKCD_OVERSIZE_LIST_IDENTIFIER, JSON.stringify(list));
	}
}
