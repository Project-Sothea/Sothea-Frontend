export default interface SocialHistory {
    id?: number
    vid?: number
    pastSmokingHistory: boolean
    numberOfYears: number | null
    currentSmokingHistory: boolean
    cigarettesPerDay: number | null
    alcoholHistory: boolean
    howRegular: string | null
}