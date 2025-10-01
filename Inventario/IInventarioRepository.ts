import { Inventario } from '../Atencion/Inventario';

export interface IInventarioRepository {
    guardar(inventario: Inventario): void;
    buscarPorProducto(producto: string): Inventario | null;
    actualizarCantidad(id: number, cantidad: number): void;
}