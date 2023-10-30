import React, { useState, useEffect } from 'react'
import Layout from '../components/MyLayout'
import { RosterTable } from '../components/PlayerTable'
import * as Get from '../server/getIndex'
import { Roster, RosterStat, Trade } from '../../shared/types'
import { styled } from 'styled-components'

const TradeDiv = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 20px;
  border-style: solid;
  border-width: 1px;
`

const PlayerDiv = styled.div`
  display: flex;
  flex-direction: column;
  margin: 5px;
`

const ImprovementDiv = styled.div`
  display: flex;
  align-items: flex-end;
`

const Index = () => {
  const [rosters, setRosters] = useState<Roster[]>([])
  const [trades, setTrades] = useState<Trade[]>([])
  const [ownerId, setOwnerId] = useState<string | undefined>()

  useEffect(() => {
    const init = async () => {
      await getTrades()
    }
    init()
  }, [])

  const getTrades = async () => {
    const ret = await Get.getTrades()
    setRosters(ret.rosters)
    setTrades(ret.trades)
    console.log(ret.trades)
    setOwnerId(ret.ownerId)
  }

  return (
    <Layout>
      <h2> Trades </h2>
      <div>
        {trades.map((t) => {
          return (
            <TradeDiv>
              <PlayerDiv>
                {t.team1Players.map((p) => (
                  <div>{p.fullName}</div>
                ))}
                <ImprovementDiv>{t.team1Improvement.toFixed(1)}</ImprovementDiv>
              </PlayerDiv>
              <PlayerDiv>{`------------------->`}</PlayerDiv>
              <PlayerDiv>
                {t.team2Players.map((p) => (
                  <div>{p.fullName}</div>
                ))}
                <ImprovementDiv>{t.team2Improvement.toFixed(1)}</ImprovementDiv>
              </PlayerDiv>
            </TradeDiv>
          )
        })}
      </div>
    </Layout>
  )
}

export default Index
