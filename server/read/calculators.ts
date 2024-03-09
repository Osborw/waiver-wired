import { round } from 'mathjs'
import { FantasyStats } from '../../shared/types'

export const calculatePPR = (data: Partial<FantasyStats>) => {

    let ptsPPR = 
    (data.passYd || 0) * .04 +
    (data.passTd || 0) * 4 +
    (data.pass2pt || 0) * 2 +
    (data.passInt || 0) * -1 +
    (data.rushYd || 0) * .1 +
    (data.rushTd || 0) * 6 +
    (data.rush2pt || 0) * 2 +
    (data.rec || 0) * 1 +
    (data.recYd || 0) * .1 +
    (data.recTd || 0) * 6 +
    (data.rec2pt || 0) * 2 +
    (data.fgm0_19 || 0) * 3 +
    (data.fgm20_29 || 0) * 3 +
    (data.fgm30_39 || 0) * 3 +
    (data.fgm40_49 || 0) * 4 +
    (data.fgm50p || 0) * 5 +
    (data.xpm || 0) * 1 +
    (data.fgMiss || 0) * -1 +
    (data.xpMiss || 0) * -1 +
    (data.fum || 0) * -1

    ptsPPR = round((ptsPPR + Number.EPSILON) * 100) / 100
    return ptsPPR
}

export const calculateDefPPR = (data: Partial<FantasyStats>) => {

    let ptsPPR = 
    (data.ptsAllow0 || 0) * 10 + 
    (data.ptsAllow1_6 || 0) * 7 + 
    (data.ptsAllow7_13 || 0) * 4 + 
    (data.ptsAllow14_20 || 0) + 
    (data.ptsAllow28_34 || 0) * -1 + 
    (data.ptsAllow35p || 0) * -4 + 
    (data.defStFF || 0) +
    (data.ff || 0) + 
    (data.fumRec || 0) * 2 + 
    (data.int || 0) * 2 + 
    (data.sack || 0) + 
    (data.defTd || 0) * 6 + 
    (data.defStTd|| 0) * 6 + 
    (data.safe || 0) * 2 + 
    (data.def2Pt || 0) * 2

    return ptsPPR
}