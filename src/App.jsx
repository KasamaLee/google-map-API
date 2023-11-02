import { useState, useMemo } from 'react'
import './App.css'

// npm i @react-google-maps/api    
import { GoogleMap, useLoadScript, MarkerF } from '@react-google-maps/api'
import PlacesAutoComplete from "./PlacesAutoComplete"

import Map from './Map';


// const center = { lat: 13.7462, lng: 100.5347 }

function App() {

  const [user, admin] = useState({name: 'John', role: ''})

  const data = [
    { lat: 13.758200, lng: 100.540000, title: 'ตี๋น้อย' },
    { lat: 13.762000, lng: 100.5352833, title: 'after you' },
    { lat: 13.755000, lng: 100.532000, title: 'ถ้วยถัง' },
    { lat: 13.760000, lng: 100.530000, title: 'อี้จาสุกี้หม่าล่า' },
    { lat: 13.751000, lng: 100.538000, title: 'นักล่าหมูกระทะ' },
    { lat: 13.748000, lng: 100.550000, title: 'bar b gon' },
    { lat: 13.745000, lng: 100.550000, title: 'ไอติมทุนจีน' },

    { lat: 13.802000, lng: 100.537000, title: '4868.204100256101' },
    { lat: 13.709000, lng: 100.532000, title: '5499.429088629627' },
    { lat: 13.762000, lng: 100.586000, title: '5502.696668591629' },
    { lat: 13.758000, lng: 100.482000, title: '5757.836659596614' },
    { lat: 13.759000, lng: 100.493000, title: 'out of area example' },
    { lat: 13.715000, lng: 100.511000, title: 'out of area example 5' },
    { lat: 13.805000, lng: 100.530000, title: 'out of area example 6' },
    { lat: 13.764000, lng: 100.589000, title: 'out of area example 7' },
]


  return (
    <div className='center'>
      {/* admin ไม่ควร click ย้ายหมุดได้ */}
      {/* <Map viewMode={true} /> */}

      {/* user mode */}
      {/* <Map viewMode={false} /> */}

    {user.role === 'USER'? <Map viewMode= {true} location={{lat: 13.7462, lng: 100.5347}} data={data} /> : <Map viewMode= {false} /> }

    </div>
  )
}

export default App


// เชค clicked ก่อน ถ้า null ไปดู selected 


