Element.prototype.removeClass = function (str) {
  let reg = new RegExp("\\b" + str + "\\b");
  this.className = this.className.replace(reg, "");
}
Element.prototype.addClass = function (str) {
  this.className += str;
};

// 轮播图
function _3DCarousel (element) {
  this.init(element);
};
_3DCarousel.prototype = {
  init (element) {   // 初始化
    this.content = element;
    this.pics = this.content.querySelectorAll(".img");    //获取轮播图中的项目
    this.dirl = this.content.querySelector(".dirl");      //左移按钮
    this.dirr = this.content.querySelector(".dirr");      //右移按钮
    this.arr = ["p1", "p2", "p3"];      //用于标志轮播图位置的属性
    this.timer = null;    //标记间隔调用

    this.content.onmouseover = () => {
      if (this.timer !== null) {    // 鼠标移入，轮播图停止
        clearInterval(this.timer);
        this.timer = null;
      }

      this.dirl.onclick = () => this.change();    //点击向左按钮，轮播图左移
      this.dirr.onclick = () => this.change(-1);      //点击向右按钮，轮播图右移
    };

    this.content.onmouseout = () => {
      if (this.timer === null) {    // 只有在没有自动轮播的情况下才会触发自动轮播
        this.timer = this.auto();
      }
    };

    this.timer = this.auto();     // 自动轮播
  },

  auto () {
    let oThis = this;
    return setInterval(function () {
      oThis.change();
    }, 2000);
  },

  change (step = 1) {   // 轮播图变换，默认从右向左移动；如果向右移动，则需要传入负数
    if (step === 0) {   // step为0,则什么也不变
      return ;
    }
    // step不为0,轮播图一定移动。此时需要清除原先轮播图中的p1,p2,p3元素，待得到新的顺序时，再重新添加。
    for (let i = 0; i < this.arr.length; i++) {
      this.pics[i].removeClass(this.arr[i]);
    }

    // 修改p1,p2,p3的顺序
    let arr;
    if (step > 0) {   // step大于0, 轮播图向左移动，则对应this.arr中p1,p2,p3需要向右移动
      // 数组中元素向右移动的方法是将尾部的元素取出放到头部
      arr = this.arr.splice(this.arr.length - step); // 默认取出所有尾部元素
      this.arr = arr.concat(this.arr);    // 将取出的尾部元素拼接到头部
    } else {    // step小于0,轮播图向右移动
      // 数组中元素向左移动的方法是将头部的元素取出，拼接到尾部
      arr = this.arr.splice(0, -step);
      this.arr = this.arr.concat(arr);
    }

    // 重新给轮播图添加p1,p2,p3属性
    for (let i = 0; i < this.arr.length; i++) {
      this.pics[i].addClass(this.arr[i]);
    }
  },
};