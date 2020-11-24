import { Store } from 'antd/es/form/interface';
import React, { FC } from 'react';
import AddEditFloor from './AddEditFloor';
import AddEditGoods from './AddEditGoods';
import AddEditPartition from './AddEditPartition';
import AddEditWarehouse from './AddEditWarehouse';
//import styles from './index.less'

export type TModalType = 'warehouse' | 'floor' | 'partition' | 'goods';

export type TypeSelectOptions = { label: string; value: string }[];

interface IndexProps {
  type: TModalType;
  visible: boolean;
  initialValues: Store;
  onClose: () => void;
  onFinish: (data: Store) => Promise<void | boolean> | void | boolean;
}

const Index: FC<IndexProps> = (props) => {
  const { type } = props;
  return (
    <>
      {type == 'floor' && <AddEditFloor {...props} />}
      {type == 'partition' && <AddEditPartition {...props} />}
      {type == 'goods' && <AddEditGoods {...props} />}
      {type == 'warehouse' && <AddEditWarehouse {...props} />}
    </>
  );
};
export default Index;
