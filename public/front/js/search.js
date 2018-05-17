


$(function () {



  
  // 1.基本的历史记录的读取和渲染：
  //   (1).读取localstorage中的历史记录；转换成数组。把这个方法封装成gethistory（）方法
  //   (2).通过模板引擎，把数组中的数据渲染到页面上。把这个地点封装成render（）方法。
  // 2.清空历史记录
  //   (1) 给清空历史记录按钮添加点击事件, 注意: 是动态渲染, 需要通过事件委托（添加确认框）
  //   (2) 将本地存储中 search_list 删除
  //   (3) 读取本地存储
  //   (4) 重新渲染
  // 3.删除某一条
  //   (1) 添加点击事件(事件委托)
  //   (2) 获取要删除的数组索引, 通过 data 方法可以获取索引
  //   (3) 调用getHistory获取数组, 删除数组里面对应索引的项(?)
  //   (4) 更新到本地存储中
  //   (5) 调用 render() 方法重新进行渲染
  // 4.添加一条搜索记录
  //   (1) 给搜索按钮, 添加点击事件
  //   (2) 获取搜索框输入的值
  //   (3) 获取数组
  //       1: 如果有重复的项, 删除
  //       2: 如果历史记录长度大于 10, 删掉最后一个, 最老的一个
  //   (4) 添加到数组最前面
  //   (5) 同步到本地存储中
  //   (6) 重新渲染历史记录列表
  
  
  // 4.添加一条搜索记录
  //   (1) 给搜索按钮, 添加点击事件
  //   (2) 获取搜索框输入的值
  //   (3) 获取数组
  //       1: 如果有重复的项, 删除
  //       2: 如果历史记录长度大于 10, 删掉最后一个, 最老的一个
  //   (4) 添加到数组最前面
  //   (5) 同步到本地存储中
  //   (6) 重新渲染历史记录列表
  
  
  
  // 功能1: 实现渲染历史记录功能, 一进入页面调用 render即可
  render();
  
  
  // 由于没有数据，我先把添加数据到本地存储的功能写出来
  $('.lt_search button').click(function () {
    // 获取输入框中的内容
    var key = $(".lt_search input").val().trim();
    // 如果内容是空，提示用户输入关键字
    if ( key === "" ) {
      mui.toast("请输入搜索关键字");
      return;
    }
    // 获取本地存储中的内容
    var arr = getHistory();
    // 判断新输入的内容是否与本地存储中的重复
    var index = arr.indexOf(key);
    if ( index > -1 ) {
      // 说明有重复项, 要删除该项
      arr.splice( index, 1 );
    }
    // 需求2: 如果历史记录长度大于 10, 删掉最后一个, 最老的一个
    if ( arr.length >= 10 ) {
      arr.pop();
    }
  
    // 添加到数组最前面
    arr.unshift( key );
  
    // 持久化到本地存储中, 同步到本地存储中
    localStorage.setItem( "search_list", JSON.stringify( arr ) );
  
    // 页面重新渲染
    render();
  
    // 清空搜索框
    $('.lt_search input').val("");
  
    // 跳转到搜索列表页, 通过地址栏, 可以进行页面与页面之间的传参
    location.href = "searchList.html?key=" + key;
  
  })
  
  
  
  // 1.基本的历史记录的读取和渲染：
  // (1).读取
  function getHistory() {
    var history = localStorage.getItem("search_list") || "[]";
    var arr = JSON.parse( history );
    return arr;// ["好乐买", "1"]
  }
  // (2).渲染
  function render() {
    var arr = getHistory();
    $('.lt_history').html( template( "historyTpl", { arr: arr} ) );
  }
  
  // 功能2: 清空历史记录
  // (1) 给清空历史记录按钮添加点击事件, 注意: 是动态渲染, 需要通过事件委托
  // (2) 将本地存储中 search_list 删除
  // (3) 读取本地存储
  // (4) 重新渲染
  $('.lt_history').on("click", ".btn_empty", function () {
    mui.confirm( "你确认要清空所有历史记录么", "温馨提示", ["取消", "确认"], function ( e ) {
      //console.log(e);//{index: 0, value: ""}
      // e.index 指的是点击的按钮的索引
      if ( e.index === 1 ) {
        // 点击了确认按钮
        localStorage.removeItem("search_list");
        render();
      }
    })
  });
  
  
  // 功能3: 删除某一条
  // (1) 添加点击事件(事件委托)
  // (2) 获取要删除的数组索引, 通过 data 方法可以获取索引
  // (3) 调用getHistory获取数组, 删除数组里面对应索引的项(?)
  // (4) 更新到本地存储中
  // (5) 调用 render() 方法重新进行渲染
  $('.lt_history').on("click", ".btn_delete", function () {
    var that = this;
    mui.confirm("你确认要删除这条信息么?", "温馨提示", ["确认", "取消"], function (e) {
      if ( e.index === 0 ) {
        var index = $(that).data("index");
        var arr = getHistory();
        arr.splice( index, 1 );//会改变原数组
        localStorage.setItem( "search_list", JSON.stringify( arr ) );
        render();
      }
    })
  });
  
  
});