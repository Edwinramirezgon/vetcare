import { IAtencionService } from './IAtencionService';
import { IAtencionRepository } from './IAtencionRepository';
import { Atencion } from './Atencion';

export class AtencionServiceImpl implements IAtencionService {
    constructor(private atencionRepository: IAtencionRepository) {}

    registrarAtencion(atencion: Atencion): void {
        this.atencionRepository.guardar(atencion);
    }

    consultarAtencion(id: number): Atencion | null {
        return this.atencionRepository.buscarPorId(id);
    }
}