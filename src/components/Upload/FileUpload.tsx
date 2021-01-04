import config from '@/config/config';
import { UploadOutlined } from '@ant-design/icons';
import { Button, message, Upload } from 'antd';
import { UploadFile } from 'antd/lib/upload/interface';
import React, { FC, useEffect, useState } from 'react';
//import styles from './FileUpload.less'

interface FileUploadProps {
  btnText?: string;
  fileList?: UploadFile<any>[];
  value?: UploadFile<any>[];
  onChange?: (data: UploadFile<any>[]) => void;
}

const FileUpload: FC<FileUploadProps> = ({
  btnText = '上传',
  fileList,
  onChange,
  value,
}: FileUploadProps) => {
  const [_fileList, setFileList] = useState<UploadFile<any>[]>([]);
  useEffect(() => {
    console.log(value);

    if (value && value !== _fileList) {
      const list = value.map((item: any) => ({
        ...item,
        uid: item.id,
        name: item.fileName,
        status: 'done',
        url: item.content,
      }));

      setFileList(list);
    } else if (fileList && fileList != _fileList) {
      setFileList(fileList);
    }
  }, [value, fileList]);

  const handleChange = (info: any) => {
    let fileList = [...info.fileList];
    fileList = fileList.map((file) => {
      if (file.response) {
        file.url = file.response.url;
        const { content, code } = file.response;
        console.log(content, code);
        if (code == 200) {
          file.status = 'done';
        } else {
          file.status = 'error';
          message.error(file.response.msg);
        }
        file = { ...file, ...content };
        delete file.response;
      }
      return file;
    });
    console.log(fileList);
    const arr = fileList.filter((item) => item.status !== 'error');
    setFileList(arr);
    onChange && onChange(arr);
  };

  const uploadProps = {
    action: config.baseUrl + '/warehouse/file/upload',
    onChange: handleChange,
    multiple: true,
  };
  return (
    <Upload {...uploadProps} fileList={_fileList}>
      <Button icon={<UploadOutlined />}>{btnText}</Button>
    </Upload>
  );
};
export default FileUpload;
