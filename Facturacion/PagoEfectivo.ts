import { IPago } from './IPago';

export class PagoEfectivo implements IPago {
    procesarPago(monto: number): boolean {
        console.log(`Procesando pago en efectivo por $${monto}`);
        return true;
    }
}