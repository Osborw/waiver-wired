import React, { useEffect, useState } from 'react'
import { CalculatedPlayer, Roster, SearchPosition } from '../../../shared/types'
import { RosterList } from '../components/trades/RosterList'
import { OfferList } from '../components/trades/OfferList'
import s from './trades.module.scss'
import { TradeRoster, addPlayerToRemaining, addPlayerToTradeRoster, createBaseTradeRoster, removePlayerFromRemaining, removePlayerFromTradeRoster } from '../logic/trade/base-trade-roster'
import { TradeRoom, TradeRoomPartnerId, createTradeRoom } from '../logic/trade/trade-room'


interface TradesProps {
  rosters: Roster[]
  userId: string
  leagueRosterSpots: SearchPosition[]
}

export const Trades = ({ rosters, userId, leagueRosterSpots }: TradesProps) => {
  const [tradeRooms, setTradeRooms] = useState<Map<TradeRoomPartnerId, TradeRoom>>()
  const [selectedTradeRoom, setSelectedTradeRoom] = useState<TradeRoom>()

  const initTradeRooms = () => {
    const userRoster = rosters.find(roster => roster.ownerId === userId)

    if (!userRoster) {
      console.error('No user roster available! Cannot initiate trade screen')
      return
    }

    const newTradeRooms = new Map<TradeRoomPartnerId, TradeRoom>() 
    rosters.forEach(roster => {
      if (roster.ownerId === userId) return
      const newTradeRoom = createTradeRoom(userRoster, roster, leagueRosterSpots)
      newTradeRooms.set(roster.ownerId, newTradeRoom)
    })

    setTradeRooms(newTradeRooms)
    const firstTradeRoom = newTradeRooms.values().next().value
    setSelectedTradeRoom(firstTradeRoom)
  }
  
  const changeTradeRooms = (ownerId: string) => {
    const newTradeRoom = tradeRooms?.get(ownerId)
    setSelectedTradeRoom(newTradeRoom)
  }

  useEffect(() => initTradeRooms(), [])

  const removeOwnerPlayerFromOfferList = (player: CalculatedPlayer) => {
    setOwnerOfferedPlayers(current => {
      if(!current) return []
      return current.filter(p => p.id !== player.id) 
    })

    if(!ownerTradeRoster) {
      console.error('Cannot find the owner Trade Roster!')
      return
    }
    if(!oppTradeRoster) {
      console.error('Cannot find the opp Trade Roster!')
      return
    }
    removePlayerFromTradeRoster(oppTradeRoster, player, leagueRosterSpots)
    addPlayerToTradeRoster(ownerTradeRoster, player, leagueRosterSpots)
    addPlayerToRemaining(ownerTradeRoster, player, leagueRosterSpots)
  }

  const removeOppPlayerFromOfferList = (player: CalculatedPlayer) => {
    setOppOfferedPlayers(current => {
      if(!current) return []
      return current.filter(p => p.id !== player.id) 
    })

    if(!oppTradeRoster) {
      console.error('Cannot find the opp Trade Roster!')
      return
    }
    if(!ownerTradeRoster) {
      console.error('Cannot find the owner Trade Roster!')
      return
    }
    removePlayerFromTradeRoster(ownerTradeRoster, player, leagueRosterSpots)
    addPlayerToTradeRoster(oppTradeRoster, player, leagueRosterSpots)
    addPlayerToRemaining(oppTradeRoster, player, leagueRosterSpots)
  }

  if (!selectedTradeRoom) return <div>No selected Trade Room</div>

  return (
    <div className={s.trade_screen}>
      <h2>Trade Builder</h2>
      <div className={s.trade_builder}>
        <RosterList
          ownerId={userId}
          tradeRoom={selectedTradeRoom}
          leagueRosterSpots={leagueRosterSpots}
        />
        <OfferList 
          ownerId={userId}
          tradeRoom={selectedTradeRoom}
          removePlayerFromOfferList={removeOwnerPlayerFromOfferList}
          leagueRosterSpots={leagueRosterSpots}
        />
        <div className={s.arrow}>{'<-->'}</div>
        <OfferList 
          ownerId={selectedTradeRoom.partnerOwnerId}
          tradeRoom={selectedTradeRoom}
          removePlayerFromOfferList={removeOppPlayerFromOfferList}
          leagueRosterSpots={leagueRosterSpots}
        />
        <RosterList
          ownerId={selectedTradeRoom.partnerOwnerId}
          tradeRoom={selectedTradeRoom}
          changeTradeRooms={changeTradeRooms}
          allTradeRooms={tradeRooms}
          leagueRosterSpots={leagueRosterSpots}
        />
      </div>
    </div>
  )
}