
// 禁用进度环
NProgress.configure({ showSpinner: false });

// 需求：每次ajax提交，产生进度条，ajax完成，结束进度条
$(document).ajaxStart(function () {
  // 开启进度条
  NProgress.start();
})

$(document).ajaxStop(function () {
  //工作中定时器要去掉，这里只是为了模拟网络请求的时间过程,即网络环境
  setTimeout(function () {
    //结束进度条
    NProgress.done();
  }, 500);
});




