import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'belajar_progress'

const defaultProgress = {
    xp: 0,
    streak: 0,
    lastActivityDate: null,
    completedLessons: [],
    completedExercises: [],
    vocabMastered: [],
    unitScores: {}
}

export function useProgress() {
    const [progress, setProgress] = useState(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY)
            if (stored) {
                return { ...defaultProgress, ...JSON.parse(stored) }
            }
        } catch (e) {
            console.error('Failed to load progress:', e)
        }
        return defaultProgress
    })

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
        } catch (e) {
            console.error('Failed to save progress:', e)
        }
    }, [progress])

    const completeLesson = useCallback((lessonId) => {
        setProgress(prev => {
            if (prev.completedLessons.includes(lessonId)) return prev
            const today = new Date().toISOString().split('T')[0]
            const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
            let newStreak = prev.streak
            if (prev.lastActivityDate === yesterday) {
                newStreak += 1
            } else if (prev.lastActivityDate !== today) {
                newStreak = 1
            }
            return {
                ...prev,
                xp: prev.xp + 10,
                streak: newStreak,
                lastActivityDate: today,
                completedLessons: [...prev.completedLessons, lessonId]
            }
        })
    }, [])

    const completeExercise = useCallback((exerciseId, score, total) => {
        setProgress(prev => {
            const today = new Date().toISOString().split('T')[0]
            const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
            let newStreak = prev.streak
            if (prev.lastActivityDate === yesterday) {
                newStreak += 1
            } else if (prev.lastActivityDate !== today) {
                newStreak = 1
            }
            const xpEarned = Math.round((score / total) * 20)
            const alreadyCompleted = prev.completedExercises.includes(exerciseId)
            return {
                ...prev,
                xp: prev.xp + (alreadyCompleted ? 0 : xpEarned),
                streak: newStreak,
                lastActivityDate: today,
                completedExercises: alreadyCompleted
                    ? prev.completedExercises
                    : [...prev.completedExercises, exerciseId],
                unitScores: {
                    ...prev.unitScores,
                    [exerciseId]: { score, total }
                }
            }
        })
    }, [])

    const masterVocab = useCallback((wordId) => {
        setProgress(prev => {
            if (prev.vocabMastered.includes(wordId)) return prev
            return {
                ...prev,
                xp: prev.xp + 2,
                vocabMastered: [...prev.vocabMastered, wordId]
            }
        })
    }, [])

    const getUnitProgress = useCallback((unitId) => {
        const unitPrefix = `${unitId}-`
        const lessons = progress.completedLessons.filter(l => l.startsWith(unitPrefix) || l.startsWith(`${unitId}.`))
        const exercises = progress.completedExercises.filter(e => e.startsWith(`ex-${unitId}-`))
        return { lessons: lessons.length, exercises: exercises.length }
    }, [progress])

    const isUnitUnlocked = useCallback((unitId) => {
        if (unitId === 1) return true
        const prevUnit = unitId - 1
        const prevProgress = getUnitProgress(prevUnit)
        return prevProgress.lessons >= 3 || prevProgress.exercises >= 2
    }, [getUnitProgress])

    const resetProgress = useCallback(() => {
        setProgress(defaultProgress)
        localStorage.removeItem(STORAGE_KEY)
    }, [])

    return {
        progress,
        completeLesson,
        completeExercise,
        masterVocab,
        getUnitProgress,
        isUnitUnlocked,
        resetProgress
    }
}
