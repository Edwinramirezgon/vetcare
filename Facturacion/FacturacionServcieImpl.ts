import { IFacturacionService } from './IFacturacionService';
import { IOrdenVentaRepository } from './IOrdenVentaRepository';
import { Factura } from './Factura';
import { OrdenVenta } from './OrdenVenta';
import { PagoEfectivo } from './PagoEfectivo';
import { IPago } from './IPago';

/**
 * Clase FacturacionServiceImpl - Servicio de aplicación
 * 
 * PRINCIPIOS SOLID CUMPLIDOS:
 * - SRP: Responsabilidad única de lógica de facturación
 * - OCP: Extensible mediante nuevos métodos de pago
 * - LSP: Sustituible por otras implementaciones
 * - ISP: Implementa solo interfaz necesaria
 * - DIP: Depende de abstracciones (interfaces)
 * 
 * PRINCIPIOS GRASP CUMPLIDOS:
 * - Controller: Controla el flujo de facturación
 * - Pure Fabrication: Clase creada para coordinar operaciones
 * - Low Coupling: Usa inyección de dependencias
 * - High Cohesion: Métodos relacionados con facturación
 * - Indirection: Indirección entre UI y persistencia
 * 
 * SIN ESTA CLASE SE ROMPERÍA:
 * - SRP: Si la UI manejara directamente la lógica de facturación
 * - Controller: Si no hubiera coordinación de operaciones de facturación
 */
export class FacturacionServiceImpl implements IFacturacionService {
    private facturas: Factura[] = [];
    private numeroFacturaActual: number = 1;

    constructor(private ordenRepository: IOrdenVentaRepository) {}

    // Controller: Coordina la generación de factura
    generarFactura(ordenVenta: OrdenVenta, metodoPago?: IPago): Factura {
        if (!ordenVenta.tieneItems()) {
            throw new Error('No se puede facturar una orden sin items');
        }

        if (ordenVenta.obtenerEstado() !== 'confirmada') {
            throw new Error('Solo se pueden facturar órdenes confirmadas');
        }

        // Guardar orden si no existe
        this.ordenRepository.guardar(ordenVenta);
        
        // Crear factura
        const factura = new Factura(
            this.numeroFacturaActual++,
            new Date(),
            ordenVenta,
            metodoPago || new PagoEfectivo(),
            ordenVenta.calcularTotal()
        );

        // Marcar orden como facturada
        ordenVenta.marcarComoFacturada();
        this.ordenRepository.guardar(ordenVenta);
        
        // Guardar factura
        this.facturas.push(factura);
        
        return factura;
    }

    // Controller: Procesa el pago de una factura
    procesarPago(factura: Factura): boolean {
        const resultado = factura.procesarPago();
        
        if (resultado) {
            console.log(`Pago procesado exitosamente para factura #${factura.id}`);
            this.registrarPago(factura);
        } else {
            console.log(`Error al procesar pago para factura #${factura.id}`);
        }
        
        return resultado;
    }

    // Pure Fabrication: Busca factura por ID
    buscarFactura(id: number): Factura | null {
        return this.facturas.find(f => f.id === id) || null;
    }

    // Information Expert: Obtiene facturas por rango de fechas
    obtenerFacturasPorFecha(fechaInicio: Date, fechaFin: Date): Factura[] {
        return this.facturas.filter(f => 
            f.fecha >= fechaInicio && f.fecha <= fechaFin
        );
    }

    // Controller: Anula una factura
    anularFactura(id: number, motivo: string): boolean {
        const factura = this.buscarFactura(id);
        if (factura) {
            // Lógica de anulación
            console.log(`Factura #${id} anulada. Motivo: ${motivo}`);
            return true;
        }
        return false;
    }

    // Pure Fabrication: Calcula total de ventas
    calcularTotalVentas(fechaInicio: Date, fechaFin: Date): number {
        const facturas = this.obtenerFacturasPorFecha(fechaInicio, fechaFin);
        return facturas.reduce((total, factura) => total + factura.total, 0);
    }

    // Information Expert: Genera reporte de ventas
    generarReporteVentas(fechaInicio: Date, fechaFin: Date): string {
        const facturas = this.obtenerFacturasPorFecha(fechaInicio, fechaFin);
        const totalVentas = this.calcularTotalVentas(fechaInicio, fechaFin);
        
        let reporte = `REPORTE DE VENTAS\n`;
        reporte += `Periodo: ${fechaInicio.toLocaleDateString()} - ${fechaFin.toLocaleDateString()}\n`;
        reporte += `Total de Facturas: ${facturas.length}\n`;
        reporte += `Total de Ventas: $${totalVentas.toFixed(2)}\n\n`;
        
        facturas.forEach(factura => {
            reporte += `Factura #${factura.id} - ${factura.fecha.toLocaleDateString()} - $${factura.total.toFixed(2)}\n`;
        });
        
        return reporte;
    }

    // Pure Fabrication: Registra el pago en el sistema
    private registrarPago(factura: Factura): void {
        // Aquí se registraría el pago en el sistema contable
        console.log(`Pago registrado: Factura #${factura.id} por $${factura.total}`);
    }

    // Information Expert: Obtiene estadísticas de métodos de pago
    obtenerEstadisticasMetodosPago(): { [metodo: string]: number } {
        const estadisticas: { [metodo: string]: number } = {};
        
        this.facturas.forEach(factura => {
            const metodo = factura.metodoPago.constructor.name;
            estadisticas[metodo] = (estadisticas[metodo] || 0) + 1;
        });
        
        return estadisticas;
    }
}