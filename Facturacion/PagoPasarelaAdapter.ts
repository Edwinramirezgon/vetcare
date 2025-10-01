import { IPago } from './IPago';

export class PagoPasarelaAdapter implements IPago {
    procesarPago(monto: number): boolean {
        console.log(`Procesando pago por pasarela por $${monto}`);
        return this.conectarPasarela(monto);
    }

    private conectarPasarela(monto: number): boolean {
        return monto > 0;
    }
}