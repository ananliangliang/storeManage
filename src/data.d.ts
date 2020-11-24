export interface RespList<T> {
  total: number;
  pageNum: number;
  pageSize: number;
  lastPage: number;
  list: T[];
}

export interface ReqList<T> {
  pageNum: number;
  pageSize?: number;
  filter?: Partial<T>;
}
