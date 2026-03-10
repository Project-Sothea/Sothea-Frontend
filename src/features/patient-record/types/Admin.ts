export default interface Admin {
  id?: number
  vid?: number
  regDate: Date
  queueNo: string
  pregnant: boolean
  lastMenstrualPeriod: Date | null
  sentToId: boolean
}
