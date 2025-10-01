import { IPrecioStrategy } from './IPrecioStrategy';

export class PrecioPorClinica implements IPrecioStrategy {
    constructor(private descuento: number) {}

    calcularPrecio(precioBase: number): number {
        return precioBase * (1 - this.descuento);
    }
}