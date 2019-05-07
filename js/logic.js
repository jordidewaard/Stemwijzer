var intro = document.getElementById('intro');
var statements = document.getElementById('statements');
var chooseStatements = document.getElementById('chooseStatements');
var chooseParties = document.getElementById('chooseParties');
var score = document.getElementById('score');
var back_btn = document.getElementById('back-btn');
var statement_title = document.getElementById('statement-title');
var statement = document.getElementById('statement');
var statement_ul = document.getElementById('statements-ul');
var parties_ul = document.getElementById('parties-ul');
var statement_count = 0;
var opinions = [];
var results = [];
var points = 0;

function loadIntro(){
	statements.style.display = 'none';
	back_btn.style.display = 'none';
	score.style.display = 'none';
	intro.style.display = 'block';
	chooseStatements.style.display = 'none';
	chooseParties.style.display = 'none';
}

function showSelectedOpinions(){
	var btn = document.getElementsByClassName('btn');
	for (var i = 0; i < btn.length; i++) {
        btn[i].style.backgroundColor = "black";
    }	

	if(opinions[statement_count] != null && opinions[statement_count] != ''){
		var btn = document.getElementById(opinions[statement_count]);
		btn.style.backgroundColor = '#01B4DC';
	}
}

function loadStatements() {
	chooseStatements.style.display = 'none';
	chooseParties.style.display = 'none';
	score.style.display = 'none';
	intro.style.display = 'none';
	back_btn.style.display = 'block';
	statements.style.display = 'block';
	statement_title.innerHTML = statement_count + 1 + '.' + subjects[statement_count].title;
	statement.innerHTML = subjects[statement_count].statement;	

	showSelectedOpinions();	
}

function setChoice(opinion){
	opinions[statement_count] = opinion;
	if(statement_count != 11){
		statement_count += 1; 
		loadStatements();
	}else{
		statement_count += 1;
		loadChooseStatements();
	}		
}

function back(){
	if(statement_count == 0){
		loadIntro();
	}else{
		statement_count -= 1;
		loadStatements();
	}
}

function loadChooseStatements(){
	statements.style.display = 'none';
	chooseParties.style.display = 'none';
	chooseStatements.style.display = 'block';
	back_btn.setAttribute("onclick", "back()");
	
	//alle statements laten zien
	if(statement_ul.childNodes.length == 0){
		for(var index = 0; index < subjects.length; ++index ){		
			var input = document.createElement("input");
			var label = document.createElement("label");
			statement_ul.appendChild(label);
			statement_ul.appendChild(input);
			input.setAttribute("type", "checkbox");	
			input.setAttribute("value", subjects[index].title);	
			input.setAttribute("id", "statements");	
			input.style.display = 'block';			
			label.innerHTML = subjects[index].title;				
		}
	}	
}

function loadChooseParties(){
	results = [];
	chooseStatements.style.display = 'none';
	score.style.display = 'none';
	chooseParties.style.display = 'block';
	back_btn.setAttribute("onclick", "loadChooseStatements()");
}

function calculateResult(){
	var statement_titles = document.querySelectorAll('input[id=statements]');
	points = 0;
	for(var y = 0; y < opinions.length; ++y ){		
		if(opinions[y] != ""){
			var sum = 1;
			points +=1;
			if(statement_titles[y].checked == true){
				sum = 2;
				points +=1;
			}

			for (var i = 0; i < parties.length; ++i ){	
				//eerste waarde voor elke partij
				if(results.length != parties.length){

					if(opinions[y] == subjects[y].parties[i].position ){

						results[i] = {name : subjects[y].parties[i].name , total : sum}
					}else{
						
						results[i] = {name : subjects[y].parties[i].name , total : 0}						
					}
				}else{
					// waarde toevoegen per partij
					if(opinions[y] == subjects[y].parties[i].position ){

						for (var x = 0; x < results.length; ++x ){	

							if(subjects[y].parties[i].name == results[x].name){

								results[x].total += sum;						
								
							}
						}	
					}
				}				
			}	
		}		
	}	
}

function filterResult(){
	var filter_choice = document.querySelectorAll('input[class=filter_choice]');
	//grootte filteren
	if (filter_choice[0].checked == true ) {			
		for(var y = 0; y < parties.length; ++y ){
			if (parties[y].size == 0) {

				for(var i = 0; i < results.length; ++i){
					if(parties[y].name == results[i].name){
						results.splice(i, 1);						
					}
				}
			}			
		}			 
	}
	//seculier filteren of niet
	else if(filter_choice[1].checked == true){
		for(var y = 0; y < parties.length; ++y ){
			if (parties[y].secular != true) {

				for(var i = 0; i < results.length; ++i){
					if(parties[y].name == results[i].name){
						results.splice(i, 1);
					}
				}
			}			
		}		
	}	
}

function sortResult(	){	

  	results.sort(function(a, b){return b.total - a.total});	
}

function loadScore(){
	var score = document.getElementById('score');
	
	chooseParties.style.display = 'none';
	score.style.display = 'block';
	back_btn.setAttribute("onclick", "loadChooseParties()");

	calculateResult();
	filterResult();
	sortResult();	

	// ''score'' div leeg maken
	while (score.firstChild) {
	    score.removeChild(score.firstChild);
	}

	//resultaten komen hier eruit
	var h2 = document.createElement("h2");
	score.appendChild(h2);
	h2.innerHTML = "Uw mening komt het best overeen met:";

	results.forEach(function(sort_result){
		var p = document.createElement("p");
		score.appendChild(p);
		p.innerHTML = sort_result.name + " " + sort_result.total + "/" + points;
	});
}


 
