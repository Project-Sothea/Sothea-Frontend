export default interface PatientMeta {
    id?: number;
    vid?: number;
    familyGroup: string;
    regDate: string; // ISO date string
    queueNo: string;
    name: string;
    khmerName: string;
    visits: Record<number, string>; // Map of visit id to visit date (ISO date string)
}
  