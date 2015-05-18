/**
 * Created by szmurlor on 18.05.15.
 */
var CS = CS || {
    components: [],
    MM_ADD_RESISTOR: 1,
    MM_SELECT: 2,
    csMouseMode: this.MM_SELECT,
    lastX: 0,
    lastY: 0,
    mmDown: false,

    init: function (id) {
        var c =$('#' + id);
        c.mousedown(function (e) {
            x = e.pageX - this.offsetLeft;
            y = e.pageY - this.offsetTop;

            this.lastX = x;
            this.lastY = y;

            switch (CS.csMouseMode) {
                case CS.MM_SELECT:
                    CS.clearSelected();
                    CS.select(x, y);
                    break;
                case CS.MM_ADD_RESISTOR:
                    CS.addResistor(x, y);
                    break;
                default:
                    break;
            }
            CS.repaint();
            CS.mmDown = true;
        });

        c.mouseup(function (e) {
            x = e.pageX - this.offsetLeft;
            y = e.pageY - this.offsetTop;
            switch (CS.csMouseMode) {
                case CS.MM_ADD_RESISTOR:
                    // CS.addResistor(x, y);
                    break;
            }
            CS.mmDown = false;
        });

        c.mouseleave(function (e) {
            CS.mmDown = false;
        });

        c.mousemove(function (e) {
            x = e.pageX - this.offsetLeft;
            y = e.pageY - this.offsetTop;
            dx = x - this.lastX;
            dy = y - this.lastY;

            switch (CS.csMouseMode) {
                case CS.MM_SELECT:
                    if (CS.mmDown) {
                        CS.moveSelectedBy(dx, dy);
                        CS.repaint();
                    }
                    break;
            }

            this.lastX = x;
            this.lastY = y;
        });

    },

    addResistor: function (x,y) {
        var c = new Resistor(x,y, "R1");
        this.components.push(c);
    },

    repaint: function() {
        var context = document.getElementById("scheme").getContext("2d");
        context.lineJoin = "round";

        context.clearRect(0,0, context.canvas.width, context.canvas.height);

        for (var i=0; i< this.components.length; i++) {
            c = this.components[i];
            c.paint(context);
        }

    },

    moveSelectedBy: function(dx,dy) {
        this.components.forEach(function(it) {
            if (it.selected) {
                it.x = it.x + dx;
                it.y = it.y + dy;
            }
        });
    },

    select: function(x,y) {
        this.components.forEach(function(it) {
           if (it.isInside(x,y)) {
               it.selected = true;
           }
        });
    },
    clearSelected: function() {
        this.components.forEach(function(it) {
            it.selected = false;
        });
    }

};

$(document).ready( function() {
   CS.init('scheme');
});


var Terminal = function(dx,dy) {
    this.dx = dx;
    this.dy = dy;
};

var ElectricalComponent = function(x,y,name) {
    this.x = x;
    this.y = y;
    this.width = 20;
    this.height = 10;
    this.name = name;
    this.terminals = [];
    this.selected = false;
};

ElectricalComponent.prototype.isInside = function (x,y) {
    return x >= (this.x-this.width) && x <= (this.x+this.width) && y >= (this.y-this.height) && y <= (this.y+this.height);
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

    ctx.save();
    //ctx.beginPath();

    if (this.selected)
        ctx.strokeStyle = 'red';
    else
        ctx.strokeStyle = 'black';

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

    ctx.restore();
};
