import { ICitaRepository } from './ICitaRepository';
import { Cita } from './Cita';

/**
 * Clase CitaRepositorySql - Implementación del patrón Repository
 * 
 * PRINCIPIOS SOLID CUMPLIDOS:
 * - SRP: Responsabilidad única de persistencia de citas
 * - OCP: Implementa interfaz, extensible sin modificar código
 * - LSP: Sustituible por cualquier implementación de ICitaRepository
 * - ISP: Implementa solo métodos necesarios de la interfaz
 * - DIP: Depende de abstracción (ICitaRepository)
 * 
 * PRINCIPIOS GRASP CUMPLIDOS:
 * - Information Expert: Experto en persistencia de citas
 * - Pure Fabrication: Clase creada para resolver problema de persistencia
 * - Low Coupling: Acoplamiento bajo con el dominio
 * - High Cohesion: Métodos cohesivos de acceso a datos
 * 
 * SIN ESTA CLASE SE ROMPERÍA:
 * - SRP: Si el servicio manejara directamente la persistencia
 * - DIP: Si dependiera de implementación concreta en lugar de interfaz
 */
export class CitaRepositorySql implements ICitaRepository {
    private citas: Cita[] = [];
    private nextId: number = 1;

    // Pure Fabrication: Método especializado en persistencia
    guardar(cita: Cita): void {
        const existente = this.buscarPorId(cita.id);
        if (existente) {
            const index = this.citas.indexOf(existente);
            this.citas[index] = cita;
        } else {
            if (cita.id === 0) {
                cita.id = this.nextId++;
            }
            this.citas.push(cita);
        }
    }

    // Information Expert: Experto en búsqueda de citas
    buscarPorId(id: number): Cita | null {
        return this.citas.find(c => c.id === id) || null;
    }

    // Information Expert: Conoce todas las citas
    listarTodas(): Cita[] {
        return [...this.citas]; // Retorna copia para evitar mutación externa
    }

    // Information Expert: Búsqueda especializada por veterinario
    buscarPorVeterinario(veterinarioId: number): Cita[] {
        return this.citas.filter(c => c.veterinario.id === veterinarioId);
    }

    // Information Expert: Búsqueda por fecha
    buscarPorFecha(fecha: Date): Cita[] {
        return this.citas.filter(c => 
            c.fecha.toDateString() === fecha.toDateString()
        );
    }

    // Pure Fabrication: Operación de eliminación
    eliminar(id: number): boolean {
        const index = this.citas.findIndex(c => c.id === id);
        if (index !== -1) {
            this.citas.splice(index, 1);
            return true;
        }
        return false;
    }
}