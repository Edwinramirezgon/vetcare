import { Mascota } from './Agenda/Mascota';
import { Veterinario } from './Agenda/Veterinario';
import { Cita } from './Agenda/Cita';
import { CitaRepositorySql } from './Agenda/CitaRepositorySql';
import { AgendaServiceImpl } from './Agenda/AgendaServiceImpl';
import { Atencion } from './Atencion/Atencion';
import { AtencionRepositorySql } from './Atencion/AtencionRepositorySql';
import { AtencionServiceImpl } from './Atencion/AtencionServiceImpl';
import { Inventario } from './Atencion/Inventario';
import { Lote } from './Atencion/Lote';
import { Producto } from './Facturacion/Producto';
import { Servicio } from './Facturacion/Servicio';
import { OrdenVenta } from './Facturacion/OrdenVenta';
import { PrecioPorEspecie } from './Facturacion/PrecioPorEspecie';
import { PrecioPorClinica } from './Facturacion/PrecioPorClinica';
import { OrdenVentaRepositorySql } from './Facturacion/OrdenVentaRepositorySql';
import { FacturacionServiceImpl } from './Facturacion/FacturacionServcieImpl';
import { PagoTarjetaAdapter } from './Facturacion/PagoTarjetaAdapter';
import { RecordatorioScheduler } from './Recordatorios/RecordatorioScheduler';

/**
 * Demostración del Sistema VetCare
 * 
 * Este archivo demuestra cómo todas las clases trabajan juntas
 * respetando los principios SOLID y GRASP implementados.
 */

console.log('=== SISTEMA VETCARE - DEMOSTRACIÓN ===\n');

// 1. CREACIÓN DE ENTIDADES BÁSICAS
console.log('1. Creando entidades básicas...');
const mascota = new Mascota(1, "Firulais", "canino", "Labrador", 3, 101);
const veterinario = new Veterinario(1, "Dr. García", "Medicina General", "555-1234");

console.log(`Mascota: ${mascota.obtenerDescripcion()}`);
console.log(`Veterinario: ${veterinario.obtenerInformacion()}`);
console.log(`¿Mascota es adulta?: ${mascota.esAdulta()}`);
console.log(`¿Veterinario puede atender caninos?: ${veterinario.puedeAtenderEspecie('canino')}\n`);

// 2. GESTIÓN DE AGENDA
console.log('2. Gestionando agenda...');
const cita = new Cita(1, new Date(), "10:00", "consulta", mascota, veterinario);
const recordatorioService = new RecordatorioScheduler();
const citaRepo = new CitaRepositorySql();
const agendaService = new AgendaServiceImpl(citaRepo, recordatorioService);

console.log(`¿Cita es válida?: ${cita.esValida()}`);
console.log(`Duración estimada: ${cita.obtenerDuracionEstimada()} minutos`);

try {
    agendaService.agendarCita(cita);
    console.log(`Cita agendada exitosamente. Estado: ${cita.obtenerEstado()}`);
} catch (error) {
    console.log(`Error al agendar: ${error}`);
}

// 3. GESTIÓN DE ATENCIÓN MÉDICA
console.log('\n3. Gestionando atención médica...');
const atencion = new Atencion(1, new Date(), "Sano", "Vacunación", cita);
const atencionRepo = new AtencionRepositorySql();
const atencionService = new AtencionServiceImpl(atencionRepo);

atencion.iniciarAtencion();
atencion.agregarMedicamento("Vacuna Antirrábica", 25);
atencion.agregarMedicamento("Vitaminas", 15);
atencion.finalizarAtencion("Mascota en buen estado de salud");

console.log(`Estado de atención: ${atencion.obtenerEstado()}`);
console.log(`Costo total: $${atencion.obtenerCostoTotal()}`);
console.log(`¿Requiere seguimiento?: ${atencion.requiereSeguimiento()}`);

atencionService.registrarAtencion(atencion);

// 4. GESTIÓN DE INVENTARIO
console.log('\n4. Gestionando inventario...');
const lote1 = new Lote(1, "LOT001", new Date(2024, 11, 31), 100);
const lote2 = new Lote(2, "LOT002", new Date(2025, 5, 15), 50);

lote1.establecerProveedor("Laboratorio ABC");
lote1.establecerPrecioCompra(20);

const inventario = new Inventario(1, "Vacuna Antirrábica", 0);
inventario.agregarLote(lote1);
inventario.agregarLote(lote2);

console.log(`Stock disponible: ${inventario.cantidadDisponible}`);
console.log(`¿Stock bajo?: ${inventario.tieneStockBajo()}`);
console.log(`Lotes próximos a vencer: ${inventario.obtenerLotesProximosAVencer(60).length}`);

// Consumir productos
inventario.consumir(25);
console.log(`Después de consumir 25 unidades: ${inventario.cantidadDisponible}`);

// 5. FACTURACIÓN CON PATRÓN STRATEGY
console.log('\n5. Procesando facturación...');
const producto = new Producto(1, "Vacuna Antirrábica", 50, "Medicina");
const servicio = new Servicio(1, "Consulta General", 30, 30);

// Demostrar diferentes estrategias de precio
const precioEspecie = new PrecioPorEspecie();
const precioClinica = new PrecioPorClinica(0.1); // 10% descuento

const orden = new OrdenVenta(1, new Date(), [producto], [servicio], precioEspecie);
orden.establecerCliente(101);
orden.confirmar();

console.log(`Subtotal con precio por especie: $${orden.calcularSubtotal()}`);

// Cambiar estrategia (Strategy Pattern)
orden.cambiarEstrategiaPrecio(precioClinica);
console.log(`Subtotal con descuento clínica: $${orden.calcularSubtotal()}`);
console.log(`Total con impuestos: $${orden.calcularTotal()}`);

// Generar factura
const ordenRepo = new OrdenVentaRepositorySql();
const facturacionService = new FacturacionServiceImpl(ordenRepo);
const pagoTarjeta = new PagoTarjetaAdapter();

const factura = facturacionService.generarFactura(orden, pagoTarjeta);
console.log(`Factura generada #${factura.id}`);

// Procesar pago (Adapter Pattern)
const pagoExitoso = facturacionService.procesarPago(factura);
console.log(`¿Pago exitoso?: ${pagoExitoso}`);

// 6. SISTEMA DE RECORDATORIOS
console.log('\n6. Gestionando recordatorios...');
recordatorioService.programarRecordatorioCita(cita.id, mascota.id, mascota.propietarioId, cita.fecha);

const fechaVacuna = new Date();
fechaVacuna.setMonth(fechaVacuna.getMonth() + 12);
recordatorioService.programarRecordatorioVacuna(mascota.id, mascota.propietarioId, "Antirrábica", fechaVacuna);

console.log(`Recordatorios pendientes: ${recordatorioService.obtenerRecordatoriosPendientes().length}`);

// 7. REPORTES Y ESTADÍSTICAS
console.log('\n7. Generando reportes...');
console.log('\n--- RESUMEN DE ORDEN ---');
console.log(orden.generarResumen());

console.log('\n--- RESUMEN DE ATENCIÓN ---');
console.log(atencion.generarResumen());

console.log('\n--- REPORTE DE INVENTARIO ---');
console.log(inventario.generarReporte());

console.log('\n--- REPORTE DE RECORDATORIOS ---');
console.log(recordatorioService.generarReporte());

// 8. DEMOSTRACIÓN DE PRINCIPIOS
console.log('\n8. Verificando disponibilidad (demostración de Controller)...');
const disponible = agendaService.verificarDisponibilidad(veterinario.id, new Date(), "11:00");
console.log(`¿Veterinario disponible a las 11:00?: ${disponible}`);

console.log('\n=== SISTEMA VETCARE FUNCIONANDO CORRECTAMENTE ===');
console.log('\nTodos los principios SOLID y GRASP han sido implementados:');
console.log('✓ SRP: Cada clase tiene una responsabilidad única');
console.log('✓ OCP: Extensible mediante herencia e interfaces');
console.log('✓ LSP: Implementaciones intercambiables');
console.log('✓ ISP: Interfaces específicas y cohesivas');
console.log('✓ DIP: Dependencias de abstracciones');
console.log('✓ Information Expert: Cada clase maneja su información');
console.log('✓ Creator: Responsabilidades de creación bien definidas');
console.log('✓ Controller: Coordinación de operaciones');
console.log('✓ Low Coupling: Acoplamiento mínimo entre clases');
console.log('✓ High Cohesion: Métodos cohesivos en cada clase');
console.log('✓ Polymorphism: Strategy y Adapter patterns');
console.log('✓ Pure Fabrication: Servicios y repositorios');
console.log('✓ Indirection: Capas de abstracción');