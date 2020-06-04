// indexedDB数据库
window.indexedDb = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
window.IDBCursort = window.IDBCursor || window.webkitIDBCursor || window.msIDBCursor;


// 添加，删除类属性
window.hasClass = function (element, className) {
  let reg = new RegExp("\\b" + className + "\\b");
  return element.className.search(reg) !== -1;
};
window.removeClass = function (element, className) {
  var reg = new RegExp("\\b"+className+"\\b");
  element.className = element.className.replace(reg, "");
};
window.addClass = function (element, className) {
  element.className += " " + className;
};
window.toggleClass = function (element, className) {
  if (window.hasClass(element, className)) {
    window.removeClass(element, className);
  } else {
    window.addClass(element, className);
  }
};
// 添加删除类属性，并且支持同时添加或删除多个类属性
Element.prototype.removeClass = function (str) {
  var arr = str.split(" ");
  for (let i = 0; i < arr.length; i++) {
    let reg = new RegExp("\\b" + arr[i] + "\\b");
    this.className = this.className.replace(reg, "");
  }
}
Element.prototype.addClass = function (str) {
  var arr = str.split(" ");
  for (let i = 0; i < arr.length; i++) {
    if (!this.hasClass(arr[i])) {
      this.className += arr[i];
    }
  }
};
Element.prototype.hasClass = function (str) {
  let reg = new RegExp("\\b" + str + "\\b");
  return reg.test(this.className);
};



window.$ = function (str) {
  return document.querySelector(str);
}
window.$$ = function (str) {
  return document.querySelectorAll(str);
};


Element.prototype.$ = function (str) {
  return this.querySelector(str);
};
Element.prototype.$$ = function (str) {
  return this.querySelectorAll(str);
};


// 绑定事件和删除事件
Element.prototype.addEvent = function (eventStr, callback, bool = false) {
  if (Element.prototype.addEventListener) {
    return this.addEventListener(eventStr, callback, bool);
  } else {
    return this.attachEvent("on"+eventStr, callback);
  }
};
Element.prototype.removeEvent = function (eventStr, callback, bool = false) {
  if (Element.prototype.removeEventListener) {
    return this.removeEventListener(eventStr, callback, bool);
  } else {
    return this.detachEvent("on"+eventStr, callback);
  }
};



// Element.prototype.getDocPos = function () {
//   var e = this,
//       x = 0,
//       y = 0;
//   while (e !== null) {
//     x += e.offsetLeft;
//     y += e.offsetTop;
//     e = e.offsetParent;
//   }
//   return {x:x, y:y};
// };
Object.defineProperty (Element.prototype, "getDocPos", {
  get: function () {
    var e = this,
        x = 0,
        y = 0;
    while (e !== null) {
      x += e.offsetLeft;
      y += e.offsetTop;
      e = e.offsetParent;
    }
    return {x:x, y:y};
  },
  enumerable: false,
});

Object.defineProperties (Object.prototype, {
  "extend": {
    writable: false,
    enumerable: false,
    configurable: false,
    value: function (obj) {
      if (typeof obj !== "object" || obj === null) {
        return false;
      }
      let arr = Object.keys(obj);
      for (let a of arr) {
        this[a] = obj[a];
      }
    },
  },
});



// 查询浏览器窗口在横向和纵向的滚动距离
// let windowScrollX = window.pageXOffset || window.document.documentElement.scrollLeft || window.document.body.scrollLeft;
//     windowScrollY = window.pageYOffset || window.document.documentElement.scrollTop || window.document.body.scrollTop;
// x 是横向滚动的距离， y 是纵向滚动的距离
// window.pageXOffset 支持大多数浏览器，但不支持IE8及之前的浏览器
// window.document.documentElement.scrollLeft 支持IE和现代浏览器
// window.document.body.scrollLeft 是在“怪异模式”下用于查询滚动距离的方式
// 另外，还有window.scrollX，这个是window.pageXOffset 的别称，不过似乎兼容性没有后者要好，所以平常都用后者。



// 可以通过 元素对象的 offsetLeft，offsetTop属性 来获取元素在文档视图中的x， y坐标。
// 但是对与某些元素，比如：已定位元素，表格单元等， 这两个属性的值是相对于祖先元素的值。
// 可以通过offsetParent来获取这些元素所相对的父元素。
// 当获取到的offsetParent为null时，则此时的offsetLeft和offsetTop为文档坐标。
// function getELementPosition (e) {
//   let x = 0, y = 0;
//   while (e !== null) {
//     x += e.offsetLeft;
//     y += e.offsetTop;
//     e = e.offsetParent;
//   }
//   return {'x':x, 'y':y};
// };
// 这个方法通过递归的方式获取元素的左边距和上边距。
 

function sortFunc (a, b, comparator) {
  if (comparator) {
    return comparator(a, b);
  }
  if (a > b) return 1;
  if (a < b) return -1;
  return 0;
};

// 对表格进行排序 
function sortTable (table, n, dir = 1/*是否要进行反向排序， 默认不需要*/, comparator/*比较函数，如果没有则按照默认的方式进行比较*/) {
  let tbody = table.tBodies[0], // 一般表格就一个tbody，所以直接选第一个
      rows = tbody.children || tbody.getElementsByTagName("tr");    // 获取tbody中的行元素
  rows = Array.prototype.slice.call(rows, 0);
  
  rows.sort(function (a, b) {
    if (a.children) {
      var val1 = a.children[n].innerText,
          val2 = b.children[n].innerText;
    } else {
      let tds1 = a.getElementsByTagName("td"),
          tds2 = b.getElementsByTagName("td");
      var val1 = tds1[n].innerText,
          val2 = tds2[n].innerText;
    }
    return sortFunc(val1, val2, comparator);
  });

  if (dir === -1) {
    rows.reverse();
  }
  
  for (let i = 0; i < rows.length; i++) {
    tbody.appendChild(rows[i]);
  }
};