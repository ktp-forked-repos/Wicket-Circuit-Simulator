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
    c = {
        'x': x,
        'y': y
    };

    components.push(c);
    repaint();
}

function repaint() {
    var context = document.getElementById("scheme").getContext("2d");
    context.lineJoin = "round";

    for (var i=0; i< components.length; i++) {
        c = components[i];
        context.beginPath();
        context.moveTo(c.x, c.y);
        context.lineTo(c.x+5, c.y);
        context.lineTo(c.x+5, c.y+5);
        context.lineTo(c.x, c.y+5);
        context.lineTo(c.x, c.y);
        context.closePath();
    }

    context.stroke();

}