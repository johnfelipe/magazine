// BIGNEWS V.1 //
// Copyright 2013, Mandar Shirke //
// www.quadcodes.com
// DATE : 24/04/2013 //

// --------- INIT JS ---------  //

// -- 1. CLOCK --  //
// -- 2. SUPERFISH-MENU --  //
// -- 3. CAROUSEL/SLIDER --  //
// -- 4. TIPSY --  //
// -- 5. EQUAL HEIGHT --  //
// -- 6. FITVIDS --  //
// -- 7. SCROLL --  //
// -- 8. QUOTES --  //
// -- 9. PRETTYPHOTO --  //
// -- 10. SHORTCODES --  //
// -- 11. CONTACT FORM --  //
// -- 12. JSOCIAL --  //

// --------------------------  //


// --------- REQUIRED FUNCTIONS ----------  //

// --- ADJUST HEIGHT ---  //
function adjustHeights() {
	if ( $(window).width() > 767 ) {
		$('.qcContainer .eh').equalHeights();
		$('#qcSubFooter .widget').equalHeights();
	}
}

// --- MOBILE MENU DROPDOWN ---  //
function adjustMenu() {
	if ($(window).width() < 767) {
		if ($("#dd-menu").val() !== '') {
			$("<option />", {
				"selected": "selected",
				"value"   : "",
				"text"    : "Go to..."
			}).appendTo("#dd-menu");
			$("ul#PriNavList a").each(function() {
				var el = $(this);
				$("<option />", {
					"value"   : el.attr("href"),
					"text"    : el.text()
				}).appendTo("#dd-menu");
			});
			$("#dd-menu").change(function() {
				window.location = $(this).find("option:selected").val();
			}); 
		}
	}
}

// ------------------------------------------  // 


$(document).ready(function() {


// ------------------------------------------  // 


// --------- 1. CLOCK ----------  // 

setInterval('updateClock()', 1000);



// --------- 2. SUPERFISH-MENU ----------  //

$('ul.sf-menu').superfish();

// DropDown Memu For Mobiles
adjustMenu();
$(window).resize(function() {
	adjustMenu();
});



// --------- 3. CAROUSEL/SLIDER ----------  //

$(window).load(function() {
  // The slider being synced must be initialized first
	$('.carousel').flexslider({
		animation: "slide",
		controlNav: false,
		animationLoop: false,
		slideshow: false,
		itemWidth: 144,
	});
   
	$('#slider').flexslider({
		animation: "slide",
		controlNav: false,
		animationLoop: false,
		slideshow: false, 
	});
});



// --------- 4. TIPSY ----------  //

$('.tips').tipsy({gravity: 's'});



// --------- 5. EQUAL HEIGHT ----------  //

$(window).load(function() {
	adjustHeights();
});

$(window).resize(function() {
	$('.qcContainer .eh, #qcSubFooter .widget').css('height' , 'auto');
	adjustHeights();
});



// --------- 6. FITVIDS ----------  //

$(".qcFitVids").fitVids();



// --------- 7. SCROLL ----------  //

$('#qcScrollTop').click(function(){
	$('html, body').animate({scrollTop:0}, 500);
	return false;
});

// fixed menu position on scroll 
var top = $('#FixWrapper').position().top;
$(document).scroll(function() {
	if( $(this).scrollTop() > top ) {
		$('#FixWrapper').addClass('fixed');
	} else {
		$('#FixWrapper').removeClass('fixed');
	}
});

// --------- 8. QUOTES ----------  //

$('#qcNewsTicker').innerfade({
	animationtype: 'fade', 
	speed: 'slow', 
	timeout: 3000, 
	type: 'random_start'
});



// --------- 9. PRETTYPHOTO ----------  //

$("a[rel^='prettyPhoto']").prettyPhoto();



// --------- 10. SHORTCODES ----------  //

/*-- Tabs --*/
$('.tabs a').click(function(){
	switch_tabs($(this));
}); 
switch_tabs($('.defaulttab')); 
function switch_tabs(obj) {
	$('.tab-content').hide();
	$('.tabs a').removeClass("selected");
	var id = obj.attr("rel"); 
	$('#'+id).fadeIn(500);
	obj.addClass("selected");
}
/*-- Toggle --*/
if ( $( '.shortcode-toggle').length ) {	
		
	$( '.shortcode-toggle').each( function () {
			
		var toggleObj = $(this);
			
		toggleObj.closedText = toggleObj.find( 'input[name="title_closed"]').attr( 'value' );
		toggleObj.openText = toggleObj.find( 'input[name="title_open"]').attr( 'value' );
			
		toggleObj.find( 'input[name="title_closed"]').remove();
		toggleObj.find( 'input[name="title_open"]').remove();
			
		toggleObj.find( 'h4.toggle-trigger a').click( function () {
			
			toggleObj.find( '.toggle-content').animate({ opacity: 'toggle', height: 'toggle' }, 300);
			toggleObj.toggleClass( 'open' ).toggleClass( 'closed' );
				
			if ( toggleObj.hasClass( 'open') ) {
				
				$(this).text(toggleObj.openText);
				
			} // End IF Statement
				
			if ( toggleObj.hasClass( 'closed') ) {
				
				$(this).text(toggleObj.closedText);
				
			} // End IF Statement
				
			return false;
			
		});
					
	});
	
} // End IF Statement



// --------- 11. CONTACT FORM ----------  //

$('.qcForm').submit(function() {
		$(this).find('.error').remove();
		var hasError = false;
		$(this).find('.requiredField').each(function() {
			if($.trim($(this).val()) == '') {
				var labelText = $(this).prev( 'label').text();
				$(this).parent().append( '<span class="error">You forgot to enter your '+labelText+'</span>' );
				$(this).addClass( 'inputError' );
				hasError = true;
			} else if($(this).hasClass( 'email')) {
				var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
				if(!emailReg.test($.trim($(this).val()))) {
					var labelText = $(this).prev( 'label').text();
					$(this).parent().append( '<span class="error">You have entered an invalid '+labelText+'</span>' );
					$(this).addClass( 'inputError' );
					hasError = true;
				}
			} else if($(this).hasClass( 'captcha')) {
				if($(this).val() != 'red' && $(this).val() != 'Red') {
					$(this).parent().append( '<span class="error">You have entered wrong Captcha Value</span>' );
					hasError = true;
				}
			}
		});
		if(!hasError) {
			var formInput = $(this).serialize();
			var hideForm = $(this);
			$.post($(this).attr('action'),formInput, function(data){
				$(hideForm).slideUp( "fast", function() {				   
					$(this).before( '<br/><p class="info">Thanks! Your email was successfully sent.</p>' );
				});
			});
		}
		return false;
});



// --------- 12. JSOCIAL ----------  //

// Flickr
$('#flickr').jflickrfeed({
	limit: 10,
	qstrings: {
	id: '52617155@N08' // Define Flickr ID //
	},
	itemTemplate: '<li><a href="{{image_b}}" rel="prettyPhoto[pp_gal]"><img class="flickr" src="{{image_s}}" alt="{{title}}"></a></li>'
	}, function(data) {
	$('#flickr a').prettyPhoto();
}); 
// Twitter
$(".tweet").tweet({
	join_text: "auto",
	username: "quadcodes", // Define Twitter Username //
	avatar_size: 0,
	count: 3,
	auto_join_text_default: "|", 
	auto_join_text_ed: "we",
	auto_join_text_ing: "we were",
	auto_join_text_reply: "we replied",
	auto_join_text_url: "we were checking out",
	loading_text: "Loading Tweets…"
}); 

// ------------------------------------------  // 
  
});