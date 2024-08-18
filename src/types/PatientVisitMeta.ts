export default interface PatientVisitMeta {
    id?: number
    vid?: number
    familyGroup: string
    regDate: string // ISO date string
    queueNo: string
    name: string
    khmerName: string
    gender: 'M' | 'F'
    village: string
    contactNo: string
    drugAllergies: string | null
    sentToId: boolean
}