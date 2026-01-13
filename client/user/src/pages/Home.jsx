import React from 'react'
import Background from '../components/Home/Backgound'
import Topbar from '../components/Topbar'
import Datefilter from '../components/Datefilter'
import EventCard from '../components/EventCard'
import TopEvent from '../components/TopEvent'
function Home() {
  return (
    <div>
      <Topbar/>
      <Datefilter/>
      <TopEvent/>
      <Background/>
    </div>
  )
}

export default Home