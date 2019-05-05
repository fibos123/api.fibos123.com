'use strict';

exports.util = {

  // 复制对象
  copy: function (obj) {
    return JSON.parse(JSON.stringify(obj));
  },

  // in array
  in_array: function (needle, haystack) {
    var length = haystack.length;
    for (var i = 0; i < length; i++) {
      if (haystack[i] == needle) return true;
    }
    return false;
  },


  // 检查空对象
  checkNullObj: function (obj) {
    for (var i in obj) {
      return false
    }
    return true
  },

  // 对象排序 顺序
  compare_sort: function (pro) {
    return function (obj1, obj2) {
      var val1 = obj1[pro];
      var val2 = obj2[pro];
      if (val1 < val2) { //正序
        return -1;
      } else if (val1 > val2) {
        return 1;
      } else {
        return 0;
      }
    }
  },

  // 对象排序 倒序
  compare_reverse: function (pro) {
    return function (obj1, obj2) {
      var val1 = obj1[pro];
      var val2 = obj2[pro];
      if (val1 < val2) { //正序
        return 1;
      } else if (val1 > val2) {
        return -1;
      } else {
        return 0;
      }
    }
  },

};