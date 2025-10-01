import { Cita } from '../Agenda/Cita';

/**
 * Clase Atencion - Entidad de dominio
 * 
 * PRINCIPIOS SOLID CUMPLIDOS:
 * - SRP: Responsabilidad única de representar una atención médica
 * - OCP: Extensible para diferentes tipos de atención
 * - DIP: Depende de abstracción (Cita)
 * 
 * PRINCIPIOS GRASP CUMPLIDOS:
 * - Information Expert: Conoce su información médica y puede validarla
 * - Controller: Controla el estado de la atención
 * - Low Coupling: Relación necesaria solo con Cita
 * - High Cohesion: Métodos relacionados con atención médica
 * 
 * SIN ESTA CLASE SE ROMPERÍA:
 * - SRP: Si mezcláramos datos de atención con lógica de citas
 * - Information Expert: Si otra clase manejara la validación médica
 */
export class Atencion {
    private estado: 'iniciada' | 'en_progreso' | 'finalizada' = 'iniciada';
    private medicamentosUsados: string[] = [];
    private observacionesAdicionales: string = '';
    private costoTotal: number = 0;

    constructor(
        public id: number,
        public fecha: Date,
        public diagnostico: string,
        public tratamiento: string,
        public cita: Cita
    ) {}

    // Controller: Controla el inicio de la atención
    iniciarAtencion(): boolean {
        if (this.cita.obtenerEstado() === 'confirmada') {
            this.estado = 'en_progreso';
            this.cita.completar('Atención iniciada');
            return true;
        }
        return false;
    }

    // Controller: Finaliza la atención
    finalizarAtencion(observaciones: string): boolean {
        if (this.estado === 'en_progreso') {
            this.estado = 'finalizada';
            this.observacionesAdicionales = observaciones;
            return true;
        }
        return false;
    }

    // Information Expert: Agrega medicamento usado
    agregarMedicamento(medicamento: string, costo: number): void {
        this.medicamentosUsados.push(medicamento);
        this.costoTotal += costo;
    }

    // Information Expert: Calcula duración de la atención
    calcularDuracion(): number {
        if (this.estado === 'finalizada') {
            // Simulación de cálculo basado en tratamiento
            const duracionBase = this.cita.obtenerDuracionEstimada();
            return duracionBase + (this.medicamentosUsados.length * 5);
        }
        return 0;
    }

    // Information Expert: Genera resumen de la atención
    generarResumen(): string {
        return `Atención ID: ${this.id}\n` +
               `Mascota: ${this.cita.mascota.obtenerDescripcion()}\n` +
               `Veterinario: ${this.cita.veterinario.obtenerInformacion()}\n` +
               `Diagnóstico: ${this.diagnostico}\n` +
               `Tratamiento: ${this.tratamiento}\n` +
               `Medicamentos: ${this.medicamentosUsados.join(', ')}\n` +
               `Costo Total: $${this.costoTotal}`;
    }

    // Information Expert: Verifica si requiere seguimiento
    requiereSeguimiento(): boolean {
        const tratamientosConSeguimiento = ['cirugia', 'tratamiento prolongado', 'enfermedad crónica'];
        return tratamientosConSeguimiento.some(t => 
            this.tratamiento.toLowerCase().includes(t)
        );
    }

    // Getters para encapsulación
    obtenerEstado(): string { return this.estado; }
    obtenerCostoTotal(): number { return this.costoTotal; }
    obtenerMedicamentos(): string[] { return [...this.medicamentosUsados]; }
}