/**
 * Clase Lote - Entidad de dominio
 * 
 * PRINCIPIOS SOLID CUMPLIDOS:
 * - SRP: Responsabilidad única de representar un lote de productos
 * - OCP: Extensible para diferentes tipos de lotes
 * - ISP: Interfaz simple y específica
 * 
 * PRINCIPIOS GRASP CUMPLIDOS:
 * - Information Expert: Conoce su información y puede validarse
 * - Low Coupling: Mínimas dependencias
 * - High Cohesion: Métodos relacionados con el lote
 * 
 * SIN ESTA CLASE SE ROMPERÍA:
 * - SRP: Si Inventario manejara directamente fechas de vencimiento
 * - Information Expert: Si otra clase determinara si un lote está vencido
 */
export class Lote {
    private fechaIngreso: Date;
    private proveedor: string = '';
    private precioCompra: number = 0;

    constructor(
        public id: number,
        public numero: string,
        public fechaVencimiento: Date,
        public cantidad: number
    ) {
        this.fechaIngreso = new Date();
    }

    // Information Expert: El lote sabe si está vencido
    estaVencido(): boolean {
        return this.fechaVencimiento < new Date();
    }

    // Information Expert: Calcula días hasta vencimiento
    diasHastaVencimiento(): number {
        const hoy = new Date();
        const diferencia = this.fechaVencimiento.getTime() - hoy.getTime();
        return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
    }

    // Information Expert: Verifica si está próximo a vencer
    estaProximoAVencer(diasAnticipacion: number = 30): boolean {
        return this.diasHastaVencimiento() <= diasAnticipacion && !this.estaVencido();
    }

    // Information Expert: Verifica si tiene stock disponible
    tieneStock(): boolean {
        return this.cantidad > 0;
    }

    // Information Expert: Calcula valor total del lote
    calcularValorTotal(): number {
        return this.cantidad * this.precioCompra;
    }

    // SRP: Método específico para reducir cantidad
    reducirCantidad(cantidadAReducir: number): boolean {
        if (cantidadAReducir <= this.cantidad) {
            this.cantidad -= cantidadAReducir;
            return true;
        }
        return false;
    }

    // Information Expert: Genera código de barras simulado
    generarCodigoBarras(): string {
        return `${this.numero}-${this.id}-${this.fechaVencimiento.getFullYear()}`;
    }

    // Information Expert: Obtiene estado del lote
    obtenerEstado(): 'disponible' | 'proximo_vencer' | 'vencido' | 'agotado' {
        if (this.cantidad === 0) return 'agotado';
        if (this.estaVencido()) return 'vencido';
        if (this.estaProximoAVencer()) return 'proximo_vencer';
        return 'disponible';
    }

    // Setters para información adicional
    establecerProveedor(proveedor: string): void { this.proveedor = proveedor; }
    establecerPrecioCompra(precio: number): void { this.precioCompra = precio; }
    
    // Getters
    obtenerFechaIngreso(): Date { return this.fechaIngreso; }
    obtenerProveedor(): string { return this.proveedor; }
    obtenerPrecioCompra(): number { return this.precioCompra; }
}