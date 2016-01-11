var quizHandler;
var descriptionElement;
var questionElement;
var answerElements;

function getWelcome()
{
    //Zugriff auf dynamisches Attribut phrases[lang]

    descriptionElement = document.getElementById("description");
    questionElement = document.getElementById("questionText");

    answerElements  = [];
    for (var a = 0; a < 4; a++)
    {
        answerElements[a]   = document.getElementById("answer" + a);
    }

    quizHandler = new QuizHandler(getLanguage());
    quizHandler.loadQuestions();
}

function QuizHandler(language)
{
    "use strict";
    this.language	=  language;
    this.questions	= [];
    this.currentQuestion = -1;
    this.jsonRequest;
    this.jsonURL                     = "json/questions_de.json";

    TweenMax.allTo([descriptionElement, questionElement, answerElements], 0, {opacity:0, scaleX: 0, scaleY: 0});

    this.loadQuestions = function ()
    {
        console.log("load Questions for " + language + " url: " + this.jsonURL);
        this.jsonRequest = $.getJSON(this.jsonURL, function(data)
        {
            console.log("jsonFile is loaded");

            //Beschreibungstext
            descriptionElement.innerHTML = data.description;
            TweenMax.to(descriptionElement, 1, {opacity: 1, scaleX: 1, scaleY: 1});

            for (var i = 0; i < data.questions.length; i++)
            {
                //quizHandler.setQuestion(data.questions[i], i);
                quizHandler.questions[i] = data.questions[i];
            }

            setTimeout(quizHandler.showNextQuestion, 1000);
        });
    };

    this.showQuestion = function ($id)
    {
        quizHandler.currentQuestion     = $id;

        //console.log("Frage 1: " + this.questions[id].question);
        questionElement.innerHTML = quizHandler.currentQuestion + 1 + "/" + quizHandler.questions.length + " " + this.questions[quizHandler.currentQuestion].question;
        TweenMax.to(questionElement, 1, {opacity: 1, scaleX: 1, scaleY: 1});

        //Initialisiere alle Antwortfelder
        for (var a = 0; a < this.questions[quizHandler.currentQuestion].answers.length; a++)
        {
            answerElements[a].setAttribute('class', 'Answer');
            answerElements[a].innerHTML = this.questions[quizHandler.currentQuestion].answers[a];
            answerElements[a].addEventListener("click", quizHandler.onClickAnswer);
            TweenMax.to(answerElements[a], 1, {opacity: 1, scaleX: 1, scaleY: 1, delay: a / 5 + 1});
        }
    };

    this.onClickAnswer = function(evt)
    {
        //Weitere Interaktionen unterbinden
        quizHandler.disableAllButtons();
        evt.target.setAttribute('class', 'Answer AnswerClicked');

        setTimeout(function()
        {
            quizHandler.showSolution(evt.target.id);
        }, 2000);
    };

    this.showSolution = function($choosedAnswer)
    {
        if($choosedAnswer.replace("answer", "") === this.questions[quizHandler.currentQuestion].correctAnswer)
        {
            this.questions[quizHandler.currentQuestion].isCorrect = true;
            document.getElementById($choosedAnswer).setAttribute('class', 'Answer AnswerCorrect');
        }else
        {
            this.questions[quizHandler.currentQuestion].isCorrect = false;
            document.getElementById($choosedAnswer).setAttribute('class', 'Answer AnswerWrong');
        }

        TweenMax.allTo([questionElement, answerElements], 0.5, {opacity:0, scaleX: 0, scaleY: 0, delay: 2});
        setTimeout(quizHandler.showNextQuestion, 2500);
    };

    this.showNextQuestion = function()
    {
        if(quizHandler.currentQuestion + 1 < quizHandler.questions.length)
        {
            quizHandler.showQuestion(quizHandler.currentQuestion + 1);
        }else
        {
            quizHandler.showFinalOverview();
        }
    };

    this.disableAllButtons = function()
    {
        for (var a = 0; a < 4; a++)
        {
            document.getElementById("answer" + a).removeEventListener("click", quizHandler.onClickAnswer);
        }
    };

    this.showFinalOverview = function()
    {
        //Filter the correct answered questions
        var numOfCorrectAnsweredQuestions = this.questions.filter(function(question, index, questions)
        {
            return question.isCorrect === true;
        }).length;

        questionElement.innerHTML = "You answered " + numOfCorrectAnsweredQuestions + " of " + quizHandler.questions.length + " questions correct!";
        TweenMax.to(questionElement, 1, {opacity: 1, scaleX: 1, scaleY: 1});
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
