$(document).ready(function(){
  $('a[href*="#"]').click(function() {
  	var hash = $(this).attr('href').split('?')[0].toString();
      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 1000, function(){
        window.location.hash = window.location.hash.split('?')[0]
      });
	});
});
