import { Routes, Route } from 'react-router'
import { useState, useEffect } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Product from './pages/Product'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import Journal from './pages/Journal'
import JournalPost from './pages/JournalPost'
import Community from './pages/Community'
import About from './pages/About'
import Contact from './pages/Contact'
import Admin from './pages/Admin'

export default function App() {
  const [cartOpen, setCartOpen] = useState(false)
  const [sessionId] = useState(() => {
    let sid = localStorage.getItem('message_session_id')
    if (!sid) {
      sid = crypto.randomUUID()
      localStorage.setItem('message_session_id', sid)
    }
    return sid
  })

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [window.location.pathname])

  return (
    <div className="min-h-screen bg-black text-white">
      <Header onCartClick={() => setCartOpen(true)} sessionId={sessionId} />
      <main>
        <Routes>
          <Route path="/" element={<Home sessionId={sessionId} />} />
          <Route path="/shop" element={<Shop sessionId={sessionId} />} />
          <Route path="/shop/:slug" element={<Product sessionId={sessionId} />} />
          <Route path="/checkout" element={<Checkout sessionId={sessionId} />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/journal/:slug" element={<JournalPost />} />
          <Route path="/community" element={<Community />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <Footer />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} sessionId={sessionId} />
    </div>
  )
}
