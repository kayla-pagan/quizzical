import React from 'react'
import Question from './components/Question.jsx'
import { nanoid } from 'nanoid'
import { decode } from 'html-entities'
import "./style.css"


export default function App(){
    const [data, setData] = React.useState([])
    const [startQuiz, setStartQuiz] = React.useState(false)
    const [loadQuiz, setLoadQuiz] = React.useState(false)
    const [formData, setFormData] = React.useState("")
    const [score, setScore] = React.useState(0)
    const [isScored, setIsScored] = React.useState(false)
        
    React.useEffect(() => {
        if(loadQuiz){
            async function getData(){
            const response = await fetch('https://opentdb.com/api.php?amount=5&difficulty=easy&type=multiple')
            const apiData = await response.json()
            const questionObj = apiData.results.map(item => {
                const correctAnswer = {
                    id: nanoid(),
                    answer: decode(item.correct_answer),
                    isCorrect: true
                }
                
                const incorrectAnswers = item.incorrect_answers.map(answer => ({
                    id: nanoid(),
                    answer: decode(answer),
                    isCorrect: false
                }))
                
                return {
                    question: decode(item.question),
                    answers: shuffleArray([correctAnswer, ...incorrectAnswers]),
                    id: nanoid()
                }
            })
            setData(questionObj)
        }
    
        getData()
        
        } 
    }, [loadQuiz])
    
    React.useEffect(() => {
        function scoreAnswers(e){
            const selectedAnswers = Object.values(formData)            
            const filteredData = selectedAnswers.filter((data) => {
                return data == "true"
            })
            setScore(filteredData.length)
        }
        
        scoreAnswers()
    }, [formData])
    
    function shuffleArray(array) { 
        return array.sort(() => Math.random() - 0.5)
    }
    
    const questionElements = data.map(item => {
            
        return (
            <Question
                key={item.id}
                question={item.question}
                answers={item.answers}
                isScored={isScored}
                formData={formData}
                setFormData={setFormData}
            />
        )
    })
    
    function start(){
        setStartQuiz(true)
        setLoadQuiz(true)
    }
    
    function restart(){
        setScore(0)
        setIsScored(false)
        setFormData("")
        setLoadQuiz(true)
    }
    
    function handleSubmit(e){
        e.preventDefault()
        setIsScored(true)
        setLoadQuiz(false)
    } 
    
    return (
        <main>
            {
                startQuiz ?
                    <form onSubmit={handleSubmit} className="question-container">
                        {questionElements}
                        {isScored ? 
                            <div className="quiz-over">
                                <p>{`You scored ${score}/${data.length} correct answers`}</p> 
                                <button onClick={restart}>New quiz</button>
                            </div> : 
                            <button onClick={handleSubmit}>Check answers</button>}
                    </form>
                :
                    <div className="start">
                        <h1>Quizzical</h1>
                        <p>Test you knowledge on a wide variety of topics</p>
                        <button onClick={start}>Start quiz</button>
                    </div>
            }
        </main>
    )
}
