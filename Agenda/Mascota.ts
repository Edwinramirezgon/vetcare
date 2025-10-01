/**
 * Clase Mascota - Entidad del dominio
 * 
 * PRINCIPIOS SOLID CUMPLIDOS:
 * - SRP: Responsabilidad única de representar una mascota y sus operaciones básicas
 * - OCP: Abierta para extensión (herencia), cerrada para modificación
 * - LSP: Puede ser sustituida por subclases sin romper funcionalidad
 * 
 * PRINCIPIOS GRASP CUMPLIDOS:
 * - Information Expert: Conoce su propia información y puede validarla
 * - Creator: Se crea a sí misma con sus datos
 * - Low Coupling: Mínimas dependencias externas
 * - High Cohesion: Todos sus métodos están relacionados con la mascota
 * 
 * SIN ESTA CLASE SE ROMPERÍA:
 * - SRP: Si mezcláramos datos de mascota con lógica de citas
 * - Information Expert: Si otra clase manejara la validación de datos de mascota
 */
export class Mascota {
    constructor(
        public id: number,
        public nombre: string,
        public especie: string,
        public raza: string,
        public edad: number,
        public propietarioId: number
    ) {}

    // Information Expert: La mascota conoce cómo validarse
    esValida(): boolean {
        return this.nombre.length > 0 && this.edad >= 0;
    }

    // Information Expert: La mascota sabe si es adulta
    esAdulta(): boolean {
        return this.edad >= 1;
    }

    // Information Expert: La mascota puede generar su descripción
    obtenerDescripcion(): string {
        return `${this.nombre} - ${this.especie} ${this.raza}, ${this.edad} años`;
    }

    // SRP: Método específico para actualizar edad
    cumplirAnios(): void {
        this.edad++;
    }
}