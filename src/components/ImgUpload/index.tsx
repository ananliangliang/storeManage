import { Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import React from 'react';
import { UploadChangeParam } from 'antd/lib/upload';
import config from '@/config/config';

function getBase64(img: File, callback: Function) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file: File) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
}

type IProps = {
  imgSrc?: string;
  onChange?: (url: string) => void;
};

export class ImgUpload extends React.Component<IProps> {
  state = {
    loading: false,
    imageUrl: '',
  };
  static getDerivedStateFromProps(p: IProps, s: any) {
    if (p.imgSrc !== s.imgSrc) {
      return {
        imageUrl: p.imgSrc,
      };
    }
    return null;
  }

  handleChange = (info: UploadChangeParam<any>) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      const { onChange } = this.props;
      const { code, content } = info.file.response;
      if (code == 200) {
        onChange && onChange(content);
      }
      getBase64(info.file.originFileObj, (imageUrl: string) =>
        this.setState({
          imageUrl,
          loading: false,
        }),
      );
    }
  };

  render() {
    const { loading, imageUrl } = this.state;
    const uploadButton = (
      <div>
        {loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>上传</div>
      </div>
    );
    return (
      <Upload
        name="imgFile"
        listType="picture-card"
        className="avatar-uploader"
        withCredentials
        showUploadList={false}
        action={config.baseUrl + '/warehouse/file/uploadImage'}
        beforeUpload={beforeUpload}
        onChange={this.handleChange}
      >
        {imageUrl ? <img src={imageUrl} alt="imgFile" style={{ width: '100%' }} /> : uploadButton}
      </Upload>
    );
  }
}
