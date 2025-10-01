import { Atencion } from './Atencion';

export interface IAtencionRepository {
    guardar(atencion: Atencion): void;
    buscarPorId(id: number): Atencion | null;
}