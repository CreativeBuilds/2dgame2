/*
 * w = width of the UI elemnet
 * h = height of the UI element
 * x = the X coord position on the canvas
 * y = the Y coord position on the canvas
 * color = a hex string to determine the background color;
 */
var UIElements = [];
function UIElement({ w = 128, h = 256, x = 0, y = 0, color = '#000000', extra}){
    this.w = w;
    this.h = h;
    this.x = x;
    this.y = y;
    this.color = color;
    this.extra = extra;
    
    UIElements.push(this);
}

UIElement.prototype.draw = function(ctx){
    ctx.fillStyle = this.color;
    ctx.fillRect(this.w,this.h,this.x,this.y);
}