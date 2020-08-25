//
//変数宣言
//

/*使うDOM要素を取得*/

//input周辺
var $input_seriestitle=document.getElementById("input-seriestitle");
var $input_list=document.getElementById("input-list");
var $input_add_btn=document.getElementById("input-add-btn");
var $input_clear_btn=document.getElementById("input-clear-btn");

//list周辺
var $list_wrap=document.getElementById("list-wrap");

//output周辺
var output_listforshuffle=document.getElementById("output-listforshuffle");
var output_notshuffle_btn=document.getElementById("output-notshuffle-btn");
var output_shuffle_btn=document.getElementById("output-shuffle-btn");
var output_shuffledlist=document.getElementById("output-shuffledlist");

/*その他のグローバル変数*/

//リスト
var currentList=[];
var outputList=[];
var seriesCount=0;//現在入っているシリーズ数

//
//イベント
//

/*input周辺*/

//inputのクリアボタン
function clearInputList() {
	if(confirm("入力フィールドをクリアしてよろしいですか?")){
		$input_seriestitle.value="";
		$input_list.value="";
	}
}
$input_clear_btn.onclick=clearInputList;

//シリーズを配列currentListに追加
function addInputList() {
	var seriesTitle=$input_seriestitle.value;
	var inputArray=$input_list.value.split(",");
	//改行とか削除
	for(var i=0;i<inputArray.length;i++){
		inputArray[i]=inputArray[i].trim();
	}
	//シリーズ名が空なら単品群と認識
	if(seriesTitle==""){
		for(var i=0;i<inputArray.length;i++){
			currentList.push(inputArray[i]);
		}
	}else{
		var seriesToAddArray=[seriesTitle];
		seriesToAddArray=seriesToAddArray.concat(inputArray);
		var tmpArray=[];
		for(var i=0;i<seriesCount;i++){
			tmpArray.push(currentList[i]);
		}
		tmpArray.push(seriesToAddArray);
		for(var i=seriesCount;i<currentList.length;i++){
			tmpArray.push(currentList[i]);
		}
		currentList=tmpArray;
		seriesCount++;
	}
	//outputListにコピー
	outputList=[].concat(currentList);
	$input_seriestitle.value="";
	$input_list.value="";
	
	showList();
}
$input_add_btn.onclick=addInputList;

/*list周辺*/

//currentListを元にリストを表示
function showList() {
	var seriesElementTemprate=document.createElement("li");
	seriesElementTemprate.classList.add("list-series");
	seriesElementTemprate.innerHTML=
	'<div class="list-series-main">'+
	'	<div class="list-series-title">'+
	'	</div>'+
	'	<div class="list-series-buttonwrap">'+
	'		<button class="list-series-openbutton">展開</button>'+
	'		<button class="list-series-editbutton">編集</button>'+
	'	</div>'+
	'	<div class="float-clear"></div>'+
	'</div>'+
	'<ul class="list-series-elements">'+
	'</ul>';
	var list_series_tmp;
	var list_series_title;
	var list_series_elements;
	for(var i=0;i<seriesCount;i++){
		list_series_tmp=seriesElementTemprate.cloneNode(true);
		console.dirxml(list_series_tmp);
		//IDのセットもあとでする
		list_series_title=list_series_tmp.getElementsByClassName("list-series-title")[0];
		list_series_elements=list_series_tmp.getElementsByClassName("list-series-elements")[0];
		list_series_title.textContent=currentList[i][0];
		//シリーズごとのリスト構築
		for(var j=1;j<currentList[i].length;j++){
			var list_series_element=document.createElement("li");
			var videoLink=document.createElement("a");
			videoLink.href=currentList[i][j];
			videoLink.innerText=currentList[i][j];
			list_series_element.appendChild(videoLink);
			list_series_elements.appendChild(list_series_element);
		}
		$list_wrap.appendChild(list_series_tmp);
	}
	
}