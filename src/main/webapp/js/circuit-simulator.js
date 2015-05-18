/**
 * Created by szmurlor on 18.05.15.
 */

var components = [];

var MM_ADD_RESISTOR = 1;
var csMouseMode = MM_ADD_RESISTOR;

$(document).ready( function() {
   init('scheme');
});

function init(id) {
    $('#'+id).mousedown(function (e) {
        x = e.pageX - this.offsetLeft;
        y = e.pageY - this.offsetTop;
        switch (csMouseMode) {
            case MM_ADD_RESISTOR:
                addResistor(x, y);
                break;
            default:
                break;
        }
    });
}

function addResistor(x,y) {
    var c = new Resistor(x,y, "R1");
    components.push(c);
    repaint();
}

function repaint() {
    var context = document.getElementById("scheme").getContext("2d");
    context.lineJoin = "round";

    for (var i=0; i< components.length; i++) {
        c = components[i];
        c.paint(context);
    }

}

var Terminal = function(dx,dy) {
    this.dx = dx;
    this.dy = dy;
};

var ElectricalComponent = function(x,y,name) {
    this.x = x;
    this.y = y;
    this.name = name;
    this.terminals = [];
};

ElectricalComponent.prototype.paint = function (context) {
    var c = this;
    for (var i = 0; i < this.terminals.length; i++) {
        var t = this.terminals[i];
        context.beginPath();
        context.moveTo(c.x + t.dx, c.y + t.dy-3);
        context.lineTo(c.x+6 + t.dx, c.y + t.dy-3);
        context.lineTo(c.x+6 + t.dx, c.y+3 + t.dy);
        context.lineTo(c.x + t.dx, c.y+3 + t.dy);
        context.lineTo(c.x + t.dx, c.y + t.dy-3);
        context.closePath();
        context.stroke();
    }
};

var Resistor = function(x,y,name) {
    ElectricalComponent.call(this, x,y,name);

    this.terminals.push( new Terminal(-20,0));
    this.terminals.push( new Terminal(15,0));
}
Resistor.prototype = Object.create(ElectricalComponent.prototype);
Resistor.prototype.constructor = Resistor;
Resistor.prototype.paint = function(ctx) {
    ElectricalComponent.prototype.paint.call(this, ctx);

    //ctx.beginPath();
    ctx.moveTo(this.x-15, this.y);
    ctx.lineTo(this.x-12, this.y+5);
    ctx.lineTo(this.x-9, this.y-5);
    ctx.lineTo(this.x-6, this.y+5);
    ctx.lineTo(this.x-3, this.y-5);
    ctx.lineTo(this.x-0, this.y+5);
    ctx.lineTo(this.x+3, this.y-5);
    ctx.lineTo(this.x+6, this.y+5);
    ctx.lineTo(this.x+9, this.y-5);
    ctx.lineTo(this.x+12, this.y+5);
    ctx.lineTo(this.x+15, this.y);
    //ctx.closePath();
    ctx.stroke();

};
