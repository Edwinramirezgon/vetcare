import { Factura } from './Factura';
import { OrdenVenta } from './OrdenVenta';

export interface IFacturacionService {
    generarFactura(ordenVenta: OrdenVenta): Factura;
    procesarPago(factura: Factura): boolean;
}