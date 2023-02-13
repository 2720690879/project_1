$(function(){
  // 1/定义延时器的id
  var timer = null
  // 定义全局缓存对象
  var cacheobj = {}

  // 2、定义防抖函数
  function debounceSearch(kw){
    timer = setTimeout(function(){
      getSuggestList(kw)
    },500)
  }
  // 监听文本框的keyup事件
  $('#ipt').on('keyup', function(){
    // 3、清空timer
    clearTimeout(timer)
    // 用户输入的内容
    var keywords = $(this).val().trim()
    // 判断用户输入的内容是否为空
    if(keywords.length <= 0){
      return $('#suggest-list').empty().hide()
    }

    // 先判断缓存中是否有数据
    if(cacheobj[keywords]){
      return renderSuggestList(cacheobj[keywords])
    }

    // TODO:获取搜索建议列表
    // console.log(keywords)
    // getSuggestList(keywords)
    debounceSearch(keywords)
  })

  // 将获取搜索建议列表的代码，封装到 getSuggestList函数中
  function getSuggestList(kw){
    $.ajax({
      // 指定请求的URL地址，其中q是用户输入的关键字
      url:'https://suggest.taobao.com/sug?q=' +kw,
      // 指定要发起的是JSONP请求
      dataType: 'jsonp',
      // 成功的回调函数
      success:function(res){
        // console.log(res)
        renderSuggestList(res)
      }
    })
  }
 
  // 渲染建议列表
  function renderSuggestList(res){
    // 如果没有需要渲染的数据，直接return
    if(res.result.length <= 0){
      return $('#suggest-list').empty().hide()
    }
    // 渲染模板结构
    var htmlStr = template('tpl-suggestList',res)
    $('#suggest-list').html(htmlStr).show()

    // 1、获取用户输入的内容当作键
    var k = $('#ipt').val().trim()
    // 2、需要将数据当作值进行缓存
    cacheobj[k] = res
  }
})
