import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState, useRef } from 'react'
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
import './LessonView.css'

const unitDataMap = {
    1: unit1Data, 2: unit2Data, 3: unit3Data,
    4: unit4Data, 5: unit5Data, 6: unit6Data,
    7: unit7Data, 8: unit8Data, 9: unit9Data,
    10: unit10Data, 11: unit11Data, 12: unit12Data
}

export default function LessonView({ progressHook }) {
    const { unitId, sectionId } = useParams()
    const navigate = useNavigate()
    const id = parseInt(unitId)
    const unitData = unitDataMap[id]
    const section = unitData?.sections.find(s => s.id === sectionId)
    const [showTranslation, setShowTranslation] = useState(false)
    const [activeTab, setActiveTab] = useState('lesson')
    const [flippedCards, setFlippedCards] = useState(new Set())
    const audioRef = useRef(null)

    if (!section) {
        return (
            <div className="container"><p>Section not found.</p><Link to="/">← Home</Link></div>
        )
    }

    const handleComplete = () => {
        progressHook.completeLesson(section.id)
        navigate(`/unit/${id}`)
    }

    const toggleFlip = (index) => {
        setFlippedCards(prev => {
            const next = new Set(prev)
            if (next.has(index)) next.delete(index)
            else next.add(index)
            return next
        })
    }

    const content = section.content
    const dialogue = content?.dialogue || []
    const sentences = content?.sentences || []
    const grammar = content?.grammar
    const vocabulary = section.vocabulary || []
    const zodiacList = content?.zodiacList || []

    return (
        <div className="lesson-view container">
            <Link to={`/unit/${id}`} className="back-link">← Unit {id}</Link>

            <div className="lesson-header animate-fade-in-up">
                <div className="lesson-header-meta">Section {section.id}</div>
                <h1>{section.title}</h1>
                <p className="lesson-header-sub">{section.titleEn}</p>
            </div>

            {/* Tab Bar */}
            <div className="lesson-tabs animate-fade-in-up stagger-2">
                <button
                    className={`lesson-tab ${activeTab === 'lesson' ? 'active' : ''}`}
                    onClick={() => setActiveTab('lesson')}
                >📖 Lesson</button>
                <button
                    className={`lesson-tab ${activeTab === 'vocab' ? 'active' : ''}`}
                    onClick={() => setActiveTab('vocab')}
                >📝 Vocabulary</button>
                {grammar && (
                    <button
                        className={`lesson-tab ${activeTab === 'grammar' ? 'active' : ''}`}
                        onClick={() => setActiveTab('grammar')}
                    >📐 Grammar</button>
                )}
            </div>

            {/* Lesson Tab */}
            {activeTab === 'lesson' && (
                <div className="lesson-content animate-fade-in">
                    {content.intro && (
                        <div className="lesson-intro card">
                            <p>{content.intro}</p>
                        </div>
                    )}

                    {/* Audio Player */}
                    {section.audio && (
                        <div className="audio-section">
                            <div className="audio-player card">
                                <span className="audio-label">🎧 Listen to this section</span>
                                <audio ref={audioRef} controls src={`/audio/${section.audio}`} className="audio-element" />
                            </div>
                        </div>
                    )}

                    {/* Basic Sentences */}
                    {sentences.length > 0 && (
                        <div className="sentences-section">
                            <div className="section-title-bar">
                                <h3>Basic Sentences</h3>
                                <button className="btn btn-ghost btn-sm" onClick={() => setShowTranslation(!showTranslation)}>
                                    {showTranslation ? 'Hide' : 'Show'} Translation
                                </button>
                            </div>
                            <div className="sentence-list">
                                {sentences.map((s, i) => (
                                    <div key={i} className="sentence-item card" style={{ animationDelay: `${i * 0.05}s` }}>
                                        <div className="sentence-id">{s.id}</div>
                                        {showTranslation && <div className="sentence-en">{s.en}</div>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Dialogue */}
                    {dialogue.length > 0 && (
                        <div className="dialogue-section">
                            <h3>Dialogue</h3>
                            <div className="dialogue-list">
                                {dialogue.map((line, i) => (
                                    <div key={i} className={`dialogue-bubble ${line.speaker === dialogue[0]?.speaker ? 'left' : 'right'}`}>
                                        <div className="dialogue-speaker">{line.speaker}</div>
                                        <div className="dialogue-text">{line.id}</div>
                                        {showTranslation && <div className="dialogue-translation">{line.en}</div>}
                                    </div>
                                ))}
                            </div>
                            <button className="btn btn-ghost btn-sm" onClick={() => setShowTranslation(!showTranslation)}>
                                {showTranslation ? 'Hide' : 'Show'} Translation
                            </button>
                        </div>
                    )}

                    {/* Zodiac List */}
                    {zodiacList.length > 0 && (
                        <div className="zodiac-section">
                            <h3>Chinese Zodiac Animals</h3>
                            <div className="zodiac-grid">
                                {zodiacList.map((z, i) => (
                                    <div key={i} className="zodiac-card card">
                                        <div className="zodiac-animal">{z.animal}</div>
                                        <div className="zodiac-en">{z.en}</div>
                                        <div className="zodiac-traits">{z.traits}</div>
                                        <div className="zodiac-traits-en">{z.traitsEn}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Cultural Note */}
                    {content.culturalNote && (
                        <div className="cultural-note card">
                            <h3>🌏 Cultural Note</h3>
                            <p>{content.culturalNote}</p>
                        </div>
                    )}
                </div>
            )}

            {/* Vocabulary Tab */}
            {activeTab === 'vocab' && (
                <div className="vocab-content animate-fade-in">
                    <p className="vocab-hint">Tap a card to reveal its meaning</p>
                    <div className="vocab-flashcard-grid">
                        {vocabulary.map((v, i) => (
                            <div
                                key={i}
                                className={`vocab-flashcard ${flippedCards.has(i) ? 'flipped' : ''}`}
                                onClick={() => toggleFlip(i)}
                            >
                                <div className="vocab-flashcard-inner">
                                    <div className="vocab-flashcard-front">
                                        <span className="vocab-flashcard-word">{v.word}</span>
                                    </div>
                                    <div className="vocab-flashcard-back">
                                        <span className="vocab-flashcard-meaning">{v.meaning}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Grammar Tab */}
            {activeTab === 'grammar' && grammar && (
                <div className="grammar-content animate-fade-in">
                    <div className="grammar-card card">
                        <h3>{grammar.title}</h3>
                        <p className="grammar-explanation">{grammar.explanation}</p>
                        <div className="grammar-examples">
                            {grammar.examples.map((ex, i) => (
                                <div key={i} className="grammar-example">
                                    <div className="grammar-example-id">{ex.id}</div>
                                    <div className="grammar-example-en">{ex.en}</div>
                                    {ex.note && <div className="grammar-example-note">💡 {ex.note}</div>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Complete Button */}
            <div className="lesson-footer">
                <button className="btn btn-primary btn-lg" onClick={handleComplete}>
                    Complete Lesson ✓
                </button>
            </div>
        </div>
    )
}
