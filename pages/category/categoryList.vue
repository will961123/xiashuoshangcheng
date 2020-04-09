<template>
	<view class="categoryList bg-white ">
		<view class="sortbox flex justify-around text-center ">
			<view class="item" :class="{ select: sortType === 1 }" @click="changeSort(1)">默认</view>
			<view class="item flex align-center" :class="{ select: sortType === 2 || sortType === 3 }" @click="changeSort(2)">
				<text>销量</text>
				<image :src="sortType === 2 ? '/static/sortbottom.png' : sortType === 3 ? '/static/sorttop.png' : '/static/sort.png'" mode="aspectFit"></image>
			</view>
			<view class="item flex align-center" :class="{ select: sortType === 4 || sortType === 5 }" @click="changeSort(4)">
				<text>价格</text>
				<image :src="sortType === 4 ? '/static/sortbottom.png' : sortType === 5 ? '/static/sorttop.png' : '/static/sort.png'" mode="aspectFit"></image>
			</view>
			<!-- <view class="item" :class="{ select: sortType[0] }" @click="changeSort(0)">综合</view>
			<view class="item" :class="{ select: sortType[1] }" @click="changeSort(1)">销量</view>
			<view class="item flex align-center" :class="{ select: sortType[2] || sortType[3] }" @click="changeSort(2)">
				<text>价格</text>
				<image :src="sortType[2] ? '/static/sortbottom.png' : sortType[3] ? '/static/sorttop.png' : '/static/sort.png'" mode="aspectFit"></image>
			</view> -->
			<!-- <view @click="visible = true" :class="{ select: ss.use }" class="item flex align-center">
				<text>筛选</text>
				<image :src="ss.use ? '/static/saixuanred.png' : '/static/saixuan.png'" mode="aspectFit"></image>
			</view> -->
		</view>

		<view class="lsitbox">
			<view @click="gotoDetail(item.id)" v-for="(item, index) in goodsList" :key="index" class="item flex align-center">
				<image :src="item.picture" mode="aspectFill"></image>
				<view class="infobox flex flex-direction justify-between">
					<view class="info textov2">{{ item.name }}</view>
					<view class="moneybox flex align-center justify-between">
						<view class="money ">
							<text>￥</text>
							{{ item.price }}
						</view>
						<view class="xl">销量： {{ item.sale_num }}</view>
					</view>
				</view>
			</view>
			<view v-if="!goodsList.length" style="padding-top: 140px;"><will-nodata></will-nodata></view>
		</view>

		<uni-drawer v-if="visible" :visible="visible" mode="right" @close="visible = false">
			<view class="searchlistBox titbox flex justify-between align-center">
				<view @click="visible = false">关闭</view>
				<view @click="ssSure" style="color: #f23030;">确认</view>
			</view>

			<view class="searchlistBox list1">
				<view class="tit">价格区间（元）</view>
				<view class="moneybox flex align-center justify-around">
					<input v-model="ss.money.min" type="number" class="moneyipt" value="" placeholder="最低价" />
					<view class="line"></view>
					<input v-model="ss.money.max" type="number" class="moneyipt" value="" placeholder="最高价" />
				</view>
				<view class="flex flex-wrap justify-between">
					<button @click="ssItemChange(1, index)" v-for="(item, index) in ssList.money" :key="index" class="item cu-btn">{{ item.min }}-{{ item.max }}</button>
				</view>
			</view>

			<view class="searchlistBox">
				<view class="tit">品牌</view>
				<view class="flex flex-wrap justify-between">
					<button @click="ssItemChange(2, index)" v-for="(item, index) in ssList.name" :key="index" class="item cu-btn" :class="{ select: ss.name === index }">
						{{ item }}
					</button>
				</view>
			</view>

			<view class="searchlistBox">
				<view class="tit">地区</view>
				<view class="flex flex-wrap justify-between">
					<button @click="ssItemChange(3, index)" v-for="(item, index) in ssList.region" :key="index" class="item cu-btn " :class="{ select: ss.region === index }">
						{{ item }}
					</button>
				</view>
			</view>
		</uni-drawer>
	</view>
</template>

<script>
import uniDrawer from '@/components/uni-drawer/uni-drawer.vue';
export default {
	components: {
		uniDrawer
	},
	data() {
		return {
			type: 1, //1搜索来 2分类来
			name: '',
			id: '',
			goodsList: [],

			// 				默认 销量 价格递减 价格递增
			// sortType: [true, false, false, false],
			// 1 默认 2 3销量 3 4价格
			sortType: 1,

			visible: false, // 抽屉显示的

			// 筛选条件列表
			ssList: {
				money: [{ min: 6, max: 66 }, { min: 6, max: 150 }, { min: 150, max: 305 }],
				name: ['雅诗兰黛', '兰蔻', '迪奥', '雅诗兰黛', '兰蔻', '迪奥'],
				region: ['河南省', '江苏省']
			},

			ss: {
				use: false, // 是否是筛选状态
				money: {
					idx: -1,
					min: '',
					max: ''
				},
				name: -1,
				region: -1
			}
		};
	},
	onLoad(options) {
		console.log(options);
		this.id = options.id || '';
		this.name = options.name || '';
		//1搜索 2分类
		this.type = options.type || 1;
		// uni.setNavigationBarTitle({
		// 	title: this.name || '苍都牧场'
		// });

		this.findProductByCategoryId();
	},
	onShareAppMessage(res) {
		return {
			title: '苍都牧场',
			path: '/pages/category/categoryList?parentId=' + (this.getUserId() || '') + '&id=' + this.id + '&name=' + this.name + '&type=' + this.type
			// imageUrl: '测试图片'
		};
	},
	methods: {
		findProductByCategoryId() {
			let type_sort = 'desc';
			let type_field = 'id';
			if (this.sortType === 2) {
				type_sort = 'desc'; // 升序
				type_field = 'sale_num';
			} else if (this.sortType === 3) {
				type_sort = 'asc'; // 降序
				type_field = 'sale_num';
			} else if (this.sortType === 4) {
				type_sort = 'desc'; // 升序
				type_field = 'price';
			} else if (this.sortType === 5) {
				type_sort = 'asc'; // 降序
				type_field = 'price';
			}
			let formData = {
				product_name: this.name ? this.name : '',
				product_type_id: this.id ? this.id : '',
				type_field: type_field,
				type_sort: type_sort
			};
			console.log(formData);
			this.showLoading();
			this.request({
				url: '/product/productSearch',
				method: 'POST',
				data: formData,
				success: res => {
					uni.hideLoading();
					console.log('查找列表', res);
					if (res.data.status === 1) {
						res.data.list = res.data.list.map(i => {
							i.picture = res.data.image_url + i.picture;
							return i;
						});
						this.goodsList = res.data.list;
					}
				}
			});
		},
		// 筛选条件单个改变
		ssItemChange(type, index) {
			if (type === 1) {
				this.$set(this.ss, 'money', Object.assign({}, this.ss.money, { min: this.ssList.money[index].min, max: this.ssList.money[index].max }));
			} else if (type === 2) {
				this.$set(this.ss, 'name', index);
			} else if (type === 3) {
				this.$set(this.ss, 'region', index);
			}
		},
		// 筛选条件选择完毕点击确定
		ssSure() {
			this.visible = false;
			this.ss.use = true;
			console.log(this.ss);
		},
		// 排序选择完毕
		changeSort(type) {
			if (type === 2) {
				this.sortType === 2 ? (this.sortType = 3) : (this.sortType = 2);
			} else if (type === 4) {
				this.sortType === 4 ? (this.sortType = 5) : (this.sortType = 4);
			} else {
				this.sortType = type;
			}
			this.findProductByCategoryId();
			console.log(this.sortType);
			// this.findProductByCategoryId()

			// switch (type) {
			// 	case 0:
			// 		this.sortType.splice(0, 1, !this.sortType[0]);
			// 		break;
			// 	case 1:
			// 		this.sortType.splice(1, 1, !this.sortType[1]);
			// 		break;
			// 	case 2:
			// 		if (this.sortType[2]) {
			// 			this.sortType.splice(2, 2, false, true);
			// 		} else if (this.sortType[3]) {
			// 			this.sortType.splice(2, 2, true, false);
			// 		} else {
			// 			this.sortType.splice(2, 2, true, false);
			// 		}
			// 		break;
			// }
		},
		// 去详情
		gotoDetail(id) {
			console.log(id);
			uni.navigateTo({
				url: '/pages/index/goodsDetail?goodsType=1&goodsId=' + id
			});
		}
	}
};
</script>

<style lang="scss">
.categoryList {
	min-height: 100vh;
	.sortbox {
		line-height: 44px;
		border-bottom: 1rpx solid #ededed;
		.item {
			& > image {
				width: 26rpx;
				height: 26rpx;
				margin-left: 4px;
			}
			&.select {
				color: #f23030;
			}
		}
	}
	.lsitbox {
		.item {
			padding: 30rpx;
			border-bottom: 1rpx solid #ededed;
			& > image {
				width: 260rpx;
				height: 260rpx;
			}
			.infobox {
				margin-left: 34rpx;
				flex: 1;
				height: 260rpx;
				padding: 30rpx 0;
				.info {
					font-size: 28rpx;
					line-height: 40rpx;
					color: #333333;
				}
				.moneybox {
					.money {
						font-size: 28rpx;
						color: #f23030;
						& > text {
							font-size: 22rpx;
						}
					}
					.xl {
						font-size: 26rpx;
						color: #999999;
					}
				}
			}
		}
	}

	.searchlistBox {
		padding: 0 30rpx;
		padding-bottom: 40rpx;
		border-bottom: 1rpx solid #ededed;
		&.titbox {
			padding-bottom: 0;
			line-height: 88rpx;
			font-size: 30rpx;
			color: #333333;
		}
		.tit {
			font-size: 26rpx;
			line-height: 48rpx;
			color: #4d4d4d;
			margin: 30rpx 0 20rpx 0;
		}
		.moneybox {
			background: #f5f5f5;
			padding: 14rpx 16rpx;
			.line {
				width: 24rpx;
				height: 4rpx;
				background-color: #999999;
				border-radius: 2rpx;
				margin: 0 20rpx;
			}
			input {
				text-align: center;
				width: 220rpx;
				height: 60rpx;
				background-color: #ffffff;
				border-radius: 10rpx;
				font-size: 22rpx;
			}
		}
		.item {
			margin-top: 15rpx;
			width: 170rpx;
			line-height: 80rpx;
			height: 80rpx;
			background: #f5f5f5;
			border-radius: 10rpx;
			font-size: 22rpx;
			&.select {
				color: #f23030;
				border: 1rpx solid #f23030;
				background: #fff7f7;
			}
		}
	}
}
</style>
