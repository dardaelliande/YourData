let questionTypes = ['unique', 'multiple', 'text'];

function createQuestionTitle(){
    var question = document.createElement('div');
    question.classList.add('columnBox');

    var label = document.createElement('label');
    label.innerText='Intitulé de la question :';

    var inputText = document.createElement('input');
    inputText.type= 'text';

    question.appendChild(label);
    question.appendChild(inputText);

    console.log(question);
    return question;
}

function createQuestionType(){
    var question = document.createElement('div');
    question.classList.add('columnBox');

    var label = document.createElement('label');
    label.innerText='Type de la question :';

    var choice = document.createElement('select');
    var optionMultiple = document.createElement('option');
    optionMultiple.value='multiple';
    optionMultiple.text='multiple';

    var optionUnique = document.createElement('option');
    optionUnique.value='unique';
    optionUnique.text='unique';

    var optionText = document.createElement('option');
    optionText.value='textuelle';
    optionText.text='textuelle';


    choice.appendChild(optionMultiple);
    choice.appendChild(optionUnique);
    choice.appendChild(optionText);

    choice.addEventListener('change',function(){
        var optionContainer = this.parentElement.parentElement.querySelector('#optionsContainer');
        if(this.value=='textuelle'){
            optionContainer.style.visibility = "hidden";
        }
        else{
            optionContainer.style.visibility = "initial";
        }
    })

    question.appendChild(label);
    question.appendChild(choice);

    console.log(question);

    return question;
}

function createBoxToAddOption(){
    var box = document.createElement('div');
    box.id='optionsContainer';
    box.classList.add('columnBox');

    console.log(box);

    return box;
}

function createInputText(){
    var input=document.createElement('input');
    input.type='text';
    return input;
}

function createInputTextWithLabel(string){

    var box = document.createElement('div');
    box.classList.add('columnBox');

    var label = document.createElement('label');
    label.innerText='Option '+ (string+1);
    var input=document.createElement('input');
    input.id='optionInput';
    input.type='text';

    box.appendChild(label);
    box.appendChild(input);

    return box;
}

function createButtonAddOption(){
    var button = document.createElement('button');
    button.innerText='Ajout d\'une option';

    button.addEventListener('click', function(event){
        event.preventDefault();
        
        let parentElement = this.parentElement;
        let optionsBox = parentElement.querySelector('#optionsContainer');
        let wichOption = optionsBox.childElementCount;

        optionsBox.appendChild(createInputTextWithLabel(wichOption));

        console.log(wichOption);
    });


    console.log(button);

    return button;
}



function addQuestion(){

    var newQuestion = document.createElement('div');

    newQuestion.appendChild(createQuestionTitle());
    newQuestion.appendChild(createQuestionType());
    newQuestion.appendChild(createBoxToAddOption());
    newQuestion.appendChild(createButtonAddOption());

    console.log(newQuestion.childNodes);

    // Ajoutez la question au formulaire
	document.getElementById('form').appendChild(newQuestion);
}


document.getElementById('addQuestion').addEventListener('click', function() {
	// Créez un nouvel élément de formulaire pour la question suivante
	var newQuestion = document.createElement('div');

    addQuestion();
});



addQuestion();