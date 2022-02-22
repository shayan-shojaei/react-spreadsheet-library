export type DataTypes = string | number | boolean;

export interface CellData {
  value?: DataTypes;
}

export type Data = Array<Array<CellData>>;

export type CellPosition = {
  row: number;
  column: number;
};

export type SelectionRange = {
  fromRow: number;
  toRow: number;
  fromColumn: number;
  toColumn: number;
};

export type DeselectionRange = {
  fromRow: number;
  toRow: number;
  fromColumn: number;
  toColumn: number;
};

export type ModifierKey = 'shift' | 'ctrl' | 'ctrl-shift' | undefined;
