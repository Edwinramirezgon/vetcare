/**
 * Clase Veterinario - Entidad del dominio
 * 
 * PRINCIPIOS SOLID CUMPLIDOS:
 * - SRP: Responsabilidad única de representar un veterinario
 * - OCP: Extensible para nuevas especialidades sin modificar código existente
 * - ISP: No depende de interfaces que no usa
 * 
 * PRINCIPIOS GRASP CUMPLIDOS:
 * - Information Expert: Conoce su disponibilidad y especialidades
 * - Low Coupling: No depende de otras entidades del dominio
 * - High Cohesion: Métodos cohesivos relacionados con veterinario
 * 
 * SIN ESTA CLASE SE ROMPERÍA:
 * - SRP: Si mezcláramos datos del veterinario con lógica de agenda
 * - Information Expert: Si otra clase determinara la disponibilidad del veterinario
 */
export class Veterinario {
    private disponible: boolean = true;
    private horarioInicio: string = "08:00";
    private horarioFin: string = "18:00";

    constructor(
        public id: number,
        public nombre: string,
        public especialidad: string,
        public telefono: string
    ) {}

    // Information Expert: El veterinario conoce su disponibilidad
    estaDisponible(): boolean {
        return this.disponible;
    }

    // SRP: Método específico para cambiar disponibilidad
    cambiarDisponibilidad(disponible: boolean): void {
        this.disponible = disponible;
    }

    // Information Expert: El veterinario sabe si puede atender una especie
    puedeAtenderEspecie(especie: string): boolean {
        return this.especialidad === "Medicina General" || 
               this.especialidad.toLowerCase().includes(especie.toLowerCase());
    }

    // Information Expert: El veterinario conoce su horario
    estaEnHorario(hora: string): boolean {
        return hora >= this.horarioInicio && hora <= this.horarioFin;
    }

    // SRP: Método para obtener información completa
    obtenerInformacion(): string {
        return `Dr. ${this.nombre} - ${this.especialidad} (${this.telefono})`;
    }
}