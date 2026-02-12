import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useProgress } from './hooks/useProgress'
import Layout from './components/Layout'
import UnitMap from './components/UnitMap'
import LessonView from './components/LessonView'
import ExerciseView from './components/ExerciseView'
import UnitOverview from './components/UnitOverview'

function App() {
    const progressHook = useProgress()

    return (
        <BrowserRouter>
            <Layout progress={progressHook.progress}>
                <Routes>
                    <Route path="/" element={<UnitMap progressHook={progressHook} />} />
                    <Route path="/unit/:unitId" element={<UnitOverview progressHook={progressHook} />} />
                    <Route path="/unit/:unitId/lesson/:sectionId" element={<LessonView progressHook={progressHook} />} />
                    <Route path="/unit/:unitId/exercise/:exerciseId" element={<ExerciseView progressHook={progressHook} />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    )
}

export default App
