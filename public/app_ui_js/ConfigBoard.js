/**
 * Created by Eamonn on 2015/10/22.
 */
var ConfigBoard = function (editBoard) {
    this.editBoard = editBoard;

};

ConfigBoard.prototype.resizeCanvas = function () {
    //reset canvasScroll
    this.resetScroll();
};

ConfigBoard.prototype.resetCanvas = function () {
    var left = (this.editBoard.__canvasCtner.offsetWidth-this.editBoard.__canvas.width)/2;
    var top = (this.editBoard.__canvasCtner.offsetHeight-this.editBoard.__canvas.height)/2;
    this.editBoard.canvasCtnEl.style.top=top+'px';
    this.editBoard.canvasCtnEl.style.left=left+'px';
    this.resetScroll();
};

ConfigBoard.prototype.resetScroll = function () {
    var canvasCol = document.getElementById('canvas-col');
    var sh= canvasCol.scrollHeight;
    var sfh = canvasCol.offsetHeight;
    var sTop = (sh-sfh)/2;

    var sw= canvasCol.scrollWidth;
    var sfw = canvasCol.offsetWidth;
    var sLeft = (sw-sfw)/2;
    $('#canvas-col').scrollTop(sTop);
    $('#canvas-col').scrollLeft(sLeft);
}

ConfigBoard.prototype.initKeyBoard = function () {
    var ie;
    if (document.all)
        ie = true;
    else
        ie = false; //判断是否IE
    document.onkeydown = KeyPress;
    document.onkeyup = KeyUp;
    var me = this;
    //设置键盘事件函数
    function KeyPress(){
        var key;
        if (ie)
            key = event.keyCode;
        else
            key = KeyPress.arguments[0].keyCode;
        if(key == 27){ //ESC键
            if (!me.editBoard.__canvas.isDrawingMode) {
                me.editBoard.__canvas.isDrawingMode = true;
                me.editBoard.__drawingModeEl.innerHTML = ' <i class="fa fa-mouse-pointer"></i>';
                me.editBoard.__drawingModeEl.setAttribute('class','btn btn-default');
            }
            else {
                me.editBoard.__canvas.isDrawingMode = false;
                me.editBoard.__drawingModeEl.innerHTML = ' <i class="fa fa-paint-brush "></i>';
                me.editBoard.__drawingModeEl.setAttribute('class','btn btn-info');
            }
        }
        if(key === 17){ //实际上为Ctrl键
            if(!ctrlKeyDown){
                ctrlKeyDown = true;
            }
        }
    }
    function KeyUp(event){
        var key = event.keyCode;
        if(key === 17){
            if(ctrlKeyDown)
                ctrlKeyDown = false;
        }
    }
};