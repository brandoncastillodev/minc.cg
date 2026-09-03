import './styles/app.sass'
import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom';
import Navbar from './componets/Navbar';
import Footer from './componets/Footer';
import { useEffect, useState } from 'react';

function App() {
  const location = useLocation();
  const [footer, setFooter] = useState(true)

  // article and market page checker
  const isArticlePage = (
      location.pathname.startsWith('/programming/') && 
      location.pathname !== '/programming'
  ) || (
      location.pathname == '/market'
  )

  // footer checker
  useEffect(()=>{
    if(location.pathname.startsWith("/market/")){
      setFooter(false)
    }else{
      setFooter(true)
    }
  },[location.pathname])

  return (
    <div className={isArticlePage ? "wraper article-wrap" :'wraper'}>
      <ScrollRestoration />
      <Navbar />
      <Outlet />
      {footer && <Footer/>}
    </div>
  )
}

export default App;
