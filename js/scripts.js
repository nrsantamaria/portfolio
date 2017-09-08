$(document).ready(function(){
  //smooth scroll
  $('a[href*="#"]').click(function() {
  	var hash = $(this).attr('href').split('?')[0].toString();
      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 1000, function(){
        window.location.hash = window.location.hash.split('?')[0]
      });
	});
  //slick js
  $('.slider-for').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    asNavFor: '.slider-nav'
  });
  $('.slider-nav').slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    asNavFor: '.slider-for',
    dots: true,
    centerMode: true,
    focusOnSelect: true
  });
});
