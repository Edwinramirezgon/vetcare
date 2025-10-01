import { IPago } from './IPago';

/**
 * Clase PagoTarjetaAdapter - Implementación del patrón Adapter
 * 
 * PRINCIPIOS SOLID CUMPLIDOS:
 * - SRP: Responsabilidad única de adaptar pagos con tarjeta
 * - OCP: Extensible sin modificar código existente
 * - LSP: Sustituible por cualquier implementación de IPago
 * - ISP: Implementa solo interfaz necesaria
 * - DIP: Depende de abstracción IPago
 * 
 * PRINCIPIOS GRASP CUMPLIDOS:
 * - Indirection: Proporciona indirección entre sistema y API externa
 * - Pure Fabrication: Clase creada para resolver problema de adaptación
 * - Low Coupling: Desacopla sistema de API de tarjetas
 * - Polymorphism: Intercambiable con otros métodos de pago
 * 
 * SIN ESTA CLASE SE ROMPERÍA:
 * - DIP: Si el sistema dependiera directamente de API de tarjetas
 * - Indirection: Si no hubiera capa de abstracción
 */
export class PagoTarjetaAdapter implements IPago {
    private intentosMaximos: number = 3;
    private tiempoEspera: number = 5000; // 5 segundos

    // Indirection: Adapta interfaz externa a interfaz interna
    procesarPago(monto: number): boolean {
        console.log(`Procesando pago con tarjeta por $${monto}`);
        
        if (!this.validarMonto(monto)) {
            console.log('Monto inválido para pago con tarjeta');
            return false;
        }

        return this.procesarConReintentos(monto);
    }

    // Pure Fabrication: Lógica de reintentos
    private procesarConReintentos(monto: number): boolean {
        for (let intento = 1; intento <= this.intentosMaximos; intento++) {
            console.log(`Intento ${intento} de ${this.intentosMaximos}`);
            
            if (this.procesarTarjeta(monto)) {
                console.log('Pago con tarjeta exitoso');
                return true;
            }
            
            if (intento < this.intentosMaximos) {
                console.log(`Reintentando en ${this.tiempoEspera}ms...`);
                // En un caso real, aquí habría un delay
            }
        }
        
        console.log('Pago con tarjeta fallido después de todos los intentos');
        return false;
    }

    // Indirection: Simula llamada a API externa de tarjetas
    private procesarTarjeta(monto: number): boolean {
        // Simulación de procesamiento de tarjeta
        const exito = Math.random() > 0.2; // 80% de éxito
        
        if (exito) {
            this.registrarTransaccion(monto);
        }
        
        return exito;
    }

    // Pure Fabrication: Validación específica para tarjetas
    private validarMonto(monto: number): boolean {
        return monto > 0 && monto <= 50000; // Límite de $50,000
    }

    // Pure Fabrication: Registro de transacción
    private registrarTransaccion(monto: number): void {
        const numeroTransaccion = this.generarNumeroTransaccion();
        console.log(`Transacción registrada: ${numeroTransaccion} por $${monto}`);
    }

    // Pure Fabrication: Genera número de transacción único
    private generarNumeroTransaccion(): string {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        return `TXN-${timestamp}-${random}`;
    }

    // Information Expert: Obtiene límite de transacción
    obtenerLimiteTransaccion(): number {
        return 50000;
    }

    // Pure Fabrication: Configura parámetros del adapter
    configurarParametros(intentos: number, tiempoEspera: number): void {
        this.intentosMaximos = intentos;
        this.tiempoEspera = tiempoEspera;
    }
}