import { IInventarioRepository } from './IInventarioRepository';
import { Inventario } from '../Atencion/Inventario';

export class InventarioRepositorySql implements IInventarioRepository {
    private inventarios: Inventario[] = [];

    guardar(inventario: Inventario): void {
        this.inventarios.push(inventario);
    }

    buscarPorProducto(producto: string): Inventario | null {
        return this.inventarios.find(i => i.producto === producto) || null;
    }

    actualizarCantidad(id: number, cantidad: number): void {
        const inventario = this.inventarios.find(i => i.id === id);
        if (inventario) {
            inventario.cantidadDisponible = cantidad;
        }
    }
}