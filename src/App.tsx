import { Route, Routes } from 'react-router-dom'
import { ExamView } from './views/ExamView'
import './styles/layout.scss';
import './styles/group_manager.scss';
import { ClassesView } from './views/ClassesView';
import HomeView from './views/HomeView';

function App() {
  return (
    <>
      <Routes>
        <Route path="/testovi/:class_id?/:test_id?" element={<ExamView />}></Route>
        <Route path="/predmeti" element={<ClassesView />}></Route>
        <Route path="/" element={<HomeView />}></Route>
        <Route path="*" element={<p>Unknown page.</p>} />
      </Routes>
    </>
  )
}

export default App
