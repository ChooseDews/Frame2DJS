let FEM = require('./BeamElementFEA');


let Points = [ [ 200, 300 ], [ 600, 300 ], [ 400, 200 ] ];
let Connections = [[0,1, 20, 1],[0,2, 20, 1],[1,2, 20, 1]];
let Forces = [[0,1,0,"Fixed Y"],[0,1,0,"Moment"],[0,1,0,"Fixed X"],[1,1,0,"Fixed Y"], [2,0,-2000,"Force"]];

let Results = {}

let removePoint = function(index){
    Points.splice(index, 1)
    update()
};

let subs = [];
let update = function(){

    for(let C of Connections){
        let p1 = Points[C[0]]
        let p2 = Points[C[1]]
        C[2] = (Math.atan2(p1[1]-p2[1],p1[0]-p2[0])+Math.PI) * 180 / Math.PI;
        C[3] = Math.sqrt((p1[0]-p2[0])**2 + (p1[1]-p2[1])**2)

    }



    for(let sub of subs) sub(Points, Connections, Forces, Results);
}


let addSubscriber = function(call){
    subs.push(call)
}

let getPoints = function(){
    return Points;
}

let addPoint = function(point){
    Points = [...Points, point]
    Results = {}

    update()
}

let movePoint = function(index, point){
    for(let i in Points){
        if(i == index) Points[i] = point;
    }
    Results = {}

    update()
}



let addForce = function(node,x,y,type){
    Forces.push([node, x,y,type]);
    Results = {}

    update();
}

let addConnection = function(node1, node2){
    Connections.push([node1, node2, 'angle', 'length']);
    Results = {}
    update();
}


let clearForces = function(){
    Forces = [];
    Results = {}

    update();
}

let clearConnections = function(){
    Connections = [];
    Results = {}

    update();
}

let getConnections = function(){
    return Connections;
}

let getForces = function(){
    return Forces;
}


update()

let runFEM = function(){
    Results = FEM([...Points], [...Connections], [...Forces]);
    update()

    return Results
}



module.exports = {
    removePoint,
    addSubscriber,
    getPoints,
    addPoint,
    movePoint,
    addConnection,
    clearConnections,
    getConnections,
    addForce,
    getForces,
    runFEM,
    clearForces
}