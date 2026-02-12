import { Link } from 'react-router-dom'
import unitsData from '../data/units.json'
import './UnitMap.css'

export default function UnitMap({ progressHook }) {
    const { progress, getUnitProgress, isUnitUnlocked } = progressHook

    return (
        <div className="unit-map container">
            <div className="unit-map-header animate-fade-in-up">
                <h1>Belajar Bahasa Indonesia!</h1>
                <p className="unit-map-subtitle">Learn Indonesian step by step through 12 interactive units</p>
                <div className="overall-stats">
                    <div className="overall-stat">
                        <span className="overall-stat-number">{progress.xp}</span>
                        <span className="overall-stat-label">XP Earned</span>
                    </div>
                    <div className="overall-stat">
                        <span className="overall-stat-number">{progress.completedLessons.length}</span>
                        <span className="overall-stat-label">Lessons Done</span>
                    </div>
                    <div className="overall-stat">
                        <span className="overall-stat-number">{progress.streak}</span>
                        <span className="overall-stat-label">Day Streak</span>
                    </div>
                </div>
            </div>

            <div className="unit-path">
                <div className="path-line" />
                {unitsData.map((unit, index) => {
                    const unlocked = isUnitUnlocked(unit.id)
                    const unitProgress = getUnitProgress(unit.id)
                    const hasContent = unit.id <= 1 // Only Unit 1 has content for now
                    const totalItems = unit.totalLessons + unit.totalExercises
                    const completedItems = unitProgress.lessons + unitProgress.exercises
                    const progressPercent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0

                    return (
                        <div
                            key={unit.id}
                            className={`unit-node animate-fade-in-up stagger-${Math.min(index + 1, 8)} ${unlocked ? '' : 'locked'}`}
                        >
                            {unlocked && hasContent ? (
                                <Link to={`/unit/${unit.id}`} className="unit-card card">
                                    <div className="unit-card-icon" style={{ background: unit.color }}>
                                        <span>{unit.icon}</span>
                                    </div>
                                    <div className="unit-card-content">
                                        <div className="unit-card-number">Unit {unit.id}</div>
                                        <h3 className="unit-card-title">{unit.title}</h3>
                                        <p className="unit-card-subtitle">{unit.subtitle}</p>
                                        {progressPercent > 0 && (
                                            <div className="unit-card-progress">
                                                <div className="progress-bar-container">
                                                    <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
                                                </div>
                                                <span className="unit-card-progress-text">{progressPercent}%</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="unit-card-arrow">→</div>
                                </Link>
                            ) : (
                                <div className={`unit-card card ${!hasContent && unlocked ? 'coming-soon' : ''}`}>
                                    <div className="unit-card-icon" style={{ background: unlocked ? unit.color : '#BDC3C7', opacity: unlocked ? 0.6 : 0.4 }}>
                                        <span>{unlocked ? unit.icon : '🔒'}</span>
                                    </div>
                                    <div className="unit-card-content">
                                        <div className="unit-card-number">Unit {unit.id}</div>
                                        <h3 className="unit-card-title">{unit.title}</h3>
                                        <p className="unit-card-subtitle">{unit.subtitle}</p>
                                        {!unlocked && <span className="badge badge-warning">Complete previous unit</span>}
                                        {unlocked && !hasContent && <span className="badge badge-warning">Coming Soon</span>}
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
