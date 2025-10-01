import { IAgendaService } from './IAgendaService';
import { ICitaRepository } from './ICitaRepository';
import { Cita } from './Cita';
import { IRecordatorioService } from '../Recordatorios/IRecordatorioService';

/**
 * Clase AgendaServiceImpl - Servicio de aplicación
 * 
 * PRINCIPIOS SOLID CUMPLIDOS:
 * - SRP: Responsabilidad única de lógica de negocio de agenda
 * - OCP: Extensible mediante herencia o composición
 * - LSP: Sustituible por otras implementaciones de IAgendaService
 * - ISP: Implementa solo interfaz necesaria
 * - DIP: Depende de abstracciones (interfaces) no de implementaciones
 * 
 * PRINCIPIOS GRASP CUMPLIDOS:
 * - Controller: Controla el flujo de operaciones de agenda
 * - Pure Fabrication: Clase creada para coordinar operaciones
 * - Low Coupling: Usa inyección de dependencias
 * - High Cohesion: Métodos relacionados con gestión de agenda
 * - Indirection: Indirección entre UI y persistencia
 * 
 * SIN ESTA CLASE SE ROMPERÍA:
 * - SRP: Si la UI manejara directamente la persistencia
 * - Controller: Si no hubiera coordinación centralizada de operaciones
 */
export class AgendaServiceImpl implements IAgendaService {
    constructor(
        private citaRepository: ICitaRepository,
        private recordatorioService?: IRecordatorioService
    ) {}

    // Controller: Coordina el agendamiento con validaciones
    agendarCita(cita: Cita): void {
        if (!cita.esValida()) {
            throw new Error('Cita inválida');
        }

        if (this.existeConflicto(cita)) {
            throw new Error('Conflicto de horario');
        }

        this.citaRepository.guardar(cita);
        cita.confirmar();
        
        // Programar recordatorio si el servicio está disponible
        if (this.recordatorioService) {
            const fechaRecordatorio = new Date(cita.fecha);
            fechaRecordatorio.setDate(fechaRecordatorio.getDate() - 1);
            this.recordatorioService.programarRecordatorio(
                `Recordatorio: Cita mañana con ${cita.veterinario.nombre}`,
                fechaRecordatorio
            );
        }
    }

    // Controller: Coordina consulta de citas
    consultarCitas(): Cita[] {
        return this.citaRepository.listarTodas();
    }

    // Controller: Lógica de negocio para cancelar cita
    cancelarCita(id: number): boolean {
        const cita = this.citaRepository.buscarPorId(id);
        if (cita && cita.cancelar()) {
            this.citaRepository.guardar(cita);
            return true;
        }
        return false;
    }

    // Controller: Obtener citas por veterinario
    consultarCitasPorVeterinario(veterinarioId: number): Cita[] {
        return this.citaRepository.buscarPorVeterinario(veterinarioId);
    }

    // Controller: Verificar disponibilidad
    verificarDisponibilidad(veterinarioId: number, fecha: Date, hora: string): boolean {
        const citasDelDia = this.citaRepository.buscarPorFecha(fecha);
        return !citasDelDia.some(c => 
            c.veterinario.id === veterinarioId && 
            c.hora === hora &&
            c.obtenerEstado() !== 'cancelada'
        );
    }

    // Pure Fabrication: Lógica para detectar conflictos
    private existeConflicto(nuevaCita: Cita): boolean {
        const citasDelDia = this.citaRepository.buscarPorFecha(nuevaCita.fecha);
        return citasDelDia.some(c => 
            c.veterinario.id === nuevaCita.veterinario.id &&
            c.hora === nuevaCita.hora &&
            c.obtenerEstado() !== 'cancelada'
        );
    }
}