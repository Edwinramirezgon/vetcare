import { Producto } from './Producto';
import { Servicio } from './Servicio';
import { IPrecioStrategy } from './IPrecioStrategy';

/**
 * Clase OrdenVenta - Implementa patrón Strategy
 * 
 * PRINCIPIOS SOLID CUMPLIDOS:
 * - SRP: Responsabilidad única de manejar órdenes de venta
 * - OCP: Extensible mediante nuevas estrategias de precio
 * - LSP: Las estrategias son intercambiables
 * - DIP: Depende de abstracción IPrecioStrategy
 * 
 * PRINCIPIOS GRASP CUMPLIDOS:
 * - Information Expert: Conoce sus productos y servicios
 * - Controller: Controla el cálculo de precios
 * - Polymorphism: Usa polimorfismo con estrategias de precio
 * - Low Coupling: Acoplamiento bajo mediante Strategy
 * - High Cohesion: Métodos relacionados con la orden
 * 
 * SIN ESTA CLASE SE ROMPERÍA:
 * - OCP: Si tuviera if/else para diferentes tipos de precio
 * - DIP: Si dependiera de implementaciones concretas de cálculo
 */
export class OrdenVenta {
    private estado: 'borrador' | 'confirmada' | 'facturada' | 'cancelada' = 'borrador';
    private descuentoAdicional: number = 0;
    private impuestos: number = 0.16; // 16% IVA
    private clienteId: number = 0;

    constructor(
        public id: number,
        public fecha: Date,
        public productos: Producto[],
        public servicios: Servicio[],
        private precioStrategy: IPrecioStrategy
    ) {}

    // Polymorphism: Usa estrategia para cálculo de precio
    calcularSubtotal(): number {
        const totalProductos = this.productos.reduce((sum, p) => sum + p.precio, 0);
        const totalServicios = this.servicios.reduce((sum, s) => sum + s.precio, 0);
        return this.precioStrategy.calcularPrecio(totalProductos + totalServicios);
    }

    // Information Expert: Calcula el total con impuestos y descuentos
    calcularTotal(): number {
        const subtotal = this.calcularSubtotal();
        const conDescuento = subtotal * (1 - this.descuentoAdicional);
        return conDescuento * (1 + this.impuestos);
    }

    // Controller: Agrega producto a la orden
    agregarProducto(producto: Producto, cantidad: number = 1): void {
        if (this.estado === 'borrador') {
            for (let i = 0; i < cantidad; i++) {
                this.productos.push(producto);
            }
        }
    }

    // Controller: Agrega servicio a la orden
    agregarServicio(servicio: Servicio): void {
        if (this.estado === 'borrador') {
            this.servicios.push(servicio);
        }
    }

    // Controller: Elimina producto de la orden
    eliminarProducto(productoId: number): boolean {
        if (this.estado === 'borrador') {
            const index = this.productos.findIndex(p => p.id === productoId);
            if (index !== -1) {
                this.productos.splice(index, 1);
                return true;
            }
        }
        return false;
    }

    // Controller: Cambia la estrategia de precio (Strategy Pattern)
    cambiarEstrategiaPrecio(nuevaEstrategia: IPrecioStrategy): void {
        if (this.estado === 'borrador') {
            this.precioStrategy = nuevaEstrategia;
        }
    }

    // Controller: Confirma la orden
    confirmar(): boolean {
        if (this.estado === 'borrador' && this.tieneItems()) {
            this.estado = 'confirmada';
            return true;
        }
        return false;
    }

    // Controller: Marca como facturada
    marcarComoFacturada(): boolean {
        if (this.estado === 'confirmada') {
            this.estado = 'facturada';
            return true;
        }
        return false;
    }

    // Information Expert: Verifica si tiene items
    tieneItems(): boolean {
        return this.productos.length > 0 || this.servicios.length > 0;
    }

    // Information Expert: Calcula cantidad total de items
    obtenerCantidadItems(): number {
        return this.productos.length + this.servicios.length;
    }

    // Information Expert: Genera resumen de la orden
    generarResumen(): string {
        let resumen = `Orden #${this.id} - ${this.fecha.toLocaleDateString()}\n`;
        resumen += `Estado: ${this.estado}\n\n`;
        
        if (this.productos.length > 0) {
            resumen += 'Productos:\n';
            this.productos.forEach(p => {
                resumen += `- ${p.nombre}: $${p.precio}\n`;
            });
        }
        
        if (this.servicios.length > 0) {
            resumen += 'Servicios:\n';
            this.servicios.forEach(s => {
                resumen += `- ${s.nombre}: $${s.precio}\n`;
            });
        }
        
        resumen += `\nSubtotal: $${this.calcularSubtotal().toFixed(2)}\n`;
        resumen += `Total: $${this.calcularTotal().toFixed(2)}`;
        
        return resumen;
    }

    // Setters y Getters
    aplicarDescuento(porcentaje: number): void { this.descuentoAdicional = porcentaje; }
    establecerCliente(clienteId: number): void { this.clienteId = clienteId; }
    obtenerEstado(): string { return this.estado; }
    obtenerClienteId(): number { return this.clienteId; }
}