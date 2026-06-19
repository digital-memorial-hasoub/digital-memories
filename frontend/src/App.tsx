import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import VictimPage from './pages/VictimPage'
import MapPage from './pages/MapPage'
import SearchPage from './pages/SearchPage'
import { AdminAuthProvider } from './contexts/AdminAuthContext'
import AdminLogin from './pages/admin/AdminLogin'
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminVictimsList from './pages/admin/AdminVictimsList'
import AdminVictimForm from './pages/admin/AdminVictimForm'
import AdminTestimonials from './pages/admin/AdminTestimonials'

function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/"            element={<Home />} />
          <Route path="/victims"     element={<SearchPage />} />
          <Route path="/victims/:id" element={<VictimPage />} />
          <Route path="/map"         element={<MapPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <Routes>
          {/* Admin routes — no public Header/Footer */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="victims" element={<AdminVictimsList />} />
            <Route path="victims/new" element={<AdminVictimForm />} />
            <Route path="victims/:id/edit" element={<AdminVictimForm />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
          </Route>

          {/* Public site — Header + Footer wrapper */}
          <Route path="/*" element={<PublicLayout />} />
        </Routes>
      </AdminAuthProvider>
    </BrowserRouter>
  )
}
