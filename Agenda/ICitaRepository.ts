import { Cita } from './Cita';

export interface ICitaRepository {
    guardar(cita: Cita): void;
    buscarPorId(id: number): Cita | null;
    listarTodas(): Cita[];
}