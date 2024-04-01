export default interface Course{
    id: number;
    abbrevation: string;
    name: string;
    year: number;
    students: number[];
    guarantorId: number;
}