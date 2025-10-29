import React, { createContext, useContext, useRef } from 'react'
import Banner from './Banner'
import TopSellers from './TopSellers'
import Recommended from './Recommened'
import News from './News'

// Create context for scroll functionality
const ScrollContext = createContext()

export const useScroll = () => {
  const context = useContext(ScrollContext)
  if (!context) {
    throw new Error('useScroll must be used within a ScrollProvider')
  }
  return context
}

const Home = () => {
  const newsSectionRef = useRef(null)

  const scrollToNewsletter = () => {
    if (newsSectionRef.current) {
      newsSectionRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      })
      
      // Focus on the email input after scrolling
      setTimeout(() => {
        const emailInput = document.getElementById('newsletter-email')
        if (emailInput) {
          emailInput.focus()
        }
      }, 500)
    }
  }

  const scrollToFooter = () => {
    const footer = document.getElementById('main-footer')
    if (footer) {
      footer.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  const scrollValue = {
    scrollToNewsletter,
    scrollToFooter
  }

  return (
    <ScrollContext.Provider value={scrollValue}>
      <div>
        <Banner />
        <TopSellers />
        <Recommended />
        <News ref={newsSectionRef} />
      </div>
    </ScrollContext.Provider>
  )
}

export default Home