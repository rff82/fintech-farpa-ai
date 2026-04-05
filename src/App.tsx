import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Museum from './pages/Museum'
import Simulator from './pages/Simulator'
import Search from './pages/Search'
import Genes from './pages/Genes'
import ClinicalTrials from './pages/ClinicalTrials'
import Analytics from './pages/Analytics'
import Admin from './pages/Admin'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/museum" element={<Museum />} />
        <Route path="/simulator" element={<Simulator />} />
        <Route path="/search" element={<Search />} />
        <Route path="/genes" element={<Genes />} />
        <Route path="/clinical-trials" element={<ClinicalTrials />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
