import { Lote } from './Lote';

/**
 * Clase Inventario - Entidad de dominio con composición
 * 
 * PRINCIPIOS SOLID CUMPLIDOS:
 * - SRP: Responsabilidad única de manejar inventario de productos
 * - OCP: Extensible para nuevos tipos de productos
 * - LSP: Sustituible por subclases especializadas
 * 
 * PRINCIPIOS GRASP CUMPLIDOS:
 * - Information Expert: Experto en información de stock y lotes
 * - Creator: Crea y maneja sus lotes
 * - Controller: Controla operaciones de inventario
 * - Low Coupling: Acoplamiento necesario solo con Lote
 * - High Cohesion: Métodos cohesivos de gestión de inventario
 * 
 * SIN ESTA CLASE SE ROMPERÍA:
 * - SRP: Si otra clase manejara tanto productos como lotes
 * - Information Expert: Si el servicio calculara directamente el stock
 */
export class Inventario {
    private stockMinimo: number = 10;
    private stockMaximo: number = 1000;
    private ubicacion: string = '';

    constructor(
        public id: number,
        public producto: string,
        public cantidadDisponible: number,
        public lotes: Lote[] = []
    ) {}

    // Creator: Crea y agrega lotes al inventario
    agregarLote(lote: Lote): void {
        if (lote.cantidad > 0) {
            this.lotes.push(lote);
            this.cantidadDisponible += lote.cantidad;
        }
    }

    // Controller: Controla el consumo de productos
    consumir(cantidad: number): boolean {
        if (this.cantidadDisponible >= cantidad) {
            this.reducirStock(cantidad);
            return true;
        }
        return false;
    }

    // Information Expert: Verifica si hay stock bajo
    tieneStockBajo(): boolean {
        return this.cantidadDisponible <= this.stockMinimo;
    }

    // Information Expert: Calcula cantidad a reponer
    calcularCantidadAReponer(): number {
        if (this.tieneStockBajo()) {
            return this.stockMaximo - this.cantidadDisponible;
        }
        return 0;
    }

    // Information Expert: Obtiene lotes próximos a vencer
    obtenerLotesProximosAVencer(diasAnticipacion: number = 30): Lote[] {
        const fechaLimite = new Date();
        fechaLimite.setDate(fechaLimite.getDate() + diasAnticipacion);
        
        return this.lotes.filter(lote => 
            lote.fechaVencimiento <= fechaLimite && lote.cantidad > 0
        );
    }

    // Information Expert: Obtiene el lote más antiguo con stock
    obtenerLoteMasAntiguo(): Lote | null {
        const lotesConStock = this.lotes.filter(l => l.cantidad > 0);
        if (lotesConStock.length === 0) return null;
        
        return lotesConStock.reduce((masAntiguo, actual) => 
            actual.fechaVencimiento < masAntiguo.fechaVencimiento ? actual : masAntiguo
        );
    }

    // Controller: Reduce stock usando FIFO (First In, First Out)
    private reducirStock(cantidad: number): void {
        let cantidadRestante = cantidad;
        
        // Ordenar lotes por fecha de vencimiento (FIFO)
        const lotesOrdenados = this.lotes
            .filter(l => l.cantidad > 0)
            .sort((a, b) => a.fechaVencimiento.getTime() - b.fechaVencimiento.getTime());
        
        for (const lote of lotesOrdenados) {
            if (cantidadRestante <= 0) break;
            
            const cantidadAUsar = Math.min(lote.cantidad, cantidadRestante);
            lote.cantidad -= cantidadAUsar;
            cantidadRestante -= cantidadAUsar;
        }
        
        this.cantidadDisponible -= cantidad;
    }

    // Information Expert: Genera reporte de inventario
    generarReporte(): string {
        const lotesVencidos = this.lotes.filter(l => l.fechaVencimiento < new Date()).length;
        const lotesProximosVencer = this.obtenerLotesProximosAVencer().length;
        
        return `Producto: ${this.producto}\n` +
               `Stock Disponible: ${this.cantidadDisponible}\n` +
               `Total Lotes: ${this.lotes.length}\n` +
               `Lotes Vencidos: ${lotesVencidos}\n` +
               `Lotes Próximos a Vencer: ${lotesProximosVencer}\n` +
               `Estado: ${this.tieneStockBajo() ? 'STOCK BAJO' : 'OK'}`;
    }

    // Setters para configuración
    configurarStockMinimo(minimo: number): void { this.stockMinimo = minimo; }
    configurarStockMaximo(maximo: number): void { this.stockMaximo = maximo; }
    establecerUbicacion(ubicacion: string): void { this.ubicacion = ubicacion; }
}