export enum EligiblePositions {
    QB,
    RB,
    WR,
    TE,
    K,
    DEF,
    FLEX,
    NA
}

enum Status {
    Active,
    Inactive,
    Injured_Reserve
}

enum InjuryStatus {
    Questionable,
    Doubtful,
    Out,
    IR,
    PUP,
    Sus,
    NA,
}

export interface RawPlayer {
    position: string | null
    full_name: string | undefined
    first_name: string
    last_name: string
    team: string | null
    status: Status 
    injury_status: InjuryStatus | null
    active: boolean
    age: number | null
    years_exp: number | null
    number: number | null
    height: string | null
    weight: string | null
    depth_chart_position: string | null 
    depth_chart_order: number | null
    fantasy_data_id: number | null
    stats_id: number | null
    espn_id: number | null
    search_rank: number | null
    fantasy_positions: string[] | null
}

export interface Player {
  id: string
  name: string,
  team: string,
  position: EligiblePositions,
  fantasy_position: EligiblePositions,
  status: Status 
  injury_status: InjuryStatus | null
  active: boolean,
  age: number,
  years_exp: number,
  number: number,
  height: string | null,
  weight: string | null,
  depth_chart_position: EligiblePositions,
  depth_chart_order: number | null,
  search_rank: number,
  fantasy_data_id: number,
  stats_id: number,
  espn_id: number,
  owner_id: string 
}

export interface Defense {
  id: string
  name: string,
  team: string,
  position: EligiblePositions,
  fantasy_position: EligiblePositions,
  active: boolean,
}