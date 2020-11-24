export interface RespGoodsModel {
	id: number;
	goods: string;
	specs?: any;
	brand?: any;
	des?: any;
	pingyin?: any;
	createTime: string;
	type: number;
	threshold?: any;
	unit?: any;
	upperLimit?: any;
	cut: number;
	imageUrl?: any;
	parentId: number;
	orgNo?: any;
	children: RespGoodsModel[];
	ck?: any;
	kc?: any;
	lastModel?: any;
}
