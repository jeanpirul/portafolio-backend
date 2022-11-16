export interface IActionFinanza {
  nombreResponsable: string;
  nombreRol?: string;
  totalIngresos: number;
  totalEgresos: number;
  totalGanancia?: number;
  detalleActionFinanza: string;
}
