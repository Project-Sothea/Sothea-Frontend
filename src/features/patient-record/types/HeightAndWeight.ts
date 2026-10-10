export default interface HeightAndWeight {
  id?: number
  vid?: number
  height: number
  weight: number

  icopeLostWeightPastMonths: boolean | null
  icopeNoDesireToEat: boolean | null
}
