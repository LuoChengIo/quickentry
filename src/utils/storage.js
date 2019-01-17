;(function(global) {
  global.locMemory = {}
  global.locMemory.localStorage = {
    setItem: function(key, value, expired) {
      /*
       * setItem 存储方法
       * @ param {String}     key 键
       * @ param {String}     value 值，
       * @ param {String}     expired 过期时间，以分钟为单位，非必须
       */
      value = JSON.stringify(value)
      value = value || ''
      if (expired) {
        localStorage[`${key}__expires__`] = Date.now() + 1000 * 60 * expired
      }
      localStorage[key] = value
      return value
    },
    getItem: function(key) {
      /*
       * getItem 获取方法
       * @ param {String}     key 键
       * @ param {String}     expired 存储时为非必须字段，所以有可能取不到，默认为 Date.now+1
       */
      const expired = localStorage[`${key}__expires__`] || Date.now + 1
      const now = Date.now()

      if (now >= expired) {
        localStorage.removeItem(key)
        localStorage.removeItem(`${key}__expires__`)
        return
      }
      const value = localStorage[key]
        ? JSON.parse(localStorage[key])
        : localStorage[key]
      return value
    },
    removeItem: function(key) {
      localStorage.removeItem(key)
    },
    clear: function() {
      localStorage.clear()
    }
  }
  global.locMemory.sessionStorage = {
    setItem: function(key, value) {
      /*
       * setItem 存储方法
       * @ param {String}     key 键
       * @ param {String}     value 值，
       */
      value = JSON.stringify(value)
      value = value || ''
      sessionStorage[key] = value
      return value
    },
    getItem: function(key) {
      /*
       * getItem 获取方法
       * @ param {String}     key 键
       */
      const value = sessionStorage[key]
        ? JSON.parse(sessionStorage[key])
        : sessionStorage[key]
      return value
    },
    removeItem: function(key) {
      sessionStorage.removeItem(key)
    },
    clear: function() {
      sessionStorage.clear()
    }
  }
})(window)
