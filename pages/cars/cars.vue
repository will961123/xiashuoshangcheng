<template>
	<view class="cars  ">
		<view class="item flex align-center bg-white" v-for="(item, index) in goodsList" :key="index">
			<view class="radio">
				<image @click="radioChange(index)" :src="selectList[index] ? '/static/select.png' : '/static/noo.png'" mode="aspectFill"></image>
				<!-- <radio @click="radioChange(index)" style="zoom: 0.8;" :color="'#ff585f'" :value="'' + index" :checked="selectList[index]" /> -->
			</view>
			<image @click="gotoDetail(item.productId)" :src="item.spec.picture" mode="aspectFill"></image>
			<!-- 			<image @click="gotoDetail(item.productId)" :src="imgUrl + item.spec.picture" mode="aspectFill"></image> -->
			<view class="infobox flex flex-direction  ">
				<view class="title textov2" style="margin-bottom: 20px;">{{ item.product.name }}</view>
				<!-- <view class="gg">{{ item.spec.name }}</view> -->
				<view class="bottombox flex justify-between align-end">
					<view class="moneybox">
						<text>￥</text>
						{{ item.spec.price }}
					</view>
					<view><sunui-stepper :label="index" :val="item.num" :min="1" :max="999" @change="stepperChange"></sunui-stepper></view>
				</view>
			</view>
		</view>

		<view class="umenu bg-white flex justify-between align-center">
			<view class="flex align-center">
				<image @click="allradioChange" class="selectallimg" :src="selectEvery ? '/static/select.png' : '/static/noo.png'" mode="aspectFill"></image>
				<!-- <radio @click="allradioChange" style="zoom: 0.8;" color="#ff585f" :checked="selectEvery" /> -->
				<text>全选</text>
			</view>
			<view class="flex align-center">
				<text>
					合计：
					<text style="color: #f23030;margin-right: 6rpx;">￥{{ allprice }}</text>
				</text>
				<view @click="del" class="btn del">删除</view>
				<view @click="shopingSure" class="btn shopingSure">结算</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			selectList: [false, true],
			selectEvery: false,
			goodsList: [
				{
					productId: 1,
					product: {
						name: '商品1',
						smallPic: '/static/goods.jpg'
					},
					spec: {
						picture: '/static/goods.jpg',
						name: '规格1',
						price: 100
					},
					specId: 2,
					num: 3,
					hot: 1,
					id: 233
				},
				{
					productId: 1,
					product: {
						name: '商品1',
						smallPic: '/static/goods.jpg'
					},
					spec: {
						picture: '/static/goods.jpg',
						name: '规格1',
						price: 100
					},
					specId: 2,
					num: 3,
					hot: 1,
					id: 233
				}
			],
			showGetAuthor: false,
			userInfo: {}
		};
	},
	computed: {
		allprice() {
			let allprice = 0;
			if (this.selectEvery) {
				for (let idx in this.goodsList) {
					allprice += Number(this.goodsList[idx].spec.price) * Number(this.goodsList[idx].num);
				}
			} else {
				for (let idx in this.selectList) {
					if (this.selectList[idx]) {
						allprice += Number(this.goodsList[idx].spec.price) * Number(this.goodsList[idx].num);
					}
				}
			}
			return allprice;
		}
	},
	onShow() {
		// if (!this.isLoad()) {
		// 	// #ifdef MP-WEIXIN
		// 	this.showGetAuthor = true;
		// 	// #endif
		// } else {
		// 	// #ifdef MP-WEIXIN
		// 	this.showGetAuthor = false;
		// 	// #endif
		// }
	},
	onLoad() {},
	onShow() {
		// this.getGoodsList();
	},
	methods: {
		// #ifdef MP-WEIXIN
		getOpenId_btn(e) {
			this.getOpenId(e, this);
		},
		// #endif
		shopingSure() {
			let selectGoods = [];
			let cartIds = [];
			for (let idx in this.selectList) {
				if (this.selectList[idx]) {
					selectGoods.push({
						checkState: true,
						productId: this.goodsList[idx].productId,
						productName: this.goodsList[idx].product.name,
						productPic: this.goodsList[idx].spec.picture ? this.goodsList[idx].spec.picture : this.goodsList[idx].product.smallPic,
						productSpecId: this.goodsList[idx].specId,
						productSpecName: this.goodsList[idx].spec.name,
						price: Number(this.goodsList[idx].spec.price),
						number: this.goodsList[idx].num,
						total: Number(this.goodsList[idx].spec.price) * Number(this.goodsList[idx].num),
						hot: this.goodsList[idx].product.hot
					});
					cartIds.push(this.goodsList[idx].id);
				}
			}
			if (selectGoods.length) {
				uni.navigateTo({
					url: '/pages/index/confirmOrder?from=2&goodslist=' + JSON.stringify(selectGoods) + '&cartIds=' + JSON.stringify(cartIds)
				});
			}
		},
		del() {
			let ids = [];
			for (let idx in this.selectList) {
				if (this.selectList[idx]) {
					ids.push(this.goodsList[idx].id);
				}
			}
			if (!ids.length) {
				return;
			}
			this.showLoading();
			this.request({
				url: '',
				data: {},
				success: res => {
					console.log('删除购物车', res);
					this.getGoodsList();
					this.selectEvery = false;
				}
			});
		},
		gotoDetail(id) {
			uni.navigateTo({
				url: '/pages/index/goodsDetail?goodsId=' + id
			});
		},
		getGoodsList() {
			let userInfo = uni.getStorageSync('userInfo');
			if (!userInfo) {
				return;
			}
			this.showLoading();
			this.request({
				url: '',
				data: {
					userId: userInfo.userId
				},
				success: res => {
					console.log('购物车', res);
					uni.hideLoading();
					if (res.data.returnCode === 1) {
						this.goodsList = res.data.obj || [];
						this.selectList = [];
						for (let idx in this.goodsList) {
							this.selectList.push(false);
						}
					} else {
						this.goodsList = [];
						this.selectList = [];
					}
				}
			});
		},
		radioChange(idx) {
			this.$set(this.selectList, idx, !this.selectList[idx]);
			this.selectEvery = this.selectList.every(select => select === true);
		},
		allradioChange() {
			if (!this.goodsList.length) {
				return;
			}
			this.selectEvery = !this.selectEvery;
			for (let idx in this.selectList) {
				this.selectList[idx] = this.selectEvery;
			}
		},
		stepperChange(e) {
			this.$set(this.goodsList, e.label, Object.assign({}, this.goodsList[e.label], { num: e.val }));
			// this.showLoading();
			// this.request({
			// 	url: ' ',
			// 	data: {
			// 		id: this.goodsList[e.label].id,
			// 		num: e.val
			// 	},
			// 	success: res => {
			// 		uni.hideLoading();
			// 		console.log('修改购物车', res);
			// 		if (res.data.returnCode === 1) {
			// 			this.$set(this.goodsList, e.label, Object.assign({}, this.goodsList[e.label], { num: e.val }));
			// 		}
			// 	}
			// });
		}
	}
};
</script>

<style lang="scss">
.cars {
	padding-bottom: 60px;
	.item {
		margin-bottom: 1px;
		padding: 0 30rpx;
		.radio {
			& > image {
				width: 40rpx;
				height: 40rpx;
			}
		}
		& > image {
			width: 200rpx;
			height: 200rpx;
			margin: 0 18rpx 0 30rpx;
		}
		.infobox {
			flex: 1;
			.title {
				font-size: 26rpx;
				line-height: 36rpx;
				color: #333333;
			}
			.gg {
				font-size: 24rpx;
				line-height: 36rpx;
				color: #666666;
				margin: 8rpx 0 10rpx 0;
			}
			.bottombox {
				.moneybox {
					color: #f23030;
					font-size: 30rpx;
					& > text {
						font-size: 24rpx;
					}
				}
			}
		}
	}

	.umenu {
		position: fixed;
		left: 0;
		/* #ifdef H5 */
		bottom: 50px;
		/* #endif */

		/* #ifndef H5 */
		bottom: 0;
		/* #endif */
		z-index: 999;
		width: 100%;
		height: 48px;
		padding: 0 30rpx;
		.selectallimg {
			width: 40rpx;
			height: 40rpx;
			margin-right: 20rpx;
		}
		.btn {
			margin-left: 10rpx;
			width: 140rpx;
			text-align: center;
			height: 36px;
			line-height: 36px;
			border-radius: 18px;
			&.del {
				border: 1rpx solid #333;
			}
			&.shopingSure {
				color: #fff;
				background-image: linear-gradient(90deg, #ff585f 0%, #ff826a 100%);
			}
		}
	}
}
</style>
