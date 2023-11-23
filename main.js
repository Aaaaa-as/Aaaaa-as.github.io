var canvas = document.querySelector("canvas")
var ctx = canvas.getContext("2d")
function lerp(start, end, t) {
    return start * (1 - t) + end * t;
}


var atmosArray=[[0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,-1,-1,-1,0,0,0],
                [0,0,0,0,-1,93,-1,0,0,0],
                [0,0,0,0,-1,-1,-1,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0]]


var atmosArrayAdv=[[{},{},{},{},{},{},{},{},{},{}],
                   [{},{},{},{},{},{},{},{},{},{}],
                   [{},{},{},{},{},{},{},{},{},{}],
                   [{},{},{},{},{},{},{},{},{},{}],
                   [{},{},{},{},{},{},{},{},{},{}],
                   [{},{},{},{},{},{},{},{},{},{}],
                   [{},{},{},{},{},{},{},{},{},{}],
                   [{},{},{},{},{},{},{},{},{},{}],
                   [{},{},{},{},{},{},{},{},{},{}],
                   [{},{},{},{},{},{},{},{},{},{}]]
for (let y = 0; y < atmosArrayAdv.length; y++) {
    for (let x = 0; x < atmosArrayAdv[y].length; x++) {
        if(x-1<0){
            var left=-2
        }else{
            var left=atmosArray[y][x-1]
        }
        if(x+1>=atmosArrayAdv[y].length){
            var right=-2
        }else{
            var right=atmosArray[y][x+1]
        }
        if(y-1<0){
            var up=-2
        }else{
            var up=atmosArray[y-1][x]
        }
        if(y+1>=atmosArrayAdv.length){
            var down=-2
        }else{
            var down=atmosArray[y+1][x]
        }
        atmosArrayAdv[y][x]={center:atmosArray[y][x],left,right,up,down}
    }
    
    
}
function drawVals(){
    var withPressure=[]
    for (let y = 0; y < atmosArrayAdv.length; y++) {
        for (let x = 0; x < atmosArrayAdv[y].length; x++) {
            if(atmosArrayAdv[y][x].center!=-1){
                if (atmosArrayAdv[y][x].center>=0) {
                    withPressure.push(atmosArray[y][x])
                }
            }
        }
    }
    var max=Math.round(Math.max(...withPressure)*1000)/ 1000
    var min=Math.round(Math.min(...withPressure)*1000)/ 1000
    c=max-min
    ctx.fillStyle="#000000"
    ctx.fillRect(0,0,640,640)
    
    for (let y = 0; y < atmosArray.length; y++) {
        for (let x = 0; x < atmosArray[y].length; x++) {
            var px=x*64
            var py=y*64
            
            if (atmosArray[y][x]==-1) {
                ctx.fillStyle="#000000"
            }else{
                var r ="hsl("
                c1=(atmosArray[y][x] - min) / (max - min)
                if (min==max) {
                    c1=0.5
                }
                
                [1,2,3]
                r+=lerp(240,0,c1)+",100%,50%"
                r+=")"
                ctx.fillStyle=r
            }
            
            ctx.fillRect(px,py,64,64)
            ctx.fillStyle="#000000"
            ctx.fillText(Math.round(atmosArray[y][x]*100)/ 100,x*64+10,y*64+16)
            
        }
        
    }
}

function openPressure(x,y){
    if (atmosArray[y][x]==-1) {
        setPressure(x,y,0)
    }
}
function closePressure(x,y){
    if (atmosArray[y][x]==0) {
        setPressure(x,y,-1)
    }
    if (atmosArray[y][x]>0) {
        var c=0
        var [u,d,l,r]=[false,false,false,false]
        if(!(atmosArrayAdv[y][x].up < 0)){
            u=true
            c++
        }
        if(!(atmosArrayAdv[y][x].down < 0)){
            d=true
            c++
        }
        if(!(atmosArrayAdv[y][x].left < 0)){
            l=true
            c++
        }
        if(!(atmosArrayAdv[y][x].right < 0)){
            r=true
            c++
        }
        finalVal=atmosArray[y][x]/c
        if(u){
            addPressure(x,y-1,finalVal)
            drawVals()
        }
        if(d){
            addPressure(x,y+1,finalVal)
            drawVals()
        }
        if(l){
            addPressure(x-1,y,finalVal)
            drawVals()
        }
        if(r){
            addPressure(x+1,y,finalVal)
            drawVals()
        }
        setPressure(x,y,-1)
        drawVals()
    }
}
function setPressure(x,y,val){
    atmosArrayAdv[y][x].center=val
    atmosArray[y][x]=val
    if(atmosArrayAdv[y][x].up!=-2){
        atmosArrayAdv[y-1][x].down=val
    }
    if(atmosArrayAdv[y][x].down!=-2){
        atmosArrayAdv[y+1][x].up=val
    }
    if(atmosArrayAdv[y][x].left!=-2){
        atmosArrayAdv[y][x-1].right=val
    }
    if(atmosArrayAdv[y][x].right!=-2){
        atmosArrayAdv[y][x+1].left=val
    }
}
function addPressure(x,y,val){
    atmosArrayAdv[y][x].center+=val
    atmosArray[y][x]+=val
    if(atmosArrayAdv[y][x].up!=-2){
        atmosArrayAdv[y-1][x].down+=val
    }
    if(atmosArrayAdv[y][x].down!=-2){
        atmosArrayAdv[y+1][x].up+=val
    }
    if(atmosArrayAdv[y][x].left!=-2){
        atmosArrayAdv[y][x-1].right+=val
    }
    if(atmosArrayAdv[y][x].right!=-2){
        atmosArrayAdv[y][x+1].left+=val
    }
}
function step(){
    var withPressure=[]
    for (let y = 0; y < atmosArrayAdv.length; y++) {
        for (let x = 0; x < atmosArrayAdv[y].length; x++) {
            if(atmosArrayAdv[y][x].center!=-1){
                if (atmosArrayAdv[y][x].center>0) {
                    withPressure.push([y,x])
                }
            }
        }
    }
    for (let i = 0; i < withPressure.length; i++) {
        var el = withPressure[i]
        var y=el[0]
        var x=el[1]
        var sum=0
        var c=1
        sum+=atmosArrayAdv[y][x].center
        if(!(atmosArrayAdv[y][x].up < 0)){
            sum+=atmosArrayAdv[y][x].up
            c++
        }
        if(!(atmosArrayAdv[y][x].down < 0)){
            sum+=atmosArrayAdv[y][x].down
            c++
        }
        if(!(atmosArrayAdv[y][x].left < 0)){
            sum+=atmosArrayAdv[y][x].left
            c++
        }
        if(!(atmosArrayAdv[y][x].right < 0)){
            sum+=atmosArrayAdv[y][x].right
            c++
        }
        var finalVal=sum/c
        setPressure(x,y,finalVal)
        drawVals()
        if(!(atmosArrayAdv[y][x].up < 0)){
            setPressure(x,y-1,finalVal)
            drawVals()
        }
        if(!(atmosArrayAdv[y][x].down < 0)){
            setPressure(x,y+1,finalVal)
            drawVals()
        }
        if(!(atmosArrayAdv[y][x].left < 0)){
            setPressure(x-1,y,finalVal)
            drawVals()
        }
        if(!(atmosArrayAdv[y][x].right < 0)){
            setPressure(x+1,y,finalVal)
            drawVals()
        }
    }
}

setInterval(() => {
    drawVals()
}, 1000/30);
setInterval(() => {
    step()
}, 1000/30);
