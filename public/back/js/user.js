

$(function () {
  //当前页
  var currentPage = 1;
  //每页多少条
  var pageSize = 5;
  
  
  //1. 一进入页面，渲染页面
  render();
  // 向后退请求用户列表数据，通过模板引擎，进行渲染
  //后台的响应头中，设置了content-type为application/json，jquery会自动按照json格式进行解析响应结果，我们就可以不用配置dataType了
 function render() {
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
       //进行渲染
       $('.lt_content tbody').html( htmlStr );
      
       //配置分页插件
       $('#paginator').bootstrapPaginator({
         //配置bootstrap版本
         bootstrapMajorVersion: 3,
         totalPages: Math.ceil(info.total / info.size),
         currentPage: info.page,
         //页码点击事件
         onPageClicked: function (a, b, c, page) {
           // 打印参数列表
           // console.log(arguments);
          
           //更新当前页
           currentPage = page;
          
           //重新渲染
           render();
         }
       })
     }
   })
 }
  
  
  
  
  
  
  
})