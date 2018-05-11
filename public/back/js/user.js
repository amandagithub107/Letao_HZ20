

$(function () {
  //当前页
  var currentPage = 1;
  //每页多少条
  var pageSize = 5;
  
  
  
  // 向后退请求用户列表数据，通过模板引擎，进行渲染
  //后台的响应头中，设置了content-type为application/json，jquery会自动按照json格式进行解析响应结果，我们就可以不用配置dataType了
  $.ajax({
    type: "get",
    url: "/user/queryUser",
    data:{
      page: currentPage,
      pageSize: pageSize
    },
    dataType: "json",
    success: function (info) {
      // console.log(info);
      var htmlStr = template("tpl", info);
      $('.lt_content tbody').html( htmlStr );
    }
  })
  
})