import { Cita } from './Cita';

export interface IAgendaService {
    agendarCita(cita: Cita): void;
    consultarCitas(): Cita[];
}