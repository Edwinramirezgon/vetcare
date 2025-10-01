import { IOrdenVentaRepository } from './IOrdenVentaRepository';
import { OrdenVenta } from './OrdenVenta';

export class OrdenVentaRepositorySql implements IOrdenVentaRepository {
    private ordenes: OrdenVenta[] = [];

    guardar(orden: OrdenVenta): void {
        this.ordenes.push(orden);
    }

    buscarPorId(id: number): OrdenVenta | null {
        return this.ordenes.find(o => o.id === id) || null;
    }
}