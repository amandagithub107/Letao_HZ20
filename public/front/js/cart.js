


$(function () {
  
  // 一进入页面, 请求购物车信息数据
  function render() {
    setTimeout(function () {
      $.ajax({
        type: "get",
        url: "/cart/queryCart",
        success: function ( info ) {
          console.log(info);
          if ( info === 400 ) {
            location.href = "login.html?retUrl=" + location.href;
            return;
          }
  
          // 已经登录了  注意: 登录成功 info 是一个数组
          var htmlStr = template( "cartTpl", { list: info } );
          $("#cartList").html( htmlStr );
          
          mui(".mui-scroll-wrapper").pullRefresh().endPulldownToRefresh();
          
        }
      });
    }, 500);
  }
  
  // 1. 配置下拉刷新
  mui.init({
    pullRefresh: {
      container: ".mui-scroll-wrapper",
      down: {
        auto: true,
        callback: function () {
          render()
        }
      }
    }
  });
  
  
  // 2. 点击删除按钮, 实现删除功能, 事件委托来实现
  //    注意: 要使用 tap 事件, 因为是 a 标签, 默认 click 被阻止了
  $('.lt_main').on("tap", ".btn_delete", function () {
    var that = this;
    mui.confirm("你是否要删除该商品", "温馨提示", ["确认", "取消"], function (e) {
      if ( e.index === 0 ) {
        var id = $(that).data("id");
        $.ajax({
          type: "get",
          url: "/cart/deleteCart",
          data: {
            id: [ id ]
          },
          success: function ( info ) {
            console.log(info);
            if ( info.success ) {
              mui(".mui-scroll-wrapper").pullRefresh().pulldownLoading();
            }
          }
        })
      }
    })
    
  });
  
  // 3. 修改功能
  // (1) 给所有的修改按钮, 添加点击事件  (事件委托, tap事件)
  // (2) 弹出确认框
  $('.lt_main').on("tap", ".btn_edit", function () {
    var id = this.dataset.id;
    console.log(this.dataset);
    var htmlStr = template( "editTpl", this.dataset);
    htmlStr = htmlStr.replace( /\n/g, "");
    mui.confirm( htmlStr, "编辑商品", ["确认", "取消"], function (e) {
      if( e.index === 0 ) {
        var size = $('.lt_size span.current').text();
        var num = $('.lt_num .mui-numbox-input').val();
        
        $.ajax({
          type: "post",
          url: "/cart/updateCart",
          data: {
            id: id,
            size: size,
            num: num
          },
          success: function ( info ) {
            console.log(info);
            if ( info.success ) {
              mui(".mui-scroll-wrapper").pullRefresh().pulldownLoading();
            }
          }
        })
      }
    })
    mui(".mui-numbox").numbox();
  })
  
  
  // 4. 添加尺码选择功能
  $('body').on("click", ".lt_size span", function () {
    $(this).addClass("current").siblings().removeClass("current");
  })
  
  // 5. 计算价格功能
  // 给所有 checkbox 添加点击事件
  $('.lt_main').on("click", ".ck", function () {
    var total = 0;
    var $checkBoxes = $('.lt_main .ck:checked');
    $checkBoxes.each(function () {
      var price = $(this).data("price");
      var num = $(this).data("num");
      total += price * num;
    })
    console.log(total);
    total = total.toFixed(2);
    $('#totalPrice').text( total );
  })
  
})