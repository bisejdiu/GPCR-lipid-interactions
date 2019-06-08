$(document).ready(function(){
	"use strict";

  $(".menu-bar").on('click', function(e){
      e.preventDefault();
      $("nav").toggleClass('hide');
      $("span", this).toggleClass("lnr-menu lnr-cross");
      $(".main-menu").addClass('mobile-menu');
  });
 });
