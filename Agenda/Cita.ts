import { Mascota } from './Mascota';
import { Veterinario } from './Veterinario';

/**
 * Clase Cita - Entidad de agregación
 * 
 * PRINCIPIOS SOLID CUMPLIDOS:
 * - SRP: Responsabilidad única de manejar información de citas
 * - OCP: Extensible para nuevos tipos de citas
 * - DIP: Depende de abstracciones (Mascota, Veterinario) no de implementaciones
 * 
 * PRINCIPIOS GRASP CUMPLIDOS:
 * - Information Expert: Conoce su estado y puede validarse
 * - Controller: Controla la lógica de negocio de la cita
 * - Low Coupling: Usa composición en lugar de herencia
 * - High Cohesion: Métodos relacionados con el ciclo de vida de la cita
 * 
 * SIN ESTA CLASE SE ROMPERÍA:
 * - SRP: Si mezcláramos lógica de cita con lógica de mascota o veterinario
 * - Controller: Si otra clase manejara el estado de las citas
 */
export class Cita {
    private estado: 'programada' | 'confirmada' | 'completada' | 'cancelada' = 'programada';
    private observaciones: string = '';

    constructor(
        public id: number,
        public fecha: Date,
        public hora: string,
        public motivo: string,
        public mascota: Mascota,
        public veterinario: Veterinario
    ) {}

    // Information Expert: La cita conoce su estado
    obtenerEstado(): string {
        return this.estado;
    }

    // Controller: Controla el cambio de estado de la cita
    confirmar(): boolean {
        if (this.estado === 'programada') {
            this.estado = 'confirmada';
            return true;
        }
        return false;
    }

    // Controller: Controla la finalización de la cita
    completar(observaciones: string): boolean {
        if (this.estado === 'confirmada') {
            this.estado = 'completada';
            this.observaciones = observaciones;
            return true;
        }
        return false;
    }

    // Controller: Controla la cancelación
    cancelar(): boolean {
        if (this.estado !== 'completada') {
            this.estado = 'cancelada';
            return true;
        }
        return false;
    }

    // Information Expert: La cita sabe si es válida
    esValida(): boolean {
        return this.mascota.esValida() && 
               this.veterinario.estaDisponible() &&
               this.veterinario.puedeAtenderEspecie(this.mascota.especie) &&
               this.veterinario.estaEnHorario(this.hora);
    }

    // Information Expert: Calcula duración estimada según motivo
    obtenerDuracionEstimada(): number {
        const duraciones: { [key: string]: number } = {
            'consulta': 30,
            'vacunacion': 15,
            'cirugia': 120,
            'revision': 20
        };
        return duraciones[this.motivo.toLowerCase()] || 30;
    }
}