import React from 'react';

class Questions extends React.Component {
    state = {
        selectedAnswer: null,
        currentQuestion: 0,
        questionCount: 0,
        questionData: [],
        options: [],
        score: 0,
        isCorrect: null,
        isStartClicked: false,
        defaultPage: true,
        difficulty: 'easy'
    }

    loadQuestion() {
        fetch(
            "https://opentdb.com/api.php?amount=10&category=11&difficulty=" + this.state.difficulty +
            "&type=multiple"
        )
            .then(res => res.json())
            .then(json => {
                const {currentQuestion, options} = this.state;
                var correct = json
                    .results[currentQuestion]
                    .correct_answer;
                var incorrects = json
                    .results[currentQuestion]
                    .incorrect_answers;

                if (options.length === 0) {
                    var random = Math.random() * 4;
                    incorrects.splice(Math.floor(random), 0, correct);

                }

                this.setState(() => {
                    return {
                        questionData: json.results,
                        questions: json
                            .results[currentQuestion]
                            .question,
                        correctAnswer: json
                            .results[currentQuestion]
                            .correct_answer,
                        options: incorrects,
                        questionCount: json.results.length
                    }
                });
            })
            .catch(err => {
                console.log(err);
            });
    }

    componentDidUpdate(prevProps, prevState) {
        const {currentQuestion, questionData, options} = this.state;
        if (this.state.currentQuestion !== prevState.currentQuestion) {

            var correct = questionData[currentQuestion].correct_answer;
            var incorrects = questionData[currentQuestion].incorrect_answers;            

            if (options.length === 0) {
                var random = Math.random() * 4;
                incorrects.splice(Math.floor(random), 0, correct);
            }

            this.setState(() => {
                return {
                    questions: questionData[currentQuestion].question, options: incorrects,                    
                    correctAnswer: questionData[currentQuestion].correct_answer
                };
            })

        }
    }

    getNextQuestion = () => {

        this.setState({
            currentQuestion: this.state.currentQuestion + 1,
            isStartClicked: true,
            options: []
        })

    }

    checkAnswer = answer => {

        const {correctAnswer, score} = this.state;

        this.setState(
            {selectedAnswer: answer, defaultPage: false, isStartClicked: false}
        )

        let _isCorrect = correctAnswer === answer ? true : false;          
        if (_isCorrect) {
            this.setState({
                score: score + 100
            })
        }
        this.setState({isCorrect: _isCorrect})      
    }

    getStarted = () => {
        this.loadQuestion();
        this.setState({defaultPage: false, isStartClicked: true})
    }

    restartGame = () => {
        window.location.reload();
    }

    difficultyChanged = (e) => {
        this.setState({difficulty: e.target.value})
    }

    render() {
        const {
            questions,
            options,
            currentQuestion,
            questionCount,
            score,
            isCorrect,
            isStartClicked,
            defaultPage
        } = this.state;

        if (defaultPage) {
            return (
                <div className="App">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-6  offset-md-3 mt-5 bordered">
                                <div className="d-flex flex-column ">
                                    <div className="p-2 text-center">
                                        <img className="animation" src="4975-question-mark.gif" alt="Trivia Game"></img>
                                    </div>
                                    <div className="p-2 text-center">
                                        <p className="label-title">Trivia Game</p>
                                    </div>
                                    <div className="p-2 text-center">
                                        <button className="btn btn-info label" onClick={this.getStarted}>GET STARTED</button>
                                    </div>
                                    <div className="p-2 text-center difficulty">
                                        <select
                                            id="difficulty"
                                            className="custom-select custom-select-sm m-auto"
                                            onChange={this
                                                .difficultyChanged
                                                .bind(this)}
                                            value={this.state.option}>
                                            <option defaultValue="selected">Difficulty</option>
                                            <option value="easy">Easy</option>
                                            <option value="medium">Medium</option>
                                            <option value="hard">Hard</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }

        if (isStartClicked) {

            return (
                <div className="App">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-6  offset-md-3 mt-5 bordered">
                                <div className="d-flex flex-column ">
                                    <div className="p-2 text-center question-header">
                                        <div className="d-flex">
                                            <div className="p-2">
                                                <span className="label">Question {currentQuestion + 1}
                                                    / {questionCount}</span>
                                            </div>
                                            <div className="m-auto"></div>
                                            <div className="p-2 ">
                                                <span className="label">
                                                    {score} Points
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-2 text-center">
                                        <p>{questions}</p>
                                    </div>
                                    <div className="p-2 mt-2">
                                        <ul className="question-list">
                                            {
                                                options.map(option => (
                                                    <li className="p-2 ">
                                                        <button
                                                            className="btn btn-primary btn-lg btn-block"
                                                            key={option}
                                                            onClick={() => this.checkAnswer(option)}>{option}
                                                        </button>
                                                    </li>
                                                ))
                                            }
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }

        if (isCorrect) {
            return (
                <div className="App">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-6  offset-md-3 mt-5 bordered">
                                <div className="d-flex flex-column ">
                                    <div className="p-2 text-center question-header">
                                        <div className="d-flex">
                                            <div className="p-2">
                                                <span className="label">Question {currentQuestion + 1}
                                                    / {questionCount}</span>
                                            </div>
                                            <div className="m-auto"></div>
                                            <div className="p-2">
                                                <span></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-2 text-center">
                                        <img className="animation-1" src="14584-well-done.gif" alt="Trivia Game"></img>
                                    </div>
                                    <div class="p-2 text-center">
                                        {
                                            currentQuestion + 1 < questionCount && <div>
                                                    <p className="label">You have earned {score} points</p>                                                       
                                                    <p className="label">Total : {questionCount * 100} points</p>
                                                    <br></br>
                                                    <button className="btn btn-info label" onClick={this.getNextQuestion}>Next Question</button>
                                                </div>
                                        }
                                    </div>
                                    <div className="p-2 text-center">
                                        {
                                            currentQuestion + 1 === questionCount && 
                                                <div>
                                                    <p className="label">
                                                        Finished !!! <br></br> You have earned {score}  points
                                                    </p>
                                                    <button className="btn btn-info label" onClick={this.restartGame}>PLAY AGAIN</button>
                                                </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <div className="App">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-6  offset-md-3 mt-5 bordered">
                                <div className="d-flex flex-column ">
                                    <div className="p-2 text-center">
                                        <img className="animation" src="18769-sad-emoji.gif" alt="Trivia Game"></img>
                                    </div>
                                    <div className="p-2 text-center label">
                                        <p>Game Over !!!
                                            <br></br>
                                            {score > 0 && 
                                               <span> You have earned {score} points </span>
                                            }
                                            {score === 0 && 
                                               <span> You have no points </span>
                                            }
                                        </p>   
                                    </div>
                                    <div className="p-2 text-center">
                                        <button className="btn btn-info label" onClick={this.restartGame}>PLAY AGAIN</button>
                                    </div>
                                    <br></br>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }
}

export default Questions;