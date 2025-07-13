import { useState } from "react"
import { useEffect } from "react"
import { decode } from "he"
import clsx from "clsx"

export default function Quizzical() {

    const [questionsArray, setQuestionsArray] = useState([])
    const [selectedAnswers, setSelectedAnswers] = useState([])
    const [quizArray, setQuizArray] = useState ([])
    const [correctAnswers, setCorrectAnswers] = useState([])
    const [userCorrectAnswers, setUserCorrectAnswers] = useState([])
    const [isQuizOver, setIsQuizOver] = useState(false)
    const [isStarted, setIsStarted] = useState(false)
    const [numberOf, setNumberOf] = useState("5")
    const [category, setCategory] = useState("9")
    const [difficulty, setDifficulty] = useState("easy")

    async function getQuestions() {
        setIsStarted(true)
        const questionsRes = await fetch(`https://opentdb.com/api.php?amount=${numberOf}&category=${category}&difficulty=${difficulty}&type=multiple`)
        const questionsData = await questionsRes.json()
        setQuestionsArray(questionsData.results)
    }

    useEffect(() => {
        if (questionsArray.length > 0) {
            showQuizArray()
        }
    }, [questionsArray]) 

    function showQuizArray() {
        if (questionsArray.length > 0) {
            setQuizArray(questionsArray.map((data, index) => (
                {
                id: index,
                question: decode(data.question),
                correctAnswer: decode(data.correct_answer),
                allAnswers: getAllAnswers(
                        data.incorrect_answers.map(answer => decode(answer)),
                        decode(data.correct_answer)
                        )
            })))

            setCorrectAnswers(questionsArray.map((data, index) => (
                {
                id: index,
                answer: decode(data.correct_answer)
            })))
        }
    }

    function seeCorrectAnswers(){
        setIsQuizOver(true)

        const correctUserAnswers = selectedAnswers.filter(answer =>
        correctAnswers.some(a =>
            a.id === answer.id && a.answer === answer.answer)
        )

        setUserCorrectAnswers(correctUserAnswers)

        setTimeout(() => {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: "smooth"
            });
        }, 1);

    }
    
    function getAllAnswers(incorrectArray, correctAnswer) {
        let array = [...incorrectArray, correctAnswer]
        let currentIndex = array.length
        let randomIndex
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }

        return array;
    }

    function selectAnswer(id, choiceQuestion, choice) {
        setSelectedAnswers(prevAnswers => {
            const filtered = prevAnswers.filter(answer => answer.id !== id);

            return [...filtered, { id: id, question: choiceQuestion, answer: choice }];
            })
    }

    function startOver() {
        console.log("This is the category " + categories.category)
        setQuestionsArray([])
        setSelectedAnswers([])
        setQuizArray([])
        setCorrectAnswers([])
        setUserCorrectAnswers([])
        setIsQuizOver(false)
        setIsStarted(false)

        setTimeout(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
            });
        }, 1);
    }

    const numberChange = e => {
        setNumberOf(e.target.value)
    }

    const categoryChange = e => {
        setCategory(e.target.value)
    }

    const difficultyChange = e => {
        setDifficulty(e.target.value)
    }

    const startMenu =
        <form>
            <h1 className="title">Quizzical</h1>
            <p>Category</p>
            <select defaultValue={category} onChange={categoryChange}>
                <option value="27">Animals</option>
                <option value="31">Anime</option>
                <option value="25">Art</option>
                <option value="16">Board Games</option>
                <option value="10">Books</option>
                <option value="32">Cartoons</option>
                <option value="29">Comics</option>
                <option value="11">Film</option>
                <option value="9">General Info</option>
                <option value="22">Geography</option>
                <option value="23">History</option>
                <option value="19">Math</option>
                <option value="12">Music</option>
                <option value="24">Politics</option>
                <option value="21">Sports</option>
                <option value="14">Television</option>
                <option value="28">Vehicles</option>
                <option value="15">Video Games</option>
            </select>
            <p>Questions</p>
            <select className="numberOfQuestions" defaultValue={numberOf} onChange={numberChange}>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
            </select>
            <p>Difficulty</p>
            <select className="difficulty" defaultValue={difficulty} onChange={difficultyChange}>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
            </select>
            <button className="startButton" onClick={() => getQuestions()}>Start Quiz</button>
        </form>

    const categories = {
        27: "Animals",
        31: "Anime",
        25: "Art",
        16: "Board Games",
        10: "Books",
        32: "Cartoons",
        29: "Comics",
        11: "Film",
        9: "General Info",
        22: "Geography",
        23: "History",
        19: "Math",
        12: "Music",
        24: "Politics",
        21: "Sports",
        14: "Television",
        28: "Vehicles",
        15: "Video Games",
    };
    
    const quizArrayMap = quizArray.map((data, index) => {
        
        let answers = data.allAnswers.map((answer, index) => {

            const isSelected = selectedAnswers.some(a => a.id === data.id && a.answer === answer)
            const isCorrect = correctAnswers.some(a => a.id === data.id && a.answer === answer)

            return(
                <div key={answer + index}
                    className={clsx("answer", {
                        selected: isSelected, 
                        correct: isCorrect && isQuizOver,
                        selectedCorrect: isSelected && isCorrect && isQuizOver,
                        selectedWrong: isSelected && isQuizOver && !isCorrect,
                        disabled: isQuizOver
                    })} 
                    onClick={() => selectAnswer(data.id, data.question, answer)}
                >
                    {answer}
                </div>
            )
        })

        return (
            <div key={index} 
                className="questionsContainer">
                <p>{data.question}</p>
                <div className="answersContainer">
                    {answers}
                </div>
            </div>
        )
    })

    const loadingImage = 
        <div className="loadingContainer">
            <img src="https://raw.githubusercontent.com/Luffy-Montoya/quizzical/refs/heads/main/images/black_loading.gif"/>
        </div>

    let resultsMessage = "Great job!"

    return (
        <main>
            {!isStarted && startMenu}
            {(isStarted && questionsArray.length < 1) && loadingImage}
            {questionsArray.length > 0 && <section>
                <h1 className="category">{categories[category]}</h1>
                <div className="quiz">
                    {quizArrayMap}
                </div>         
                {!isQuizOver && <button className="newQuiz" onClick={() => seeCorrectAnswers()}>Check Answers</button>}
                {isQuizOver && <div className="summary">You answered <b>{userCorrectAnswers.length}/{questionsArray.length}</b> questions correctly.</div>}
                {isQuizOver && <div className="message">{resultsMessage}</div>}
                {isQuizOver && <button className="newQuiz" onClick={() => startOver()}>New Quiz</button>}
            </section>}
        </main>

    )
}
