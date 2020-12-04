import { Tree } from 'antd';
import React from 'react';

export const FormTree = ({ value, onChange, treeData, height = 380 }: any) => {
  return (
    <Tree
      defaultExpandAll
      onCheck={onChange}
      checkedKeys={value}
      checkStrictly
      height={height}
      selectable={false}
      treeData={treeData}
      checkable
    />
  );
};
