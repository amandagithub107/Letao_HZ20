


$(function () {
  // 1. 获取地址栏参数传递过来的 productId
  var productId = getSearch("productId");
  
  // 2. 根据 productId 发送 ajax 请求, 获取商品详情的数据
  $.ajax({
    type: "get",
    url: "/product/queryProductDetail",
    data: {
      id: productId
    },
    success: function ( info ) {
      // 3. 根据数据进行模板渲染
      var htmlStr = template("productTpl", info);
      $('.lt_main .mui-scroll').html( htmlStr );
  
      //获得slider插件对象, 需要手动初始化轮播图
      var gallery = mui('.mui-slider');
      gallery.slider({
        interval: 2000
      });
  
      // 手动初始化 输入框
      mui(".mui-numbox").numbox();
    }
  });
  
  
  // 3. 选择尺码功能
  // 通过事件委托添加事件绑定
  $('.lt_main').on("click", ".lt_size span", function () {
    $(this).addClass("current").siblings().removeClass("current");
  })
  
  
  
  // 4. 加入购物车功能
  // (1) 获取用户选择的尺码
  // (2) 获取用户选择的数量
  // (3) 产品 id, 本身已经在地址栏解析时已经得到了
  // (4) 发送 ajax 请求, 进行添加购物车操作
  $('#addCart').click(function () {
    var size = $('.lt_size span.current').text();
    var num = $('.mui-numbox-input').val();
    
    if ( !size ) {
      mui.toast( "请选择尺码" );
      return;
    }
  
    // 发送ajax 请求
    $.ajax({
      type: "post",
      url: "/cart/addCart",
      data: {
        productId: productId,
        num: num,
        size: size
      },
      success: function ( info ) {
        
        if ( info.success ) {
          mui.confirm("添加成功", "温馨提示", ["去购物车", "继续浏览"], function (e) {
            if (e.index === 0) {
              location.href = "cart.html";
            }
          })
        }
        
        if ( info.error === 400 ) {
          location.href = "login.html?retUrl=" + location.href;
        }
      }
    })
  
  
  })
  
  
})