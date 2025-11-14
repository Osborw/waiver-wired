import React, { useEffect, useState } from 'react'
import { CalculatedPlayer, Roster, SearchPosition } from '../../../shared/types'
import { RosterList } from '../components/trades/RosterList'
import { OfferList } from '../components/trades/OfferList'
import s from './trades.module.scss'
import { TradeRoom, TradeRoomPartnerId, createTradeRoom } from '../logic/trade/trade-room'
import { addPlayerToRemaining, addPlayerToTradeRoster, removePlayerFromRemaining, removePlayerFromTradeRoster } from '../logic/trade/base-trade-roster'

interface TradesProps {
  rosters: Roster[]
  userId: string
  leagueRosterSpots: SearchPosition[]
}

export const Trades = ({ rosters, userId, leagueRosterSpots }: TradesProps) => {
  const [tradeRooms, setTradeRooms] = useState<Map<TradeRoomPartnerId, TradeRoom>>()
  const [selectedTradeRoom, setSelectedTradeRoom] = useState<TradeRoom>()

  const initTradeRooms = () => {
    const userRoster = rosters.find((roster) => roster.ownerId === userId)

    if (!userRoster) {
      console.error('No user roster available! Cannot initiate trade screen')
      return
    }

    const newTradeRooms = new Map<TradeRoomPartnerId, TradeRoom>()
    rosters.forEach((roster) => {
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

  const addPlayerToOfferList = (tradeRoom: TradeRoom, player: CalculatedPlayer, ownerId: string) => {
    const isUser = ownerId === tradeRoom.userOwnerId
    const tradeRoster = isUser ? tradeRoom.userTradeRoster : tradeRoom.partnerTradeRoster
    const oppTradeRoster = isUser ? tradeRoom.partnerTradeRoster : tradeRoom.userTradeRoster

    //edit trade rosters to include/exclude that player
    removePlayerFromTradeRoster(tradeRoster, player, tradeRoom.leagueRosterSpots)
    removePlayerFromRemaining(tradeRoster, player, tradeRoom.leagueRosterSpots)
    addPlayerToTradeRoster(oppTradeRoster, player, tradeRoom.leagueRosterSpots)

    //Add player to offer list
    if (isUser) tradeRoom.userOfferedPlayers.push(player)
    else tradeRoom.partnerOfferedPlayers.push(player)

    console.log('do the thing')
    setSelectedTradeRoom(structuredClone(tradeRoom))
  }

  const removePlayerFromOfferList = (tradeRoom: TradeRoom, player: CalculatedPlayer, ownerId: string) => {
    const isUser = ownerId === tradeRoom.userOwnerId
    const tradeRoster = isUser ? tradeRoom.userTradeRoster : tradeRoom.partnerTradeRoster
    const oppTradeRoster = isUser ? tradeRoom.partnerTradeRoster : tradeRoom.userTradeRoster

    //edit trade rosters to include/exclude that player
    removePlayerFromTradeRoster(oppTradeRoster, player, tradeRoom.leagueRosterSpots)
    addPlayerToTradeRoster(tradeRoster, player, tradeRoom.leagueRosterSpots)
    addPlayerToRemaining(tradeRoster, player, tradeRoom.leagueRosterSpots)

    //Remove player from offer list
    if (isUser) tradeRoom.userOfferedPlayers = tradeRoom.userOfferedPlayers.filter((p) => p.id !== player.id)
    else tradeRoom.partnerOfferedPlayers = tradeRoom.partnerOfferedPlayers.filter((p) => p.id !== player.id)
    console.log('do the thing')
    setSelectedTradeRoom(structuredClone(tradeRoom))
  }

  if (!selectedTradeRoom) return <div>No selected Trade Room</div>

  return (
    <div className={s.trade_screen}>
      <h2>Trade Builder</h2>
      <div className={s.trade_builder}>
        <RosterList ownerId={userId} tradeRoom={selectedTradeRoom} leagueRosterSpots={leagueRosterSpots} addPlayerToOfferList={addPlayerToOfferList} />
        <OfferList ownerId={userId} tradeRoom={selectedTradeRoom} leagueRosterSpots={leagueRosterSpots} removePlayerFromOfferList={removePlayerFromOfferList} />
        <div className={s.arrow}>{'<-->'}</div>
        <OfferList
          ownerId={selectedTradeRoom.partnerOwnerId}
          tradeRoom={selectedTradeRoom}
          leagueRosterSpots={leagueRosterSpots}
          removePlayerFromOfferList={removePlayerFromOfferList}
        />
        <RosterList
          ownerId={selectedTradeRoom.partnerOwnerId}
          tradeRoom={selectedTradeRoom}
          changeTradeRooms={changeTradeRooms}
          allTradeRooms={tradeRooms ? Array.from(tradeRooms.values()) : undefined}
          leagueRosterSpots={leagueRosterSpots}
          addPlayerToOfferList={addPlayerToOfferList}
        />
      </div>
    </div>
  )
}
