export type DataTypes = string | number | boolean;

export interface CellData {
  value?: DataTypes;
}

export type Data = Array<Array<CellData>>;

export type CellPosition = {
  row: number;
  column: number;
};
