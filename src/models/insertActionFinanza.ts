export interface IActionFinanza {
  fk_User: number;
  nombreResponsable: string;
  nombreRol?: string;
  totalIngresos: number;
  totalEgresos: number;
  totalGanancia?: number;
  detalleActionFinanza: string;
}
