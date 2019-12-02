import React, { useState, useEffect } from 'react';
import Layout from '../components/MyLayout';
import PositionSelector from '../components/PositionSelector'
import Row from '../components/Row'
import * as Get from '../db/getStuff'

const Index = () =>  {

  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const init = async () => {
      setPlayers(await setInitialList())
    }
    init();
  }, [])

  const getNewTop50 = async (position) => {
    const ret = await Get.top50(position)
    setPlayers(ret)
  }

  return (
    <Layout>
      <p>Hello Next.js</p>
      <PositionSelector onClick={getNewTop50} />
      {players.map((p, idx) => {
        return <Row key={idx+1} rank={idx+1} name={p.name} position={p.position} avg={p.avgPoints}/>
      })}
    </Layout>
  )
}

const setInitialList = async () => {
  const initialPos = 'QB'
  const ret = await Get.top50(initialPos)
  return ret
}


export default Index; 