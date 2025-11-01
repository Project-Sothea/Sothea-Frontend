export default interface FallRisk {
    id?: number
    vid?: number
    sideToSideBalance: number
    semiTandemBalance: number
    tandemBalance: number
    gaitSpeedTest: number
    chairStandTest: number
    fallRiskScore: number
    
    icopeCompleteChairStands: boolean | null
    icopeChairStandsTime: boolean | null
  }
