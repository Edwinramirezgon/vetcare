import { OrdenVenta } from './OrdenVenta';

export interface IOrdenVentaRepository {
    guardar(orden: OrdenVenta): void;
    buscarPorId(id: number): OrdenVenta | null;
}