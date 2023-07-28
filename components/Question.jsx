import React from 'react'



export default function Question({question, answers, isScored, formData, setFormData}){
    
    function handleChange(e){
        e.stopPropagation()
        const {name, value, type, checked, defaultChecked, nextSibling} = e.target
        setFormData(prevData => ({
                ...prevData,
                [name]: type === "checkbox" ? defaultChecked : value
            }))
    }
    
    const answerElements = answers.map(answer => {
            const background = answer.isCorrect ? "correct" : undefined
        
            return (
                <div key={answer.id} className="answer">
                    <input 
                        required 
                        name={question} 
                        type="radio" 
                        id={answer.answer} 
                        value={answer.isCorrect}
                        onChange={handleChange}
                        defaultChecked={formData.question === answer.isCorrect}
                        answer={answer.answer}
                    />
                    <label className={isScored ? background : undefined} htmlFor={answer.answer}>{answer.answer}</label>
                    <br />
                </div>
            )
    }) 

    return (
        <div className="question">
            <fieldset>
                <legend>{question}</legend>       
                {answerElements}
            </fieldset>
            <div className="divider"></div>
        </div>
    )
}