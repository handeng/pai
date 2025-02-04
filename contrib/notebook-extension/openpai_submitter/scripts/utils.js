define(['require'], function (requirejs) {
  return {
    getLoadingImg: function (idName) {
      var loadingImg
      if (idName !== undefined) { loadingImg = '<img src="' + requirejs.toUrl('../misc/loading.gif') + '" class="loading-img" id="' + idName + '"></img>' } else { loadingImg = '<img src="' + requirejs.toUrl('../misc/loading.gif') + '" class="loading-img"></img>' }
      return loadingImg
    },
    getLoadingImgSmall: function (idName) {
      var loadingImg
      if (idName !== undefined) { loadingImg = '<img src="' + requirejs.toUrl('../misc/loading.gif') + '" class="loading-img-small" id="' + idName + '"></img>' } else { loadingImg = '<img src="' + requirejs.toUrl('../misc/loading.gif') + '" class="loading-img-small"></img>' }
      return loadingImg
    },
    copy_to_clipboard: function (text) {
      return new Promise(function (resolve, reject) {
        function fallbackCopyTextToClipboard (text) {
          var textArea = document.createElement('textarea')
          textArea.value = text
          document.body.appendChild(textArea)
          textArea.focus()
          textArea.select()
          try {
            var successful = document.execCommand('copy')
            var msg = successful ? 'successful' : 'unsuccessful'
            resolve()
          } catch (err) {
            reject(err)
          }
          document.body.removeChild(textArea)
        }
        function copyTextToClipboard (text) {
          if (!navigator.clipboard) {
            fallbackCopyTextToClipboard(text)
            return
          }
          navigator.clipboard.writeText(text).then(function () {
            resolve()
          }, function (err) {
            reject(err)
          })
        }
        copyTextToClipboard(text)
      })
    },
    set_timeout: function timeout (ms, value) {
      return new Promise((resolve, reject) => {
        setTimeout(resolve, ms, value)
      })
    },
    set_timeout_func: function timeoutFunc (ms, func, args) {
      return new Promise((resolve, reject) => {
        setTimeout(function () {
          func.apply(args)
          resolve()
        }, ms)
      })
    }
  }
})
