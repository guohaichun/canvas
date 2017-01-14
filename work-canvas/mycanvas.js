function shape(canvas,copy,cobj){
    this.canvas=canvas;
    this.copy=copy;
    this.cobj=cobj;
    this.width=this.canvas.width;
    this.height=this.canvas.height;
    this.historys=[];
    this.type="line";
    this.style="stroke";
    this.border="#000";
    this.fill="#000";
    this.linew=1;
    this.bianNum=5;
    this.jiaoNum=5;
    this.isback=true;
}
shape.prototype= {
    init: function () {
        this.cobj.strokeStyle = this.border;
        this.cobj.fillStyle = this.fill;
        this.cobj.lineWidth = this.linew;
    },
    draw: function () {
        var that = this;
        this.copy.onmousedown = function (e) {
            var startx = e.offsetX;
            var starty = e.offsetY;
            that.copy.onmousemove = function (e) {
                that.isback = true;
                that.init();
                var endx = e.offsetX;
                var endy = e.offsetY;
                that.cobj.clearRect(0, 0, that.width, that.height);
                if (that.historys.length > 0) {
                    that.cobj.putImageData(that.historys[that.historys.length - 1], 0, 0);
                }
                that[that.type](startx, starty, endx, endy);

            }

            that.copy.onmouseup = function () {
                that.copy.onmouseup = null;
                that.copy.onmousemove = null;
                that.historys.push(that.cobj.getImageData(0, 0, that.width, that.height));
            }
        }
    },
    line: function (x, y, x1, y1) {
        var that = this;
        that.cobj.beginPath();
        that.cobj.moveTo(x, y);
        that.cobj.lineTo(x1, y1);
        that.cobj.stroke();
    },
    rect: function (x, y, x1, y1) {
        var that = this;
        that.cobj.beginPath();
        that.cobj.rect(x, y, x1 - x, y1 - y)
        that.cobj[that.style]();
    },
    arc: function (x, y, x1, y1) {
        this.cobj.beginPath();
        var r = Math.sqrt((x1 - x) * (x1 - x) + (y1 - y) * (y1 - y));
        this.cobj.arc(x, y, r, 0, 2 * Math.PI);
        this.cobj[this.style]();
    },
    bian: function (x, y, x1, y1) {
        var angle = 360 / this.bianNum * Math.PI / 180;
        var r = Math.sqrt((x1 - x) * (x1 - x) + (y1 - y) * (y1 - y));
        this.cobj.beginPath();
        for (var i = 0; i < this.bianNum; i++) {
            this.cobj.lineTo(Math.cos(angle * i) * r + x, Math.sin(angle * i) * r + y);
        }
        this.cobj.closePath();
        this.cobj[this.style]();
    },

    jiao: function (x, y, x1, y1) {
        var angle = 360 / (this.jiaoNum * 2) * Math.PI / 180;
        var r = Math.sqrt((x1 - x) * (x1 - x) + (y1 - y) * (y1 - y));
        var r1 = r / 3;
        this.cobj.beginPath();
        for (var i = 0; i < this.jiaoNum * 2; i++) {
            if (i % 2 == 0) {
                this.cobj.lineTo(Math.cos(angle * i) * r + x, Math.sin(angle * i) * r + y);
            } else {
                this.cobj.lineTo(Math.cos(angle * i) * r1 + x, Math.sin(angle * i) * r1 + y);
            }
        }
        this.cobj.closePath();
        this.cobj[this.style]();
    },
    pen: function () {
        var that = this;
        this.copy.onmousedown = function (e) {
            var startx = e.offsetX;
            var starty = e.offsetY;
            that.cobj.beginPath();
            that.cobj.moveTo(startx, starty);
            that.copy.onmousemove = function (e) {
                that.init();
                var endx = e.offsetX;
                var endy = e.offsetY;
                that.cobj.clearRect(0, 0, that.width, that.height);
                if (that.historys.length > 0) {
                    that.cobj.putImageData(that.historys[that.historys.length - 1], 0, 0);
                }
                that.cobj.lineTo(endx, endy);
                that.cobj.stroke();

            }

            that.copy.onmouseup = function () {
                that.copy.onmouseup = null;
                that.copy.onmousemove = null;
                that.historys.push(that.cobj.getImageData(0, 0, that.width, that.height));
            }
        }
    }
}
var canvas=document.querySelector("canvas");
var cobj=canvas.getContext("2d");
var img=document.querySelector("img");
    /*马赛克*/
    function m(dataobj, num, x, y){
    var width = dataobj.width, height = dataobj.height;
    var num = num;
    var w = width / num;
    var h = height / num;
    for (var i = 0; i < num; i++) {//行
        for (var j = 0; j < num; j++) {//列  x
            var dataObj = cobj.getImageData(j * w, i * h, w, h);
            var r = 0, g = 0, b = 0;
            for (var k = 0; k < dataObj.width * dataObj.height; k++) {
                r += dataObj.data[k * 4 + 0];
                g += dataObj.data[k * 4 + 1];
                b += dataObj.data[k * 4 + 2];
            }
            r = parseInt(r / (dataObj.width * dataObj.height));
            g = parseInt(g / (dataObj.width * dataObj.height));
            b = parseInt(b / (dataObj.width * dataObj.height));
            console.log(r + "--" + g + "--" + b);
            for (var k = 0; k < dataObj.width * dataObj.height; k++) {
                dataObj.data[k * 4 + 0] = r;
                dataObj.data[k * 4 + 1] = g;
                dataObj.data[k * 4 + 2] = b;
            }
            cobj.putImageData(dataObj, x + j * w, y + i * h);
        }
    }
}
/*模糊*/
function blur(dataobj, num, x, y) {
    var width = dataobj.width, height = dataobj.height;
    var arr = [];
    var num = num;
    for (var i = 0; i < width; i++) {//行
        for (var j = 0; j < height; j++) {//列  x
            var x1 = j + num > width ? j - num : j;
            var y1 = i + num > height ? i - num : i;
            var dataObj = cobj.getImageData(x1, y1, num, num);
            var r = 0, g = 0, b = 0;
            for (var k = 0; k < dataObj.width * dataObj.height; k++) {
                r += dataObj.data[k * 4 + 0];
                g += dataObj.data[k * 4 + 1];
                b += dataObj.data[k * 4 + 2];
            }
            r = parseInt(r / (dataObj.width * dataObj.height));
            g = parseInt(g / (dataObj.width * dataObj.height));
            b = parseInt(b / (dataObj.width * dataObj.height));
            arr.push(r, g, b, 255);
        }
    }
    for (var i = 0; i < dataobj.data.length; i++) {
        dataobj.data[i] = arr[i]
    }
    cobj.putImageData(dataobj, x, y);
}
fx();
function fx(dataobj, x, y) {
    for (var i = 0; i < dataobj.width * dataobj.height; i++) {
        dataobj.data[i * 4 + 0] = 255 - dataobj.data[i * 4 + 0];
        dataobj.data[i * 4 + 1] = 255 - dataobj.data[i * 4 + 1];
        dataobj.data[i * 4 + 2] = 255 - dataobj.data[i * 4 + 2];
        dataobj.data[i * 4 + 3] = 255
    }
    cobj.putImageData(dataobj, x, y);
}
var file = document.querySelector(".xz");
var img = document.querySelector("img");
file.onchange = function () {
    var fileObj = this.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(fileObj);
    reader.onload = function (e) {
        img.src = e.target.result;
        cobj.drawImage(img, 0, 0, canvas.width, canvas.height)
        dataobj = cobj.getImageData(0, 0, canvas.width, canvas.height);
    }
}
var lis = document.getElementsByClassName(".xztp");
for (var i = 0; i < lis.length; i++) {
    lis[i].onclick = function () {
        var attr = this.getAttribute("data-role")
        if (attr == "blur") {
            blur(dataobj, 5, 0, 0)
        } else if (attr == "fx") {
            alert(1);
            fx(dataobj, 0, 0)
        } else if (attr == "m") {
            m(dataobj, 50, 0, 0)
        }
    }
}
