

$(function () {
  
  $.ajax({
    type: "get",
    url: "/category/queryTopCategory",
    success: function ( info ) {
      var htmlStr = template("leftTpl", info);
      $('.lt_category_left ul').html( htmlStr );
    }
  })



})