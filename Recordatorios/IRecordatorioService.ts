export interface IRecordatorioService {
    programarRecordatorio(mensaje: string, fecha: Date): void;
    enviarRecordatorios(): void;
}