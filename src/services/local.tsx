import request from 'umi-request';

const serviceLocal = {
  pointERCode(codeList: { Qrcode: string; Label: string }[]) {
    return request.post('http://localhost:17556/api/print', {
      data: codeList,
    });
  },
  getRFID() {
    return request.post('http://localhost:17556/api/epc');
  },
};

export default serviceLocal;
