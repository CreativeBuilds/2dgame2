//Rename to something better
function getTileForValue(x,y){
    let arr = [
        {
            "xMin":0,
            "xMax":2,
            "yMin":0,
            "yMax":2,
            "x":x,
            "y":y,
            "type": "grass", 
            "sprites":[{x:x*32,y:y*32,w:32,h:32,d:200}]
        },
        {
            "xMin":0,
            "xMax":2,
            "yMin":0,
            "yMax":2,
            "type": "path", 
            "sprites":[{x:x*32,y:y*32,w:32,h:32,d:200}]
            
        },
        {
            "xMin":6,
            "xMax":8,
            "yMin":0,
            "yMax":2,
            "type": "water", 
            "sprites":[{x:x*32,y:y*32,w:32,h:32,d:500},{x:x*32,y:(y+3)*32,w:32,h:32,d:350},{x:x*32,y:(y+6)*32,w:32,h:32,d:200},{x:x*32,y:(y+9)*32,w:32,h:32,d:500}]
        },
        {
            "xMin":0,
            "xMax":3,
            "yMin":3,
            "yMax":6,
            "type": "tree",
            "sprites":[{x:x*32,y:y*32,w:32,h:32}]
        }
    ]
    for(o of arr){
        if(o.xMin <= x && o.xMax >= x && o.yMin <= y && o.yMax >= y){
            o.tileInfo = tileTypes[o.type];
            return o;
        }
    }
}