export enum SleeperPosition {
  QB = 'QB',
  RB = 'RB',
  WR = 'WR',
  TE = 'TE',
  K = 'K',
  DEF = 'DEF',
}

export enum SearchPosition {
  QB = 'QB',
  RB = 'RB',
  WR = 'WR',
  TE = 'TE',
  K = 'K',
  DEF = 'DEF',
  FLEX = 'FLEX',
}

export const SearchPositionToSleeperPositionMapper = {
  [SearchPosition.QB]: [SleeperPosition.QB],
  [SearchPosition.RB]: [SleeperPosition.RB],
  [SearchPosition.WR]: [SleeperPosition.WR],
  [SearchPosition.TE]: [SleeperPosition.TE],
  [SearchPosition.DEF]: [SleeperPosition.DEF],
  [SearchPosition.K]: [SleeperPosition.K],
  [SearchPosition.FLEX]: [SleeperPosition.RB, SleeperPosition.WR, SleeperPosition.TE],
}

export enum SleeperInjuryStatus {
  IR = 'IR',
  Out = 'Out',
  Questionable = 'Questionable',
  NA = 'NA',
  PUP = 'PUP',
  Sus = 'SUS',
}

export enum WeekWindow {
  Season = 'season',
  FiveWeek = 'fiveWeek',
}

export interface SleeperUnit {
  fullName: string
  firstName: string
  lastName: string
  active: boolean
  id: string

  position: SleeperPosition
  fantasyPositions: SleeperPosition[]
  team: string
  injuryStatus: SleeperInjuryStatus | null
}

export interface SleeperPlayer extends SleeperUnit {
  age: number | null
  weight: string | null
  height: string | null
  depthChartOrder: number | null
  number: number | null
  yearsExperience: number | null
}

export interface Player {
  id: string
  fullName: string
  firstName: string
  lastName: string
  team: string
  fantasyPositions: SleeperPosition[] | null
  injuryStatus: SleeperInjuryStatus | null

  weeklyStats: WeeklyStats[]
}

export interface WeeklyStats {
  id: string
  weekNumber: number
  gp: number
  weekStats: Partial<FantasyStats>
}

export interface CalculatedWeeklyStats extends WeeklyStats {
  fantasyPoints: number
}

export interface Metrics {
  avgPoints: number
  stdDev: number
  gp: number
}

export interface CalculatedPlayer extends Player {
  fantasyPositions: SleeperPosition[]
  seasonMetrics: Metrics
  fiveWeekMetrics: Metrics
  ownerId: string | null
}

export interface TieredPlayer extends CalculatedPlayer {
  tier: number
  tierDiff?: number
}

export interface RosterStat {
  totalPoints: number
  rank: number
}

export interface PositionRosterStat extends RosterStat {
  position: SearchPosition
}

export interface LineupSlot {
  position: SearchPosition,
  player?: CalculatedPlayer
}

export interface Roster {
  ownerId: string
  ownerName: string
  teamName: string
  starters: Record<string, LineupSlot> 
  fullRoster: CalculatedPlayer[]
  positionRanks: PositionRosterStat[]
  avgPoints: RosterStat
  stdDev: RosterStat
}

export interface Trade {
  team1Owner: string
  team2Owner: string
  team1Players: CalculatedPlayer[]
  team2Players: CalculatedPlayer[]
  team1Improvement: number
  team2Improvement: number
}

export interface FantasyStats {
  weekScore: number

  rankStd: number
  rankPPR: number
  rankHalfPPR: number
  posRankStd: number
  posRankPPR: number
  posRankHalfPPR: number

  ptsStd: number
  ptsPPR: number
  ptsHalfPPR: number
  ptsIdp: number
  kickPts: number

  gp: number
  gmsActive: number
  gs: number

  defSnp: number
  offSnp: number
  stSnp: number
  tmDefSnp: number
  tmOffSnp: number
  tmStSnp: number

  fga: number
  fgblkd: number
  fgm: number
  fgm0_19: number
  fgm20_29: number
  fgm30_39: number
  fgm40_49: number
  fgm50p: number
  fgMiss: number
  fgmiss20_29: number
  fgmiss30_39: number
  fgmiss40_49: number
  fgMiss50p: number
  fgmLng: number
  fgmPct: number
  fgmYds: number
  fgmYdsOver30: number
  xpa: number
  xpm: number
  xpMiss: number

  cmpPct: number
  pass2pt: number
  passAirYd: number
  passAtt: number
  passCmp: number
  passCmp40p: number
  passFd: number
  passInc: number
  passInt: number
  passIntTd: number
  passLng: number
  passRtg: number
  passRushYd: number
  passRZAtt: number
  passSack: number
  passSackYds: number
  passTd: number
  passTd40p: number
  passTd50p: number
  passTdLng: number
  passYd: number
  passYpa: number
  passYpc: number

  rush2pt: number
  rush40p: number
  rushAtt: number
  rushBtkl: number
  rushLng: number
  rushRecYd: number
  rushRZAtt: number
  rushTd: number
  rushTd40p: number
  rushTd50p: number
  rushTdLng: number
  rushTklLoss: number
  rushTklLossYd: number
  rushYac: number
  rushYd: number
  rushYPA: number

  rec: number
  rec0_4: number
  rec10_19: number
  rec20_29: number
  rec2pt: number
  rec30_39: number
  rec40p: number
  rec5_9: number
  recAirYd: number
  recDrop: number
  recFd: number
  recLng: number
  recRzTgt: number
  recTd: number
  recTd40p: number
  recTd50p: number
  recTdLng: number
  recTgt: number
  recYar: number
  recYd: number
  recYpr: number
  recYpt: number

  penalty: number
  penaltyYd: number

  bonusDefFumTd50p: number
  bonusDefIntTd50p: number
  bonusFdQB: number
  bonusFdRB: number
  bonusFdTE: number
  bonusFdWR: number
  bonusPassCmp25: number
  bonusPassYd400: number
  bonusRecRB: number
  bonusRecTE: number
  bonusRecWR: number
  bonusRecYd100: number
  bonusRecYd200: number
  bonusRushAtt20: number
  bonusRushRecYd100: number
  bonusRushRecYd200: number
  bonusRushYd100: number
  bonusRushYd200: number
  bonusSack2p: number
  bonusTkl10p: number

  blkKick: number
  blkKickRetYd: number
  kr: number
  krLng: number
  krYd: number
  krTd: number
  miscRetYd: number
  pr: number
  prLng: number
  prYd: number
  prTd: number
  prYpa: number
  puntBlkd: number
  puntIn20: number
  puntNetYd: number
  punts: number
  puntTb: number
  puntYds: number
  stFF: number
  stFumRec: number
  stTd: number
  stTklSolo: number
  xpBlkd: number

  anytimeTds: number
  ff: number
  ffMisc: number
  fum: number
  fumLost: number
  fumRec: number
  fumRecEzTds: number
  fumRecTd: number
  fumRetYd: number
  spFumbleRecoveries: number
  td: number

  idpBlkKick: number
  idpDefTd: number
  idpFF: number
  idpFumRec: number
  idpFumRetYd: number
  idpInt: number
  idpIntRetYd: number
  idpPassDef: number
  idpPassDef3p: number
  idpQBHit: number
  idpSack: number
  idpSackYd: number
  idpSafe: number
  idpTkl: number
  idpTklAst: number
  idpTklLoss: number
  idpTklSolo: number
  tkl: number
  tklAst: number
  tklAstMisc: number
  tklLoss: number
  tklSolo: number
  tklSoloMisc: number

  def3AndOut: number
  def4AndStop: number
  defForcedPunts: number
  defKr: number
  defKrLng: number
  defKrYd: number
  defKrTd: number
  defKrYpa: number
  defPassDef: number
  defPr: number
  defPrLng: number
  defPrYd: number
  defPrTd: number
  defPrYpa: number
  defStFF: number
  defStFumRec: number
  defStTd: number
  defStTklSolo: number
  defTd: number
  def2Pt: number
  int: number
  intRetYd: number
  ptsAllow: number
  ptsAllow0: number
  ptsAllow1_6: number
  ptsAllow14_20: number
  ptsAllow21_27: number
  ptsAllow28_34: number
  ptsAllow35p: number
  ptsAllow7_13: number
  qbHit: number
  sack: number
  sacks: number
  sackYd: number
  safe: number
  ydsAllow: number
  ydsAllow0_100: number
  ydsAllow100_199: number
  ydsAllow200_299: number
  ydsAllow300_349: number
  ydsAllow350_399: number
  ydsAllow400_449: number
  ydsAllow450_499: number
  ydsAllow500_549: number
  ydsAllow550p: number

  fanPtsAllow: number
  fanPtsAllowK: number
  fanPtsAllowQB: number
  fanPtsAllowRB: number
  fanPtsAllowTE: number
  fanPtsAllowWR: number
}
