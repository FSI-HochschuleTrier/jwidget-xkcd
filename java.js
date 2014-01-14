/**
* xkcd Widget
*
* @author Christopher Kaster(INF)
* @version 0.1.4
*/

margin_left = 0;
margin_top = 0;

panel_width = 0;
panel_height = 0;

interval = null;
aligned_to_bottom = false;

function setup() {
	panel_width = $("#xkcd").width();
	panel_height = $("#xkcd").height();

	// get newest xkcd
	$.getJSON("http://anyorigin.com/get?url=http://xkcd.com/info.0.json&callback=?", function(data) {
		var current_xkcd_number = data.contents.num;
		
		var random_number = Math.round(Math.random()*current_xkcd_number);
		
		random_number = random_number > 0 ?
			random_number : random_number + 1;
		random_number = random_number < current_xkcd_number ?
			random_number : random_number - 1;
			
		// only use the following line for testing purpose
		//random_number = 1212;
		
		var url = "http://anyorigin.com/get?url=http://xkcd.com/" + random_number +
			"/info.0.json&callback=?";
		
		$.getJSON(url, function(data) {
			$("#xkcd-title").text(data.contents.title + " #" + data.contents.num);
			$("#xkcd-footer").text(data.contents.alt);
			on_image_url_found(data.contents.img);
		});
	});

	
}

function on_image_url_found(url) {
	// set image
	$("#xkcd-image").attr("src", url);
	
	setTimeout(start, 1000);
}

function start() {
	interval = setInterval(scroll_comic, 100);
}

function wait_and_call(func) {
	setTimeout(func, 1000);
}

function reset() {
	margin_top = 0;
	margin_left = 0;
	
	$("#xkcd-image").css({
		"margin-top": margin_top,
		"margin-left": margin_left
	});
	
	setTimeout(start, 1000);
}

function scroll_comic() {
	var image_width = $("#xkcd-image").width();
	var image_height = $("#xkcd-image").height();
	var footer_height = $("#xkcd-footer").height();
	
	var usable_panel_height = panel_height - footer_height;
	
	if(image_width > panel_width) {
		if(image_width + margin_left <= panel_width) {
			if(!aligned_to_bottom) {
				margin_left = 0;
				
				if(image_height > usable_panel_height) {
					margin_top -= panel_height;
				}
			}
			
			if(!aligned_to_bottom && Math.abs(margin_top) > Math.abs(image_height - usable_panel_height)) { 
				margin_top = Math.abs(image_height - usable_panel_height) * -1;
				console.log(margin_top);
				aligned_to_bottom = true;
			} else {
				aligned_to_bottom = false;
			}
			
			if(!aligned_to_bottom && image_height + margin_top <= usable_panel_height) {
				clearInterval(interval);
			
				wait_and_call(function() {
					reset();
				});
			}
		} else {
			margin_left -= 2;
		}
	} else if(image_height > panel_height){
		console.log(footer_height);
	
		if(image_height + margin_top <= usable_panel_height) {
			clearInterval(interval);
			
			wait_and_call(function() {
				reset();
			});
		} else {
			margin_top -= 2;
		}
	}

	$("#xkcd-image").css({
		"margin-top": margin_top,
		"margin-left": margin_left
	});
}