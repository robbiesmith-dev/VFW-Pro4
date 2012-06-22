//Project 3
//VFW 1206
//Robert Smith

window.addEventListener("DOMContentLoaded", function() {

//get element shortcut
function $(x) {
	var theElement = document.getElementById(x);
	return theElement;
};

//Create select field element
function makeSelect(){
	var formTag = document.getElementsByTagName("form");
		selectLi = $('select');
		makeSelect = document.createElement("select");
		makeSelect.setAttribute("id", "selectGorI");
	for(var i=0, j=GorISelection.length; i<j; i++){
		var makeOption = document.createElement('option');
		var optText = GorISelection[i];
		makeOption.setAttribute("value", optText);
		makeOption.innerHTML = optText;
		makeSelect.appendChild(makeOption);
	}
	selectLi.appendChild(makeSelect);
};
var GorISelection = ["--Choose an Option--", "Group", "Individual"];
	makeSelect(); 

//toggle function
function toggleControls (n) {
		switch(n){
			case "on":
				$('assignmentForm').style.display = "none";
				$('clearData').style.display = "inline";
				$('disData').style.display = "inline";
				$('addNew').style.display = "block";
				break;
			case "off":
				$('assignmentForm').style.display = "block";
				$('clearData').style.display = "inline";
				$('disData').style.display = "inline";
				$('addNew').style.display = "none";
				$('items').style.display = "none";
				break;
			default:
				return false;
		}
};

//Radio Button Function
function getSelectedRadio(){
	var radios = document.forms[0].reminder;
	for(var i=0; i<radios.length; i++){
		if(radios[i].checked){
			reminderValue = radios[i].value;
		}
	}
};	

// store data function
function storeData(key){
	if(!key){
		var id = Math.floor(Math.random()*10000001);
	}else{
		id = key;
	}
	getSelectedRadio();
	//Gather up all form fields values and store in an object.
	//Object properties contain array with the form label and input value.
		var item 		= {};
		item.GorI 		= ["Group or Individual: ", $('selectGorI').value];
		item.clname 	= ["Class Name: ", $('clname').value];
		item.asname 	= ["Assignment Name: ", $('asname').value];
		item.dudate 	= ["Due Date: ", $('dudate').value];
		item.prior 		= ["Priority: ", $('prior').value];
		item.InsName 	= ["Instructor Name: ", $('InsName').value];
		item.email 		= ["Instructor E-mail: ", $('email').value];
		item.reminder 	= ["Set Reminders: ", reminderValue];
		item.notes		= ["Notes: ", $('notes').value];

	localStorage.setItem(id, JSON.stringify(item));
	alert("Assignment Added!");
};

//display data function
function getData(){
	toggleControls("on");
	if(localStorage.length === 0){
		alert("There is no data in Local Storage so example data was added.")
		autoFillData();
	}
	var makeDiv = document.createElement('div');	
	makeDiv.setAttribute("id", "items");
	var makeList = document.createElement('ul');
	makeDiv.appendChild(makeList);
	document.body.appendChild(makeDiv);
	$('items').style.display = "display";
	for(var i=0, len=localStorage.length; i<len; i++){
		var makeli = document.createElement('li');
		var linksLi = document.createElement('li');
		makeList.appendChild(makeli);
		var key = localStorage.key(i);
		var value = localStorage.getItem(key);
		var obj = JSON.parse(value);
		var makeSublist = document.createElement('ul');
		makeli.appendChild(makeSublist);
		getImage(obj.GorI[1], makeSublist);
		for(var n in obj){
			var makeSubli = document.createElement('li');
			makeSublist.appendChild(makeSubli);
			var optSubText = obj[n][0]+""+obj[n][1];
			makeSubli.innerHTML = optSubText;
			makeSublist.appendChild(linksLi);
		}
		makeItemLinks(localStorage.key(i), linksLi);
	}
};

function getImage(imgName, makeSublist){
	var imageLi = document.createElement('li');
	makeSublist.appendChild(imageLi);
	var newImage = document.createElement('img');
	var setSrc = newImage.setAttribute("src", "images/"+ imgName + ".png");
	imageLi.appendChild(newImage);
};

function autoFillData(){
	//json.js info
	for(var n in json){
		var id = Math.floor(Math.random()*10000001);
		localStorage.setItem(id, JSON.stringify(json[n]));
	}
}


//Create the edit and delete links for stored data when displayed
function makeItemLinks (key, linksLi) {
	//add edit single item link
	var editLink = document.createElement('a');
	editLink.href = "#";
	editLink.key = key;
	var editText = "Edit Assignment";
	editLink.addEventListener('click', editItem);
	editLink.innerHTML = editText;
	linksLi.appendChild(editLink);
	//add line break
	var breakTag = document.createElement('br');
	linksLi.appendChild(breakTag);
	//add delete single item link
	var deleteLink = document.createElement('a');
	deleteLink.href = '#';
	deleteLink.key = key;
	var deleteText = "Delete Assignment";
	deleteLink.addEventListener('click', deleteItem);
	deleteLink.innerHTML = deleteText;
	linksLi.appendChild(deleteLink);
};

//Edit Item Function
function editItem () {
	//Grab the data from our item from local storage
	var value =localStorage.getItem(this.key);
	var item = JSON.parse(value);
	//show the form
	toggleControls('off');
	//populate the form fields with current localStorage values.
	$('selectGorI').value = item.GorI[1];
	$('clname').value = item.clname[1];
	$('asname').value = item.asname[1];
	$('dudate').value = item.dudate[1];
	$('prior').value = item.prior[1];
	$('InsName').value = item.InsName[1];
	$('email').value = item.email[1];
	var radio = document.forms[0].reminder;
	for(var i=0; i<radio.length; i++){
		if(radio[i].value === 'Two Days Prior' && item.reminder[1] == "Two Days Prior"){
			radio[i].setAttribute("checked", "checked");
		}else if(radio[i].value === 'One Day Prior' && item.reminder[1] == "One Day Prior"){
			radio[i].setAttribute("checked","checked");
		}
	}
	$('notes').value = item.notes[1];

	//Remove the intial listener from the input 'save' button
	save.removeEventListener('click', storeData);
	//change submit button to edit button
	$('submit').value = "Edit Assignment";
	var editSubmit = $('submit');
	//SAve the key value established in this function as a property of the editSubmit event
	editSubmit.addEventListener('click', validate);
	editSubmit.key = this.key;
};

//Delete Item Function
function deleteItem(){
	var ask = confirm("Are you sure you want to delete this assignment?")
	if(ask){
		localStorage.removeItem(this.key);
		alert('Assignment Deleted!!!!')
		window.location.reload();
	}else{
		alert("Assignment Was Not Deleted")
	}
};

//clear data function
function clearLocal(){
	if(localStorage.length === 0){
		alert("There is no data to clear.")
	}else{
		localStorage.clear();
		alert("All assignments have been deleted!")
		window.location.reload();
		return false;
	}
};

//Validate Function
function validate(e){
	//define the elements we want to check
	var getAsName = $('asname');
	var getClName = $('clname');
	var getDuDate = $('dudate');

	//Reset Error Messages
	errMsg.innerHTML = "";
	getAsName.style.border = '1px solid black';
	getClName.style.border = '1px solid black';
	getDuDate.style.border = '1px solid black';

	//Get Error Message
	var messageAry = [];
	if(getAsName.value === ""){
		var AsNameError = "Please enter an assignment name";
		getAsName.style.border = '1px solid red';
		messageAry.push(AsNameError);
	}
	if(getClName.value === ""){
		var ClNameError = "Please enter a class name.";
		getClName.style.border = '1px solid red';
		messageAry.push(ClNameError);
	}
	if(getDuDate.value === ""){
		var duDateError = "Please select a date";
		getDuDate.style.border = '1px solid red';
		messageAry.push(duDateError);
	}

	//if errors...display on screen
	if (messageAry.length >= 1){
		for(var i=0; i < messageAry.length; i++){
			var txt = document.createElement('li');
			txt.innerHTML = messageAry[i];
			errMsg.appendChild(txt);
		}
		e.preventDefault();
		return false;
	}else{
		storeData(this.key);
	}
	
};

// varibles
var errMsg = $('errors')
var reminderValue;
var displayLink = $('disData');
displayLink.addEventListener("click", getData);
var clearLink = $('clearData');
clearLink.addEventListener("click", clearLocal)
var save = $("submit");
save.addEventListener("click", validate);

});
