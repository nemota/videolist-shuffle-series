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
var $list=document.getElementById("list");
var $list_wrap=document.getElementById("list-wrap");

//output周辺
var $output_listforshuffle=document.getElementById("output-listforshuffle");
var $output_listforshuffle_btn=document.getElementById("output-listforshuffle-btn");
var $output_notshuffle_btn=document.getElementById("output-notshuffle-btn");
var $output_shuffle_btn=document.getElementById("output-shuffle-btn");
var $output_shuffledlist=document.getElementById("output-shuffledlist");

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
	if(!inputArray[0])return;
	//改行とか削除
	for(var i=0;i<inputArray.length;i++){
		inputArray[i]=inputArray[i].trim();
	}
	if(seriesTitle==""){//シリーズ名が空なら単品群と認識
		for(var i=0;i<inputArray.length;i++){
			currentList.push(inputArray[i]);
		}
	}else if(seriesTitle=="ikikaereikikaere..."){//特定のシリーズ名ならシャッフル用リストの入力と判断
		if(!confirm("現在のリストすべてを上書きします。よろしいですか？"))return;
		try{
			currentList=JSON.parse($input_list.value);
		}catch{
			alert("不正な形式です。");
		}
		//シリーズ数を取得
		for (var i=0;i<currentList.length;i++) {
			if(typeof currentList[i]=="object"){
				seriesCount=i+1;
			}
		}
		showList();
		
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
		seriesTitle="";
		inputArray=[];
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
	//list-wrapをリセット
	$list.removeChild($list_wrap);
	$list_wrap=document.createElement("ul");
	$list_wrap.id="list-wrap";
	$list.appendChild($list_wrap);
	
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
	var list_series_openbutton;
	var list_series_editbutton;
	for(var i=0;i<seriesCount;i++){
		//シリーズ全体の包含要素をテンプレをコピーして作成
		list_series_tmp=seriesElementTemprate.cloneNode(true);
		list_series_tmp.id="series"+i;
		
		//DOM要素を取得し、表示する文字を設定
		list_series_title=list_series_tmp.getElementsByClassName("list-series-title")[0];
		list_series_elements=list_series_tmp.getElementsByClassName("list-series-elements")[0];
		list_series_openbutton=list_series_tmp.getElementsByClassName("list-series-openbutton")[0];
		list_series_editbutton=list_series_tmp.getElementsByClassName("list-series-editbutton")[0];
		list_series_title.textContent=currentList[i][0]+"("+(currentList[i].length-1)+"本)";
		
		//ボタンにイベントをつける
		list_series_openbutton.onclick=onOpenButtonClicked;
		list_series_editbutton.onclick=onEditButtonClicked;
		
		//シリーズごとのリスト構築
		for(var j=1;j<currentList[i].length;j++){
			var list_series_element=document.createElement("li");
			var videoLink=document.createElement("a");
			videoLink.href=currentList[i][j];
			videoLink.innerText=currentList[i][j];
			list_series_element.appendChild(videoLink);
			list_series_elements.appendChild(list_series_element);
		}
		
		//ページに追加
		$list_wrap.appendChild(list_series_tmp);
	}
	
	//単品の操作 上とほぼ同じことやってるから関数でまとめられたらいいかも
	list_series_tmp=seriesElementTemprate.cloneNode(true);
	list_series_tmp.id="series"+(seriesCount);
	list_series_title=list_series_tmp.getElementsByClassName("list-series-title")[0];
	list_series_elements=list_series_tmp.getElementsByClassName("list-series-elements")[0];
	list_series_openbutton=list_series_tmp.getElementsByClassName("list-series-openbutton")[0];
	list_series_editbutton=list_series_tmp.getElementsByClassName("list-series-editbutton")[0];
	list_series_title.textContent="単品群("+(currentList.length-seriesCount)+"本)";
	list_series_openbutton.onclick=onOpenButtonClicked;
	list_series_editbutton.onclick=onEditButtonClicked;
	for(var i=seriesCount;i<currentList.length;i++){
		var list_series_element=document.createElement("li");
		var videoLink=document.createElement("a");
		videoLink.href=currentList[i];
		videoLink.innerText=currentList[i];
		list_series_element.appendChild(videoLink);
		list_series_elements.appendChild(list_series_element);
	}
	$list_wrap.appendChild(list_series_tmp);
}

//展開ボタンが押されたときのやつ
//イベントはshowList()であててる　文字を変えるとかできたらいいね
function onOpenButtonClicked() {
	var series_elements=this.parentElement.parentElement.parentElement.getElementsByClassName("list-series-elements")[0];
	if(series_elements.style.display=="block"){
		series_elements.style.display="none";
	}else{
		series_elements.style.display="block";
	}
}

//編集ボタンが押されたときのやつ
//イベントはshowList()であててる
function onEditButtonClicked(e) {
	if($input_seriestitle.value!=""||$input_list.value!=""){
		if(!confirm("入力フィールドが上書きされます。よろしいですか？"))return;
	}
	var index=+e.target.parentElement.parentElement.parentElement.id.substring(6);
	var editTitle;//編集画面でのシリーズ名
	var editList="";//編集画面のテキストエリアに出す文字列
	if(index<seriesCount){//シリーズなら
		editTitle=currentList[index][0];
		//リストの文字列を構築
		for(var i=1;i<currentList[index].length;i++){
			editList+=currentList[index][i];
			if(i<currentList[index].length-1){
				editList+=",\n";
			}
		}
		//currentlistから消す
		currentList.splice(index,1);
		seriesCount--;
	}else{//単品なら
		editTitle="";
		//リストの文字列を構築
		for(var i=seriesCount;i<currentList.length;i++){
			editList+=currentList[i];
			if(i<currentList.length-1){
				editList+=",\n";
			}
		}
		currentList.splice(seriesCount,currentList.length-seriesCount);
	}
	//表示リストを更新
	showList();
	//テキストエリアにセット
	$input_seriestitle.value=editTitle;
	$input_list.value=editList;
}

/*output周辺*/

//次回使う配列を出力
function outputListForShuffle() {
	$output_listforshuffle.value=JSON.stringify(currentList);
}
$output_listforshuffle_btn.onclick=outputListForShuffle;

//outputListを展開してカンマで区切って出力(Cytube想定)
//改行があるとcytubeがうまく読み取ってくれないので入っていない
function outputListForCytube() {
	var outputText="";
	for(var i=0;i<outputList.length;i++){
		if(typeof outputList[i]=="string"){
			outputText+=outputList[i]+",";
		}else{
			for(var j=1;j<outputList[i].length;j++){
				outputText+=outputList[i][j]+",";
			}
		}
	}
	//最後のカンマを取る
	outputText=outputText.substring(0,outputText.length-1);
	//テキストエリアに表示
	$output_shuffledlist.value=outputText;
}

//リストをシャッフルしてテキストエリアに出力
function makeListShuffled() {
	outputList=[].concat(currentList);
	var swaptmp;
	//Fisher-Yates shuffleでシャッフル
	for (var i=outputList.length-1;i>0;i--) {
		var j=Math.floor(Math.random()*(i+1));
		swaptmp=outputList[i];
		outputList[i]=outputList[j];
		outputList[j]=swaptmp;
	}
	outputListForCytube();
}
$output_shuffle_btn.onclick=makeListShuffled;

//シャッフル前の状態で出力
function makeListUnshuffled() {
	outputList=[].concat(currentList);
	outputListForCytube();
}
$output_notshuffle_btn.onclick=makeListUnshuffled;