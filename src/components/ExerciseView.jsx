import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState, useCallback } from 'react'
import unit1Data from '../data/unit1.json'
import unit2Data from '../data/unit2.json'
import unit3Data from '../data/unit3.json'
import unit4Data from '../data/unit4.json'
import unit5Data from '../data/unit5.json'
import unit6Data from '../data/unit6.json'
import unit7Data from '../data/unit7.json'
import unit8Data from '../data/unit8.json'
import unit9Data from '../data/unit9.json'
import unit10Data from '../data/unit10.json'
import unit11Data from '../data/unit11.json'
import unit12Data from '../data/unit12.json'
import './ExerciseView.css'

const unitDataMap = {
    1: unit1Data, 2: unit2Data, 3: unit3Data,
    4: unit4Data, 5: unit5Data, 6: unit6Data,
    7: unit7Data, 8: unit8Data, 9: unit9Data,
    10: unit10Data, 11: unit11Data, 12: unit12Data
}

export default function ExerciseView({ progressHook }) {
    const { unitId, exerciseId } = useParams()
    const navigate = useNavigate()
    const id = parseInt(unitId)
    const unitData = unitDataMap[id]
    const exercise = unitData?.exercises.find(e => e.id === exerciseId)

    if (!exercise) {
        return (
            <div className="container"><p>Exercise not found.</p><Link to="/">← Home</Link></div>
        )
    }

    if (exercise.type === 'multiple_choice') {
        return <MultipleChoiceExercise exercise={exercise} unitId={id} progressHook={progressHook} navigate={navigate} />
    }
    if (exercise.type === 'fill_blank') {
        return <FillBlankExercise exercise={exercise} unitId={id} progressHook={progressHook} navigate={navigate} />
    }
    if (exercise.type === 'matching') {
        return <MatchingExercise exercise={exercise} unitId={id} progressHook={progressHook} navigate={navigate} />
    }

    return <div className="container"><p>Unknown exercise type.</p></div>
}

/* ---- Multiple Choice ---- */
function MultipleChoiceExercise({ exercise, unitId, progressHook, navigate }) {
    const [currentQ, setCurrentQ] = useState(0)
    const [selected, setSelected] = useState(null)
    const [confirmed, setConfirmed] = useState(false)
    const [score, setScore] = useState(0)
    const [finished, setFinished] = useState(false)
    const [shakeWrong, setShakeWrong] = useState(false)

    const questions = exercise.questions
    const q = questions[currentQ]

    const handleSelect = (index) => {
        if (confirmed) return
        setSelected(index)
    }

    const handleConfirm = () => {
        if (selected === null) return
        setConfirmed(true)
        const isCorrect = selected === q.answer
        if (isCorrect) {
            setScore(prev => prev + 1)
        } else {
            setShakeWrong(true)
            setTimeout(() => setShakeWrong(false), 500)
        }
    }

    const handleNext = () => {
        if (currentQ + 1 >= questions.length) {
            const finalScore = score + (selected === q.answer ? 0 : 0) // already counted
            progressHook.completeExercise(exercise.id, finalScore, questions.length)
            setFinished(true)
        } else {
            setCurrentQ(prev => prev + 1)
            setSelected(null)
            setConfirmed(false)
        }
    }

    if (finished) {
        return <ExerciseResults score={score} total={questions.length} unitId={unitId} navigate={navigate} />
    }

    return (
        <div className="exercise-view container">
            <Link to={`/unit/${unitId}`} className="back-link">← Unit {unitId}</Link>

            <div className="exercise-progress-bar">
                <div className="progress-bar-container">
                    <div className="progress-bar-fill" style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }} />
                </div>
                <span className="exercise-progress-text">{currentQ + 1}/{questions.length}</span>
            </div>

            <div className="exercise-card animate-fade-in-up" key={currentQ}>
                <h2 className="exercise-question">{q.question}</h2>
                <div className={`exercise-options ${shakeWrong ? 'animate-shake' : ''}`}>
                    {q.options.map((option, i) => {
                        let cls = 'exercise-option'
                        if (confirmed) {
                            if (i === q.answer) cls += ' correct'
                            else if (i === selected) cls += ' incorrect'
                        } else if (i === selected) {
                            cls += ' selected'
                        }
                        return (
                            <button key={i} className={cls} onClick={() => handleSelect(i)} disabled={confirmed}>
                                <span className="option-letter">{String.fromCharCode(65 + i)}</span>
                                <span className="option-text">{option}</span>
                            </button>
                        )
                    })}
                </div>

                {confirmed && (
                    <div className={`exercise-feedback animate-bounce-in ${selected === q.answer ? 'correct' : 'incorrect'}`}>
                        {selected === q.answer ? (
                            <span>✅ Correct! Great job!</span>
                        ) : (
                            <span>❌ Not quite. The answer is: <strong>{q.options[q.answer]}</strong></span>
                        )}
                    </div>
                )}

                <div className="exercise-actions">
                    {!confirmed ? (
                        <button className="btn btn-primary" onClick={handleConfirm} disabled={selected === null}>
                            Check Answer
                        </button>
                    ) : (
                        <button className="btn btn-accent" onClick={handleNext}>
                            {currentQ + 1 >= questions.length ? 'See Results' : 'Next →'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

/* ---- Fill in the Blank ---- */
function FillBlankExercise({ exercise, unitId, progressHook, navigate }) {
    const [currentQ, setCurrentQ] = useState(0)
    const [userInput, setUserInput] = useState('')
    const [confirmed, setConfirmed] = useState(false)
    const [score, setScore] = useState(0)
    const [finished, setFinished] = useState(false)

    const questions = exercise.questions
    const q = questions[currentQ]

    const handleConfirm = () => {
        if (!userInput.trim()) return
        setConfirmed(true)
        if (userInput.trim().toLowerCase() === q.answer.toLowerCase()) {
            setScore(prev => prev + 1)
        }
    }

    const handleNext = () => {
        if (currentQ + 1 >= questions.length) {
            const finalScore = score + (userInput.trim().toLowerCase() === q.answer.toLowerCase() ? 0 : 0)
            progressHook.completeExercise(exercise.id, finalScore, questions.length)
            setFinished(true)
        } else {
            setCurrentQ(prev => prev + 1)
            setUserInput('')
            setConfirmed(false)
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            if (!confirmed) handleConfirm()
            else handleNext()
        }
    }

    if (finished) {
        return <ExerciseResults score={score} total={questions.length} unitId={unitId} navigate={navigate} />
    }

    const isCorrect = userInput.trim().toLowerCase() === q.answer.toLowerCase()

    return (
        <div className="exercise-view container">
            <Link to={`/unit/${unitId}`} className="back-link">← Unit {unitId}</Link>

            <div className="exercise-progress-bar">
                <div className="progress-bar-container">
                    <div className="progress-bar-fill" style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }} />
                </div>
                <span className="exercise-progress-text">{currentQ + 1}/{questions.length}</span>
            </div>

            <div className="exercise-card animate-fade-in-up" key={currentQ}>
                <h2 className="exercise-question">{exercise.instruction}</h2>
                <div className="fill-blank-sentence">
                    {q.sentence.split('_____').map((part, i, arr) => (
                        <span key={i}>
                            {part}
                            {i < arr.length - 1 && (
                                <input
                                    className={`fill-blank-input ${confirmed ? (isCorrect ? 'correct' : 'incorrect') : ''}`}
                                    type="text"
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    disabled={confirmed}
                                    placeholder={q.hint}
                                    autoFocus
                                />
                            )}
                        </span>
                    ))}
                </div>

                {confirmed && (
                    <div className={`exercise-feedback animate-bounce-in ${isCorrect ? 'correct' : 'incorrect'}`}>
                        {isCorrect ? (
                            <span>✅ Correct!</span>
                        ) : (
                            <span>❌ The answer is: <strong>{q.answer}</strong></span>
                        )}
                    </div>
                )}

                <div className="exercise-actions">
                    {!confirmed ? (
                        <button className="btn btn-primary" onClick={handleConfirm} disabled={!userInput.trim()}>
                            Check Answer
                        </button>
                    ) : (
                        <button className="btn btn-accent" onClick={handleNext}>
                            {currentQ + 1 >= questions.length ? 'See Results' : 'Next →'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

/* ---- Matching ---- */
function MatchingExercise({ exercise, unitId, progressHook, navigate }) {
    const [selectedLeft, setSelectedLeft] = useState(null)
    const [matched, setMatched] = useState([]) // array of {left, right} pairs
    const [wrongPair, setWrongPair] = useState(null)
    const [finished, setFinished] = useState(false)

    const pairs = exercise.pairs
    const shuffledRight = useState(() => {
        return [...pairs].sort(() => Math.random() - 0.5).map(p => p.right)
    })[0]

    const isLeftMatched = (left) => matched.some(m => m.left === left)
    const isRightMatched = (right) => matched.some(m => m.right === right)

    const handleLeftClick = (left) => {
        if (isLeftMatched(left)) return
        setSelectedLeft(left)
        setWrongPair(null)
    }

    const handleRightClick = (right) => {
        if (!selectedLeft || isRightMatched(right)) return
        const correctPair = pairs.find(p => p.left === selectedLeft)
        if (correctPair && correctPair.right === right) {
            const newMatched = [...matched, { left: selectedLeft, right }]
            setMatched(newMatched)
            setSelectedLeft(null)
            setWrongPair(null)
            if (newMatched.length === pairs.length) {
                progressHook.completeExercise(exercise.id, pairs.length, pairs.length)
                setFinished(true)
            }
        } else {
            setWrongPair({ left: selectedLeft, right })
            setTimeout(() => {
                setWrongPair(null)
                setSelectedLeft(null)
            }, 800)
        }
    }

    if (finished) {
        return <ExerciseResults score={pairs.length} total={pairs.length} unitId={unitId} navigate={navigate} />
    }

    return (
        <div className="exercise-view container">
            <Link to={`/unit/${unitId}`} className="back-link">← Unit {unitId}</Link>

            <div className="exercise-progress-bar">
                <div className="progress-bar-container">
                    <div className="progress-bar-fill" style={{ width: `${(matched.length / pairs.length) * 100}%` }} />
                </div>
                <span className="exercise-progress-text">{matched.length}/{pairs.length}</span>
            </div>

            <div className="exercise-card animate-fade-in-up">
                <h2 className="exercise-question">{exercise.instruction}</h2>
                <p className="matching-hint">Tap an item on the left, then tap its match on the right</p>
                <div className="matching-grid">
                    <div className="matching-column">
                        {pairs.map((p, i) => {
                            let cls = 'matching-item'
                            if (isLeftMatched(p.left)) cls += ' matched'
                            else if (selectedLeft === p.left) cls += ' selected'
                            if (wrongPair?.left === p.left) cls += ' wrong'
                            return (
                                <button key={i} className={cls} onClick={() => handleLeftClick(p.left)} disabled={isLeftMatched(p.left)}>
                                    {p.left}
                                </button>
                            )
                        })}
                    </div>
                    <div className="matching-column">
                        {shuffledRight.map((right, i) => {
                            let cls = 'matching-item right'
                            if (isRightMatched(right)) cls += ' matched'
                            if (wrongPair?.right === right) cls += ' wrong'
                            return (
                                <button key={i} className={cls} onClick={() => handleRightClick(right)} disabled={isRightMatched(right)}>
                                    {right}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

/* ---- Results Screen ---- */
function ExerciseResults({ score, total, unitId, navigate }) {
    const percentage = Math.round((score / total) * 100)
    const getEmoji = () => {
        if (percentage === 100) return '🏆'
        if (percentage >= 80) return '🌟'
        if (percentage >= 60) return '👍'
        return '💪'
    }
    const getMessage = () => {
        if (percentage === 100) return 'Perfect score!'
        if (percentage >= 80) return 'Great job!'
        if (percentage >= 60) return 'Good effort!'
        return 'Keep practicing!'
    }

    return (
        <div className="exercise-results container">
            <div className="results-card card animate-bounce-in">
                <div className="results-emoji">{getEmoji()}</div>
                <h2 className="results-message">{getMessage()}</h2>
                <div className="results-score">
                    <span className="results-score-number">{score}</span>
                    <span className="results-score-divider">/</span>
                    <span className="results-score-total">{total}</span>
                </div>
                <div className="results-percentage">{percentage}% correct</div>
                <div className="results-xp">+{Math.round((score / total) * 20)} XP earned</div>
                <div className="results-actions">
                    <button className="btn btn-primary" onClick={() => navigate(`/unit/${unitId}`)}>
                        Continue →
                    </button>
                    <button className="btn btn-ghost" onClick={() => navigate(0)}>
                        Try Again
                    </button>
                </div>
            </div>
        </div>
    )
}
