import { Atencion } from './Atencion';

export interface IAtencionService {
    registrarAtencion(atencion: Atencion): void;
    consultarAtencion(id: number): Atencion | null;
}