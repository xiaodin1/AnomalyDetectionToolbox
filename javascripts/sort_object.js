/*
function sort_object(name,target_html,type,test_index){
	this.name = name;
	this.target_html = target_html;
	this.type = type;
	this.test_index = test_index;
}

function create_list(target_array){
	var ul = document.createElement("ul");
	for(target_array_index in target_array){
		var each_target_data = target_array[target_array_index];
		var each_target_li = document.createElement("li");
		var each_target_a = document.createElement("a");
		each_target_a.setAttribute("href","javascript:void(0);");
		each_target_a.setAttribute("onclick","changeDoc('" + each_target_data.target_html + "',null,'benchmark_page');");
		each_target_a.innerHTML = each_target_data.name;
		
		each_target_li.appendChild(each_target_a);
		ul.appendChild(each_target_li);
	}
	return ul;
}

function change_list(select_sort_obj){
	var select_value = '';
	if(select_sort_obj){
		select_value = select_sort_obj.options[select_sort_obj.selectedIndex].value;
	}
	var show_list = document.getElementById("benchmark_list");
	// remove all child node
	var fc = show_list.firstChild;
	while( fc ) {
		show_list.removeChild( fc );
		fc = show_list.firstChild;
	}
	
	if( select_value == 'type' || select_value == ''){
		// create time data list
		var time_li = document.createElement("li");
		time_li.setAttribute("type","circle");
		time_li.innerHTML = "Time Series Data";
		time_li.appendChild(create_list(time_array));
		
		// create vector data list
		var vector_li = document.createElement("li");
		vector_li.setAttribute("type","circle");
		vector_li.innerHTML = "Vector Data";
		vector_li.appendChild(create_list(vector_array));
		
		show_list.appendChild(time_li);
		show_list.appendChild(vector_li);
	}else if( select_value == 'test_index' ){
		// create test_index list
		var test_li = document.createElement("li");
		test_li.setAttribute("type","circle");
		test_li.innerHTML = "test_index";
		test_li.appendChild(create_list(test_index_array));
		
		show_list.appendChild(test_li);
	}
}

var object_array = new Array();
var time_array = new Array();
var vector_array = new Array();
var test_index_array = new Array();
function sort_init(){
	object_array[0] = new sort_object('Climate','Benchmark/Climate.html','Time Series Data',542);
	object_array[1] = new sort_object('ECG','Benchmark/ECG.html','Time Series Data',11);
	object_array[2] = new sort_object('NASA Shuttle Valve Data','Benchmark/NASA_Shuttle_Valve_Data.html','Time Series Data',12);
	object_array[3] = new sort_object('Pfam','Benchmark/Pfam.html','Time Series Data',28315);
	object_array[4] = new sort_object('Synthetic Wave','Benchmark/Synthetic_Wave.html','Time Series Data',60);
	object_array[5] = new sort_object('WSU CASAS','Benchmark/WSU_CASAS.html','Time Series Data',40);
	object_array[6] = new sort_object('Adult','Benchmark/Adult.html','Vector Data',8625);
	object_array[7] = new sort_object('Balance Scale','Benchmark/Balance_Scale.html','Vector Data',302);
	object_array[8] = new sort_object('Blood Donation','Benchmark/BloodDonation.html','Vector Data',604);
	object_array[9] = new sort_object('Iris','Benchmark/iris.html','Vector Data',53);
	object_array[10] = new sort_object('Point Anomaly Synthetic','Benchmark/Synthetic.html','Vector Data',2010);
	object_array[11] = new sort_object('Wine Classifier','Benchmark/Wine_Classifier.html','Vector Data',75);
	object_array[12] = new sort_object('Wine Quality','Benchmark/Wine_Quality.html','Vector Data',2204);
	for(obj_index in object_array){
		if(object_array[obj_index].type == 'Time Series Data'){
			time_array[time_array.length] = object_array[obj_index];
		}
		if(object_array[obj_index].type == 'Vector Data'){
			vector_array[vector_array.length] = object_array[obj_index];
		}
	}
	for(obj_index in object_array){
		test_index_array[object_array[obj_index].test_index] = object_array[obj_index];
	}
}
sort_init();
*/
var type_array = [false,false];
var sort_array = [false];

function change_status(target_array,target_index){
	if(target_array == "type"){
		type_array[target_index] = !type_array[target_index];
	}
	if(target_array == "sort"){
		sort_array[target_index] = !sort_array[target_index];
	}
	getBenchmarkJSON("POST","http://anomalydetectiontoolbox.appspot.com/action/benchmark");
	check_color();
	document.getElementById("benchmark_page").innerHTML = "";
}

function check_color(){
	var type0 = document.getElementById("type0");
	var type1 = document.getElementById("type1");
	var sort0 = document.getElementById("sort0");
	type0.className = "uncheck-color";
	type1.className = "uncheck-color";
	sort0.className = "uncheck-color";
	if(type_array[0]){
		type0.className = "check-color";
	}
	if(type_array[1]){
		type1.className = "check-color";
	}
	if(sort_array[0]){
		sort0.className = "check-color";
	}
}

function change_list(target_array){
	var show_list = document.getElementById("benchmark_list");
	// remove all child node
	var fc = show_list.firstChild;
	while( fc ) {
		show_list.removeChild( fc );
		fc = show_list.firstChild;
	}
	
	var ul = document.createElement("ul");
	for(target_array_index in target_array){
		var each_target_data = target_array[target_array_index];
		var each_target_li = document.createElement("li");
		var each_target_a = document.createElement("a");
		each_target_a.setAttribute("href","javascript:void(0);");
		each_target_a.setAttribute("onclick","changeDoc('" + each_target_data.benchmark_html + "',null,'benchmark_page');");
		each_target_a.innerHTML = each_target_data.benchmark_name;
		
		each_target_li.appendChild(each_target_a);
		ul.appendChild(each_target_li);
	}
	
	show_list.appendChild(ul);
}

// Create the XHR object.
function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {
    // XHR for Chrome/Firefox/Opera/Safari.
    xhr.open(method, url, true);
  } else if (typeof XDomainRequest != "undefined") {
    // XDomainRequest for IE.
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    // CORS not supported.
    xhr = null;
  }
  return xhr;
}
function getBenchmarkJSON(method,page_name){
	// All HTML5 Rocks properties support CORS.
	var xhr = createCORSRequest(method, page_name);
	if (!xhr) {
		alert('CORS not supported');
		return;
	}
	// Response handlers.
	xhr.onload = function() {
		var jsonObj = JSON.parse(xhr.responseText);
		change_list(jsonObj);
	};
	xhr.onerror = function() {
		//alert('Woops, there was an error making the request.');
	};
	xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xhr.withCredentials = true;
	var parameter = "action=benchmarkJSON";
	var type_array_str = "";
	for(type_array_index in type_array){
		if(type_array[type_array_index]){
			if(type_array_str == ""){
				type_array_str += "type_condition=" + type_array_index;
			}else{
				type_array_str += "," + type_array_index;
			}
		}
	}
	var sort_array_str = "";
	for(sort_array_index in sort_array){
		if(sort_array[sort_array_index]){
			if(sort_array_str == ""){
				sort_array_str += "sort_condition=" + sort_array_index;
			}else{
				sort_array_str += "," + sort_array_index;
			}
		}
	}
	if(type_array_str != ""){
		parameter += "&" + type_array_str;
	}
	if(sort_array_str != ""){
		parameter += "&" + sort_array_str;
	}
	xhr.send(parameter);
}

function benchmark_init(){
	getBenchmarkJSON("POST","http://anomalydetectiontoolbox.appspot.com/action/benchmark");
	check_color();
}