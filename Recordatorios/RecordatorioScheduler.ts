import { IRecordatorioService } from './IRecordatorioService';

interface Recordatorio {
    id: number;
    mensaje: string;
    fecha: Date;
    tipo: 'cita' | 'vacuna' | 'seguimiento' | 'general';
    enviado: boolean;
    clienteId?: number;
    mascotaId?: number;
}

/**
 * Clase RecordatorioScheduler - Servicio de recordatorios
 * 
 * PRINCIPIOS SOLID CUMPLIDOS:
 * - SRP: Responsabilidad única de manejar recordatorios
 * - OCP: Extensible para nuevos tipos de recordatorios
 * - LSP: Sustituible por otras implementaciones
 * - ISP: Implementa solo interfaz necesaria
 * 
 * PRINCIPIOS GRASP CUMPLIDOS:
 * - Information Expert: Experto en gestión de recordatorios
 * - Controller: Controla el envío de recordatorios
 * - Low Coupling: Mínimas dependencias externas
 * - High Cohesion: Métodos cohesivos de recordatorios
 * 
 * SIN ESTA CLASE SE ROMPERÍA:
 * - SRP: Si otra clase manejara tanto citas como recordatorios
 * - Information Expert: Si el servicio de agenda manejara recordatorios
 */
export class RecordatorioScheduler implements IRecordatorioService {
    private recordatorios: Recordatorio[] = [];
    private nextId: number = 1;
    private intervalos: Map<string, NodeJS.Timeout> = new Map();

    // Controller: Programa un recordatorio
    programarRecordatorio(mensaje: string, fecha: Date, tipo: 'cita' | 'vacuna' | 'seguimiento' | 'general' = 'general'): void {
        const recordatorio: Recordatorio = {
            id: this.nextId++,
            mensaje,
            fecha,
            tipo,
            enviado: false
        };
        
        this.recordatorios.push(recordatorio);
        this.programarEnvioAutomatico(recordatorio);
    }

    // Controller: Envía recordatorios pendientes
    enviarRecordatorios(): void {
        const ahora = new Date();
        const recordatoriosPendientes = this.recordatorios.filter(r => 
            r.fecha <= ahora && !r.enviado
        );
        
        recordatoriosPendientes.forEach(recordatorio => {
            this.enviarRecordatorio(recordatorio);
        });
    }

    // Pure Fabrication: Programa recordatorio específico para cita
    programarRecordatorioCita(citaId: number, mascotaId: number, clienteId: number, fechaCita: Date): void {
        const fechaRecordatorio = new Date(fechaCita);
        fechaRecordatorio.setDate(fechaRecordatorio.getDate() - 1);
        fechaRecordatorio.setHours(10, 0, 0, 0); // 10:00 AM del día anterior
        
        const recordatorio: Recordatorio = {
            id: this.nextId++,
            mensaje: `Recordatorio: Mañana tiene cita programada para su mascota`,
            fecha: fechaRecordatorio,
            tipo: 'cita',
            enviado: false,
            clienteId,
            mascotaId
        };
        
        this.recordatorios.push(recordatorio);
        this.programarEnvioAutomatico(recordatorio);
    }

    // Pure Fabrication: Programa recordatorio de vacunación
    programarRecordatorioVacuna(mascotaId: number, clienteId: number, tipoVacuna: string, fechaVencimiento: Date): void {
        const fechaRecordatorio = new Date(fechaVencimiento);
        fechaRecordatorio.setDate(fechaRecordatorio.getDate() - 7); // Una semana antes
        
        const recordatorio: Recordatorio = {
            id: this.nextId++,
            mensaje: `Recordatorio: La vacuna ${tipoVacuna} de su mascota vence pronto. Programe una cita.`,
            fecha: fechaRecordatorio,
            tipo: 'vacuna',
            enviado: false,
            clienteId,
            mascotaId
        };
        
        this.recordatorios.push(recordatorio);
        this.programarEnvioAutomatico(recordatorio);
    }

    // Information Expert: Obtiene recordatorios por tipo
    obtenerRecordatoriosPorTipo(tipo: string): Recordatorio[] {
        return this.recordatorios.filter(r => r.tipo === tipo);
    }

    // Information Expert: Obtiene recordatorios pendientes
    obtenerRecordatoriosPendientes(): Recordatorio[] {
        return this.recordatorios.filter(r => !r.enviado);
    }

    // Controller: Cancela un recordatorio
    cancelarRecordatorio(id: number): boolean {
        const index = this.recordatorios.findIndex(r => r.id === id);
        if (index !== -1) {
            const recordatorio = this.recordatorios[index];
            
            // Cancelar envío automático si existe
            const intervalKey = `recordatorio_${recordatorio.id}`;
            const interval = this.intervalos.get(intervalKey);
            if (interval) {
                clearTimeout(interval);
                this.intervalos.delete(intervalKey);
            }
            
            this.recordatorios.splice(index, 1);
            return true;
        }
        return false;
    }

    // Pure Fabrication: Programa envío automático
    private programarEnvioAutomatico(recordatorio: Recordatorio): void {
        const ahora = new Date();
        const tiempoEspera = recordatorio.fecha.getTime() - ahora.getTime();
        
        if (tiempoEspera > 0) {
            const intervalKey = `recordatorio_${recordatorio.id}`;
            const timeout = setTimeout(() => {
                this.enviarRecordatorio(recordatorio);
                this.intervalos.delete(intervalKey);
            }, tiempoEspera);
            
            this.intervalos.set(intervalKey, timeout);
        }
    }

    // Pure Fabrication: Envía un recordatorio específico
    private enviarRecordatorio(recordatorio: Recordatorio): void {
        console.log(`[${recordatorio.tipo.toUpperCase()}] ${recordatorio.mensaje}`);
        
        // Simular envío por diferentes canales según el tipo
        switch (recordatorio.tipo) {
            case 'cita':
                this.enviarSMS(recordatorio);
                break;
            case 'vacuna':
                this.enviarEmail(recordatorio);
                break;
            default:
                this.enviarNotificacion(recordatorio);
        }
        
        recordatorio.enviado = true;
    }

    // Pure Fabrication: Simula envío de SMS
    private enviarSMS(recordatorio: Recordatorio): void {
        console.log(`SMS enviado: ${recordatorio.mensaje}`);
    }

    // Pure Fabrication: Simula envío de email
    private enviarEmail(recordatorio: Recordatorio): void {
        console.log(`Email enviado: ${recordatorio.mensaje}`);
    }

    // Pure Fabrication: Simula notificación push
    private enviarNotificacion(recordatorio: Recordatorio): void {
        console.log(`Notificación: ${recordatorio.mensaje}`);
    }

    // Information Expert: Genera reporte de recordatorios
    generarReporte(): string {
        const total = this.recordatorios.length;
        const enviados = this.recordatorios.filter(r => r.enviado).length;
        const pendientes = total - enviados;
        
        let reporte = `REPORTE DE RECORDATORIOS\n`;
        reporte += `Total: ${total}\n`;
        reporte += `Enviados: ${enviados}\n`;
        reporte += `Pendientes: ${pendientes}\n\n`;
        
        // Estadísticas por tipo
        const tiposCount = this.recordatorios.reduce((acc, r) => {
            acc[r.tipo] = (acc[r.tipo] || 0) + 1;
            return acc;
        }, {} as { [key: string]: number });
        
        reporte += 'Por tipo:\n';
        Object.entries(tiposCount).forEach(([tipo, count]) => {
            reporte += `- ${tipo}: ${count}\n`;
        });
        
        return reporte;
    }
}