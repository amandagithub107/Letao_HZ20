



$(function () {
  
  // 1. 一进入页面, 需要进行一次个人信息的 ajax 请求
  $.ajax({
    type: "get",
    url: "/user/queryUserMessage",
    success: function (info) {
      console.log(info);
      if ( info.error === 400 ) {
        location.href = "login.html";
        return;
      }
      var htmlStr = template("userTpl", info);
      $('#userInfo').html( htmlStr );
    }
  });
  
  // 2. 点击退出按钮, 进行退出
  $('#logoutBtn').click(function () {
    $.ajax({
      type: "get",
      url: "/user/logout",
      success: function ( info ) {
        console.log(info);
        if ( info.success ) {
          location.href = "login.html";
        }
      }
    })
  })
  
})