let $ = require('mathjs');
let solve = require('./src/gaussJordan');

let printData = function(p){
    for(let i in p){
        let a = p[i];
        if(Math.abs(a) < 0.000001) a=0;
        console.log(i,a.toFixed(2))
    }
}

let createLocalMatrix = function(E, I, A, L){
    let a_1 = E*A/L;
    let a_2 = E*I/(L*L*L);
    return [
        [a_1, 0, 0, -a_1, 0, 0],
        [0, 12*a_2, 6*L*a_2, 0, -12*a_2, 6*L*a_2],
        [0, 6*L*a_2, 4*L*L*a_2, 0, -6*L*a_2, 2*L*L*a_2],
        [-a_1, 0, 0, a_1, 0, 0],
        [0, -12*a_2, -6*L*a_2, 0, 12*a_2, -6*L*a_2],
        [0, 6*L*a_2, 2*L*L*a_2, 0, -6*L*a_2, 4*L*L*a_2],
    ]
}


let createTransformationMatrix = function(p1, p2){
    let a = Math.atan2(p1[1]-p2[1],p1[0]-p2[0])+Math.PI
    return [
        [Math.cos(a), Math.sin(a), 0, 0, 0, 0],
        [-Math.sin(a), Math.cos(a), 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 0],
        [0, 0, 0, Math.cos(a), Math.sin(a), 0],
        [0, 0, 0, -Math.sin(a), Math.cos(a), 0],
        [0, 0, 0, 0, 0, 1],
    ]
}

let zeros = function(n){
    let M = [];
    for(let i = 0; i<n; i++){
        M[i] = [];
        for(let j = 0; j<n; j++) M[i][j] = 0;
    };
    return M;
}

let zeros1D = function(n,j){
    let M = [];
    for(let i = 0; i<n; i++){
        M[i] = j || 0;
    };
    return M;
}

let expand = function(A,b){
    let c = [];
    for(let i in A){
        c[i] = 0;
        for(let ii in A){
            c[i] = c[i] + A[i][ii]*b[ii];

        }
    }
    return c;
}



let Model = function(nodes, connections, forces, E, I ,A){


    E = E || 1;
    I = I || 1/12;
    A = A || 1;

    let localMatrixCollection = []
    let GlobalMatrix = zeros(nodes.length*3);

    for(let c of connections){
        let p1 = nodes[c[0]]
        let p2 = nodes[c[1]]
        length = Math.sqrt((p1[0]-p2[0])**2 + (p1[1]-p2[1])**2)
        let local_matrix = createLocalMatrix(E, I, A, length)
        localMatrixCollection.push(local_matrix);


        let T = createTransformationMatrix(p1,p2)
        let global_local_matrix = $.multiply($.multiply($.transpose(T),local_matrix), T)

        let n = 6  //move local matrix to global
        for(let i = 0; i<n; i++){
            for(let j = 0; j<n; j++){
                let row = c[0]*3+i;
                if(i>2) row = c[1]*3+i-3;

                let col = c[0]*3+j;
                if(j>2) col = c[1]*3+j-3;

                GlobalMatrix[row][col] = GlobalMatrix[row][col] + global_local_matrix[i][j]
            }
        };
    }


    let BC = zeros1D(nodes.length*3, false);
    let UNKNOWN = zeros1D(nodes.length*3, false);
    for(let force of forces){
        if(force[3] == 'Fixed X') UNKNOWN[3*force[0]] = true;
        if(force[3] == 'Fixed Y') UNKNOWN[3*force[0]+1] = true;
        if(force[3] == 'Force'){
            BC[3*force[0]] = force[1];
            BC[3*force[0]+1] = force[2];
        }
        if(force[3] == 'Moment') UNKNOWN[3*force[0]+2] = true;
    }
    
    let reduced = [];
    let reducedBC = [];


    for(let i in BC) if(!UNKNOWN[i]) reducedBC.push(BC[i])
    
    let p = 0; //reduce global matrix
    for(let k=0; k<nodes.length*3; k++){
        if(!UNKNOWN[k]){
            reduced[p] = [];
            for(let g=0; g<nodes.length*3; g++){
                if(!UNKNOWN[g]) reduced[p].push(GlobalMatrix[k][g]);
            }
            p++;
        }
    }

    let soln2 = solve.solve(reduced, reducedBC)

    let fullSoln = [];
    let pp = 0;
    for(let i in BC){
        if(!UNKNOWN[i]){ 
            fullSoln.push(soln2[pp])
            pp++;
        }else{
            fullSoln.push(0);
        }
    }


    let reactions =  $.multiply(GlobalMatrix, fullSoln)

 

    return {
        reactions,
        solution: fullSoln
    }

}

module.exports =Model;