export interface RespWarehouseChildren extends baseWarehouse {
  regionName: string;
  shortName?: any;
  reserved?: any;
  parentId: number;
  level: number;
  pinyin: string;
  createTime: string;
  type?: any;
  warehouseId: number;
  sort?: any;
  children: RespWarehouseChildren[];
}

export interface RespWarehouseV1 extends baseWarehouse {
  regionName: string;
  shortName: string;
  address: string;
  orgNo: number;
  imageUrl?: any;
  children: RespWarehouseChildren[];
}

export interface RespWarehouse extends baseWarehouse {
  children: RespWarehouseV1[];
}

export interface baseWarehouse {
  flg: 'org' | 'warehouse' | 'region';
  mergerName: string;
  id: string;
  children: any[];
}
