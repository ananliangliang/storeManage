import { post, upload } from '@/utils/request';

const serviceBase = {
  uploadImage(imgFile: File) {
    return upload('/image/uploadImage', { imgFile }, true);
  },
  getDicByOne(id: number) {
    return post(`/api/getDicByOne/${id}`, {}, true);
  },
  getDicByTree(id: number) {
    return post(`/api/getDicByTree/${id}`, {}, true);
  },
};

export default serviceBase;
