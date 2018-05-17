

$(function () {
  // 功能1 一进入页面, 解析地址栏参数, 将搜索关键字赋值到 搜索框中proName 来自于 input 框
  
  // render 方法作用, 配置参数, 请求数据, 真正的渲染操作, 由 callback 进行配置
  
  // 配置了下拉刷新
  // 1. 下拉刷新初始化
  // 2. 配置回调函数, 在下拉刷新时, 进行 ajax 请求, 渲染页面 => render()
  // 3. 渲染完页面, 关闭正在刷新中的状态
  
  // 功能2: 点击搜索按钮, 需要渲染一次, 并持久化到历史记录中
  // 功能3: 点击排序的时候, 需要渲染一次(传递更多的参数)
  
  // 功能1: 页面一进来, 需要渲染一次, 将地址栏参数解析到 input 框中,  proName 来自于 input 框
  var key = getSearch( "key" );
  $('.lt_search input').val( key );
  
  var currentPage = 1;
  var pageSize = 2;
  
  function render( callback ) {
    var obj = {};
    // 必传参数
    obj.proName = $('.lt_search input').val();
    obj.page = currentPage;
    obj.pageSize = pageSize;
  
    // 还有两个可传可不传的参数 price num
    var $current = $('.lt_sort a.current');
    
    if ( $current.length > 0 ) {
      // 需要排序, 需要加参数  （1升序，2降序）
      var sortName = $current.data("type");
      var sortValue = $current.find("i").hasClass("fa fa-angle-down") ? 2 : 1;
      obj[ sortName ] = sortValue;
    }
    
    setTimeout(function () {
      $.ajax({
        type: "get",
        url: "/product/queryProduct",
        data: obj,
        success: function ( info ) {
          callback( info );
        }
      })
    }, 500);
  }
  
  
  // 配置了下拉刷新
  // 1. 下拉刷新初始化
  // 2. 配置回调函数, 在下拉刷新时, 进行 ajax 请求, 渲染页面 => render()
  // 3. 渲染完页面, 关闭正在刷新中的状态
  mui.init({
    pullRefresh: {
      container: ".mui-scroll-wrapper",
      down: {
        auto: true,
        callback: function () {
          currentPage = 1;
          render(function ( info ) {
            $('.lt_product').html( template( "productTpl", info ) );
            mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();
            mui('.mui-scroll-wrapper').pullRefresh().enablePullupToRefresh();
          });
        }
      },
      
      up: {
        callback: function () {
          currentPage++;
          render(function (info) {
            if ( info.data.length > 0 ) {
              $('.lt_product').append( template( "productTpl", info ) );
              mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh();
            }
            else {
              mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh( true );
            }
          });
        }
      }
    }
  });
  
  
  // 功能2: 点击搜索按钮, 需要渲染一次, 并持久化到历史记录中
  $('.lt_search button').click(function () {
    mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
    var key = $('.lt_search input').val();
    var history = localStorage.getItem("search_list") || '[]';
    var arr = JSON.parse( history );
  
    // 1. 不能有重复的
    var index = arr.indexOf( key );
    if ( index > -1 ) {
      arr.splice( index, 1 );
    }
    if ( arr.length >= 10 ) {
      arr.pop();
    }
    arr.unshift( key );
    localStorage.setItem( "search_list", JSON.stringify( arr ) );
  })
  
  
  // 功能3: 点击排序的时候, 需要渲染一次(传递更多的参数)
  $('.lt_sort a[data-type]').on( 'tap', function () {
    if( $(this).hasClass("current") ) {
      $(this).find("i").toggleClass("fa-angle-down").toggleClass("fa-angle-up");
    }
    else {
      $(this).addClass("current").siblings().removeClass("current");
      $(this).siblings().find("i").removeClass("fa-angle-up").addClass("fa-angle-down");
    }
    
    mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
    
  })

  
})