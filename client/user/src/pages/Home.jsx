import React from 'react'
import Background from '../components/Home/Backgound'
import Topbar from '../components/Topbar'
import Datefilter from '../components/Datefilter'
import EventCard from '../components/EventCard'
import TopEvent from '../components/TopEvent'
import TopOrganisations from '../components/Toporganiser'
import JoinedEvents from '../components/JoinedEvents'
import TopEvents from '../components/Topevents'
function Home() {
  return (
    <div>
      <Topbar/>
      <TopOrganisations/>
      <TopEvents/>
      <JoinedEvents/>
      <Datefilter/>
      {/* <TopEvent/> */}
      <Background/>
    </div>
  )
}

export default Home