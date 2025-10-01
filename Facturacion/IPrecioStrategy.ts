export interface IPrecioStrategy {
    calcularPrecio(precioBase: number): number;
}