import { IAtencionRepository } from './IAtencionRepository';
import { Atencion } from './Atencion';

export class AtencionRepositorySql implements IAtencionRepository {
    private atenciones: Atencion[] = [];

    guardar(atencion: Atencion): void {
        this.atenciones.push(atencion);
    }

    buscarPorId(id: number): Atencion | null {
        return this.atenciones.find(a => a.id === id) || null;
    }
}