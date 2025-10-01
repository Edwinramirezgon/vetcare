import { OrdenVenta } from './OrdenVenta';
import { IPago } from './IPago';

export class Factura {
    constructor(
        public id: number,
        public fecha: Date,
        public ordenVenta: OrdenVenta,
        public metodoPago: IPago,
        public total: number
    ) {}

    procesarPago(): boolean {
        return this.metodoPago.procesarPago(this.total);
    }
}