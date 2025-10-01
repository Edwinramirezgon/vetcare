import { IPrecioStrategy } from './IPrecioStrategy';

/**
 * Clase PrecioPorEspecie - Implementación del patrón Strategy
 * 
 * PRINCIPIOS SOLID CUMPLIDOS:
 * - SRP: Responsabilidad única de calcular precio por especie
 * - OCP: Cerrada para modificación, abierta para extensión
 * - LSP: Sustituible por cualquier otra estrategia
 * - ISP: Implementa solo la interfaz necesaria
 * - DIP: Implementa abstracción IPrecioStrategy
 * 
 * PRINCIPIOS GRASP CUMPLIDOS:
 * - Polymorphism: Permite intercambio de algoritmos
 * - Pure Fabrication: Clase creada para encapsular algoritmo
 * - Low Coupling: Acoplamiento mínimo
 * - High Cohesion: Métodos cohesivos de cálculo
 * 
 * SIN ESTA CLASE SE ROMPERÍA:
 * - OCP: Si OrdenVenta tuviera if/else para cada tipo de precio
 * - Polymorphism: Si no se pudieran intercambiar algoritmos
 */
export class PrecioPorEspecie implements IPrecioStrategy {
    private especiesEspeciales: Map<string, number> = new Map([
        ['exotica', 2.0],
        ['ave', 1.5],
        ['reptil', 1.8],
        ['felino', 1.3],
        ['canino', 1.0],
        ['roedor', 0.8]
    ]);

    constructor(private multiplicadorDefault: number = 1.0) {}

    // Polymorphism: Implementación específica del algoritmo
    calcularPrecio(precioBase: number, especie?: string): number {
        if (especie) {
            const multiplicadorEspecie = this.especiesEspeciales.get(especie.toLowerCase());
            if (multiplicadorEspecie) {
                return precioBase * multiplicadorEspecie;
            }
        }
        return precioBase * this.multiplicadorDefault;
    }

    // Pure Fabrication: Método para configurar precios por especie
    configurarPrecioEspecie(especie: string, multiplicador: number): void {
        this.especiesEspeciales.set(especie.toLowerCase(), multiplicador);
    }

    // Information Expert: Obtiene multiplicador para una especie
    obtenerMultiplicadorEspecie(especie: string): number {
        return this.especiesEspeciales.get(especie.toLowerCase()) || this.multiplicadorDefault;
    }

    // Information Expert: Lista especies configuradas
    obtenerEspeciesConfiguradas(): string[] {
        return Array.from(this.especiesEspeciales.keys());
    }

    // Pure Fabrication: Calcula descuento por volumen
    calcularConDescuentoVolumen(precioBase: number, cantidad: number, especie?: string): number {
        const precioConEspecie = this.calcularPrecio(precioBase, especie);
        
        // Descuento por volumen
        if (cantidad >= 10) return precioConEspecie * 0.9; // 10% descuento
        if (cantidad >= 5) return precioConEspecie * 0.95;  // 5% descuento
        
        return precioConEspecie;
    }
}