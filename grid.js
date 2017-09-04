var grid = {"items":[]}, total, xy, max = 20;

function validateGrid(){

	if (total <= 3){
		console.log('Total too small to make a nice grid...');
	};
	
	for (var i=max; i>0; i--){
		if (total%i==0 && i*i==total){
			xy=i;
			console.log('grid will be: '+xy+'x'+ xy);
			return xy;
		}
		else{
			console.log(i + ' is not a good divider, trying again...');
			if (i==1){
				console.log('Grid too big, reverting to oldest working grid...');
			}
		}
	}
}

function fillGrid(amount){

	if (grid && grid.items.length>0){
		grid = {"items":[]};
	}
	
	for (i=1; i<=amount; i++){
		grid.items[i-1] = {"index":i};
	}
	total = grid.items.length;
}

function makeGrid(){
	
	if (document.getElementById("app").children.length > 0){
		var table = document.getElementById("myTable");
		document.getElementById("app").removeChild(table);
	}
	
	var myTable = document.createElement("div");
	myTable.setAttribute("id", "myTable");
	var continueVar = 1;

	for (var i = 1; i<=xy; i++){
	
		var row = document.createElement("div");
		row.setAttribute("class", "row");
		row.setAttribute("rowIndex", i);
		myTable.appendChild(row);
				
		for (var j = continueVar;j<=total; j++){

				var col = document.createElement("div");
				var b = document.createElement("button");
				col.setAttribute("class", "col");
				col.setAttribute("index", j);
				b.setAttribute('style', 'background-color:'+getAColor());
				col.appendChild(b);
				row.appendChild(col);

				if (j%xy==0){
				continueVar=j+1;
				break;
				}
		}
		myTable.appendChild(row);
	}
	document.getElementById("app").appendChild(myTable);
};

function calcNeigbours(){
	
	var neighbours="";
	
	function isItemSideLeft(item){
		return (item == 1 || item%xy==1);
	}
	function isItemSideRight(item){
		return (item%xy==0);
	}
	function isItemTop(item){
		return (item<=xy);
	}
	function isItemBottom(item){
		return (item>(total-xy));
	}
	
	for (var i=1; i<=total; i++){
		var item = grid.items[i-1].index;
		neighbours={};

		if (isItemTop(item) ){
		
				if (isItemSideRight(item)){
					neighbours[(item-1)] = {"type":"left"};
					neighbours[(item+xy-1)] = {"type":"bottomLeft"};
					neighbours[(item+xy)] = {"type":"bottomCenter"};

				} 
				else if (isItemSideLeft(item)){
					neighbours[(item+1)] = {"type":"right"};
					neighbours[(item+xy)] = {"type":"bottomCenter"};
					neighbours[(item+xy+1)] = {"type":"bottomRight"};
				}
				else {
					neighbours[(item-1)] = {"type":"left"};
					neighbours[(item+1)] = {"type":"right"};
					neighbours[(item+xy-1)] = {"type":"bottomLeft"};
					neighbours[(item+xy)] = {"type":"bottomCenter"};
					neighbours[(item+xy+1)] = {"type":"bottomRight"};
				}
			}
		
		else if (isItemBottom(item) ){
		
				if (isItemSideRight(item)){
					neighbours[(item-xy-1)] = {"type":"topLeft"};
					neighbours[(item-xy)] = {"type":"topCenter"};
					neighbours[(item-1)] = {"type":"left"};
					} 
				else if (isItemSideLeft(item)){
				    neighbours[(item-xy)] = {"type":"topCenter"};
					neighbours[(item-xy+1)] = {"type":"topRight"};
					neighbours[(item+1)] = {"type":"right"};
					}
				else{
					neighbours[(item-xy-1)] = {"type":"topLeft"};
					neighbours[(item-xy)] = {"type":"topCenter"};
					neighbours[(item-xy+1)] = {"type":"topRight"};
					neighbours[(item-1)] = {"type":"left"};
					neighbours[(item+1)] = {"type":"right"};
				}
			}		
			
		else if (isItemSideLeft(item)&&!isItemTop(item)&&!isItemBottom(item)){
				neighbours[(item-xy)] = {"type":"topCenter"};
				neighbours[(item-xy+1)] = {"type":"topRight"};
				neighbours[(item+1)] = {"type":"right"};
				neighbours[(item+xy)] = {"type":"bottomCenter"};
				neighbours[(item+xy+1)] = {"type":"bottomRight"};
		}
		
		else if (isItemSideRight(item)&&!isItemTop(item)&&!isItemBottom(item)){
				neighbours[(item-xy-1)] = {"type":"topLeft"};
				neighbours[(item-xy)] = {"type":"topCenter"};
				neighbours[(item-1)] = {"type":"left"};
				neighbours[(item+xy-1)] = {"type":"bottomLeft"};
				neighbours[(item+xy)] = {"type":"bottomCenter"};
				
		}
		
		else{
			neighbours[(item-xy-1)] = {"type":"topLeft"};
			neighbours[(item-xy)] = {"type":"topCenter"};
			neighbours[(item-xy+1)] = {"type":"topRight"};
			neighbours[(item-1)] = {"type":"left"};
			neighbours[(item+1)] = {"type":"right"};
			neighbours[(item+xy-1)] = {"type":"bottomLeft"};
			neighbours[(item+xy)] = {"type":"bottomCenter"};
			neighbours[(item+xy+1)] = {"type":"bottomRight"};
		}

		//add items to specific neighbours
		grid.items[i-1].neighbours=neighbours;
	}
};

function initButtonRipples(){

var buttons = document.getElementsByTagName('button');

Array.prototype.forEach.call(buttons, function (b) {
	b.addEventListener('click', createRipple);
	});

	function createRipple (e) {
	
		var index = this.parentElement.getAttribute("index"),
		    c = document.getElementsByClassName('neighbour').length,
		    cb = document.querySelectorAll('[class="clickedButton"]').length,
			d = Math.max(this.clientWidth, this.clientHeight),
			buttonNeighbours = grid.items[index-1].neighbours;
		
		for (var i=0; i<c; i++){
			var toDelete = document.getElementsByClassName('neighbour')[0];
                        toDelete.parentElement.removeChild(toDelete);
		}
		
		for (var j=0; j<cb; j++){
			document.querySelectorAll('[class="clickedButton"]')[j].classList.remove("clickedButton");
		}
		
		void this.offsetWidth;
		document.querySelector('[index="'+index+'"] button').classList.add('clickedButton');

		Array.prototype.forEach.call(Object.keys(buttonNeighbours), function (b) {
				
				var animation = document.createElement('div'), 
					left,
					top;
					
				document.querySelector('[index="'+b+'"] button').appendChild(animation);
				
				switch(buttonNeighbours[b].type){
				
					case("topLeft") :      left = d/2; top = d/2;   break;
					case("topCenter") :    left = 0; top = d/2;     break;
					case("topRight") :     left = -d/2; top = d/2;  break;
					case("left") : 	       left = d/2; top = 0;     break;
					case("right") :        left = -d/2; top = 0;    break;
					case("bottomLeft") :   left = d/2; top = -d/2;  break;
					case("bottomCenter") : left = 0; top = -d/2;    break;
					case("bottomRight") :  left = -d/2; top = -d/2; break;
					
					default: console.log('Unknown position for: '+b);
					
					}
				
				var styleList="width:"+d+"px; height:"+d+"px; left:"+left+"px; top:"+top+"px";
				animation.setAttribute("style", styleList);
				animation.classList.add('neighbour');
				document.querySelector('[index="'+b+'"] button').setAttribute('style', 'background-color:'+getAColor());
		
		});
		}	
	}
	
function getAColor(){
	return "#" + ("000000" + Math.random().toString(16).slice(2, 8).toUpperCase()).slice(-6);
}

function paint(){

		var newAmount, 
		    sliderVal = document.getElementById("slider").value, 
		    selection = document.querySelector("[name=xy1]");	
			
		selection.value = sliderVal;
		fillGrid(sliderVal*sliderVal);
		validateGrid();
		makeGrid();
		calcNeigbours();
		initButtonRipples();
}

//start
var readyStateCheckInterval = setInterval(function() {
    if (document.readyState === "complete") {
        clearInterval(readyStateCheckInterval);
		document.getElementById("slider").value = 4;
		paint();
    }
}, 10);
