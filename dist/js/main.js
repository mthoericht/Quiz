var quizHandler;

function getWelcome()
{
    //Zugriff auf dynamisches Attribut phrases[lang]

    quizHandler = new QuizHandler(getLanguage());
    quizHandler.loadQuestions();
}


function QuizHandler(language)
{
    "use strict";
    this.language	=  language;
    this.questions	= [];
    this.currentQuestion;
    this.jsonRequest;
    this.jsonURL                     = "json/questions_de.json";

    this.loadQuestions = function ()
    {
        console.log("load Questions for " + language + " url: " + this.jsonURL);
        this.jsonRequest = $.getJSON(this.jsonURL, function(data)
        {
            console.log("jsonFile is loaded");

            //Beschreibungstext
            var descriptionElement = document.getElementById("description");
            descriptionElement.innerHTML = data.description;

            for (var i = 0; i < data.questions.length; i++)
            {
                //quizHandler.setQuestion(data.questions[i], i);
                quizHandler.questions[i] = data.questions[i];
            }

           quizHandler.showQuestion(0);
        });
    }

    this.showQuestion = function ($id)
    {
        quizHandler.currentQuestion     = $id;

        //console.log("Frage 1: " + this.questions[id].question);
        document.getElementById("questionText").innerHTML = this.questions[quizHandler.currentQuestion].question;

        //Initialisiere alle Antwortfelder
        for (var a = 0; a < this.questions[quizHandler.currentQuestion].answers.length; a++)
        {
            document.getElementById("answer" + a).setAttribute('class', 'Answer');
            document.getElementById("answer" + a).innerHTML = this.questions[quizHandler.currentQuestion].answers[a];
            document.getElementById("answer" + a).addEventListener("click", quizHandler.onClickAnswer);
        }
    }


    this.onClickAnswer = function(evt)
    {
        //Weitere Interaktionen unterbinden
        quizHandler.disableAllButtons();

        evt.target.setAttribute('class', 'Answer AnswerClicked');

        setTimeout(function()
        {
            quizHandler.showSolution(evt.target.id);
        }, 2000);
    }


    this.showSolution = function($choosedAnswer)
    {
        if($choosedAnswer.replace("answer", "") === this.questions[quizHandler.currentQuestion].isCorrect)
        {
            document.getElementById($choosedAnswer).setAttribute('class', 'Answer AnswerCorrect');
        }else
        {
            document.getElementById($choosedAnswer).setAttribute('class', 'Answer AnswerWrong');
        }

        setTimeout(quizHandler.showNextQuestion, 2000);
    }


    this.showNextQuestion = function()
    {
        if(quizHandler.currentQuestion + 1 < quizHandler.questions.length)
        {
            quizHandler.showQuestion(quizHandler.currentQuestion + 1);
        }else
        {
            console.log("Das wars");
        }
    }

    this.disableAllButtons = function()
    {
        for (var a = 0; a < 4; a++)
        {
            document.getElementById("answer" + a).removeEventListener("click", quizHandler.onClickAnswer);
        }
    }
}


function getLanguage()
{
    if (navigator.language) {
        language = navigator.language;
    } else if (navigator.userLanguage) {
        language = navigator.userLanguage;
    }

    if (language && language.length > 2) {
        language = language.substring(0, 2);
    }

    return language;
}
