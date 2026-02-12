import { useParams, Link } from 'react-router-dom'
import unit1Data from '../data/unit1.json'
import './UnitOverview.css'

const unitDataMap = {
    1: unit1Data
}

export default function UnitOverview({ progressHook }) {
    const { unitId } = useParams()
    const id = parseInt(unitId)
    const unitData = unitDataMap[id]
    const { progress } = progressHook

    if (!unitData) {
        return (
            <div className="container unit-overview-empty">
                <h2>Unit {id} coming soon!</h2>
                <p>We're still working on this unit's content.</p>
                <Link to="/" className="btn btn-primary">← Back to Map</Link>
            </div>
        )
    }

    return (
        <div className="unit-overview container">
            <Link to="/" className="back-link">← Back to Map</Link>

            <div className="unit-overview-header animate-fade-in-up">
                <h1>{unitData.title}</h1>
                <p className="unit-overview-subtitle">{unitData.subtitle}</p>
            </div>

            <section className="section-group animate-fade-in-up stagger-2">
                <h2>📖 Lessons</h2>
                <div className="section-list">
                    {unitData.sections.map((section, i) => {
                        const isCompleted = progress.completedLessons.includes(section.id)
                        return (
                            <Link
                                key={section.id}
                                to={`/unit/${id}/lesson/${section.id}`}
                                className={`section-card card ${isCompleted ? 'completed' : ''}`}
                            >
                                <div className="section-card-left">
                                    <div className={`section-badge ${isCompleted ? 'done' : ''}`}>
                                        {isCompleted ? '✓' : section.id}
                                    </div>
                                </div>
                                <div className="section-card-content">
                                    <h3>{section.title}</h3>
                                    <p>{section.titleEn}</p>
                                    {section.audio && <span className="audio-tag">🎧 Audio</span>}
                                </div>
                                <div className="section-card-arrow">→</div>
                            </Link>
                        )
                    })}
                </div>
            </section>

            <section className="section-group animate-fade-in-up stagger-4">
                <h2>🧠 Exercises</h2>
                <div className="section-list">
                    {unitData.exercises.map((exercise) => {
                        const isCompleted = progress.completedExercises.includes(exercise.id)
                        const score = progress.unitScores[exercise.id]
                        const typeLabels = {
                            matching: 'Matching',
                            multiple_choice: 'Multiple Choice',
                            fill_blank: 'Fill in the Blank'
                        }
                        return (
                            <Link
                                key={exercise.id}
                                to={`/unit/${id}/exercise/${exercise.id}`}
                                className={`section-card card ${isCompleted ? 'completed' : ''}`}
                            >
                                <div className="section-card-left">
                                    <div className={`section-badge exercise ${isCompleted ? 'done' : ''}`}>
                                        {isCompleted ? '✓' : '?'}
                                    </div>
                                </div>
                                <div className="section-card-content">
                                    <h3>{exercise.instruction}</h3>
                                    <p>{typeLabels[exercise.type] || exercise.type}</p>
                                    {score && <span className="score-tag">Score: {score.score}/{score.total}</span>}
                                </div>
                                <div className="section-card-arrow">→</div>
                            </Link>
                        )
                    })}
                </div>
            </section>

            <section className="section-group animate-fade-in-up stagger-6">
                <h2>📝 Vocabulary Review</h2>
                <div className="vocab-grid">
                    {unitData.endOfUnitVocabulary.slice(0, 20).map((item, i) => (
                        <div key={i} className="vocab-mini-card">
                            <span className="vocab-word">{item.word}</span>
                            <span className="vocab-meaning">{item.meaning}</span>
                        </div>
                    ))}
                    {unitData.endOfUnitVocabulary.length > 20 && (
                        <div className="vocab-more">
                            +{unitData.endOfUnitVocabulary.length - 20} more words
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}
