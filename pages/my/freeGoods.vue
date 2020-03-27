<template>
	<view class="freeGoods">
		<view class="titBox flex ">
			<view style="margin-right: 18rpx;" @click="changeFreeGoodsType(1)" :class="{ select: freeGoodsType === 1 }" class="tit">0元抢</view>
			<view @click="changeFreeGoodsType(2)" :class="{ select: freeGoodsType === 2 }" class="tit">分享免费</view>
		</view>
		<view class="lsitbox " style="border: none;">
			<view v-for="(item, index) in goodsList" :key="index" class="itemFree  flex align-center">
				<image :src="item.picture" mode="aspectFill"></image>
				<view style="height: auto;" class="infobox flex flex-direction justify-between">
					<view class="info textov2">{{ item.name }}</view>
					<view class="moneybox flex align-center justify-between">
						<view class="money">零元抢购</view>
						<!-- <view class="xl">剩余{{ item.saleNum }}份</view> -->
						<button v-if="item.status === 0" class="btn cu-btn  bg-cancel">待审核</button>
						<button v-if="item.status === 1" @click="clickBtn(item)" class="btn cu-btn  ">填写地址</button>
						<button v-if="item.status === -1" @click="showCancelInfo(item.name)" class="btn cu-btn bg-cancel">审核失败</button>
					</view>
				</view>
			</view>

			<!-- 	<view class="itemFree  flex align-center">
				<image src="/static/goods.jpg" mode="aspectFill"></image>
				<view style="height: auto;" class="infobox flex flex-direction justify-between">
					<view class="info textov2">分享商品</view>
					<view class="moneybox flex align-center justify-between">
						<view class="money">￥0</view>
						<button @click="showSearchNum(3)" class="btn cu-btn  ">查看人数</button>
					</view>
				</view>
			</view> -->
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			freeGoodsType: 1,
			goodsList: [],
			addressInfo: null
		};
	},
	onLoad(options) {
		this.getList();
	},
	methods: {
		showCancelInfo(info) {
			uni.showModal({
				title: '申请失败!',
				content: info,
				showCancel: false
			});
		},
		showSearchNum(num) {
			uni.showModal({
				title: '分享人数',
				content: '已经分享了' + num + '人',
				showCancel: false
			});
		},
		changeFreeGoodsType(type) {
			this.freeGoodsType = type;
		},
		getList() {
			this.showLoading();
			this.request({
				url: '/tryAssemble/myList',
				method: 'POST',
				data: {},
				success: res => {
					uni.hideLoading();
					console.log('奖品列表', res);
					if (res.data.list.length > 0) {
						res.data.list = res.data.list.map(i => {
							i.picture = res.data.image_url + i.picture;
							return i;
						});
						this.goodsList = res.data.list;
					}
				}
			});
		},
		clickBtn(item) {
			let goodslist = [
				{
					checkState: true,
					productId: item.product_id, // 商品id
					prize_log_id: item.id, //数据id
					productName: item.name,
					productPic: item.picture,
					price: 0,
					number: 1,
					total: 0
				}
			];
			let url = '/pages/index/confirmOrder?from=4&goodslist=' + JSON.stringify(goodslist) + '&buyType=7';
			uni.navigateTo({
				url: url
			});
		}
	}
};
</script>

<style lang="scss">
.freeGoods {
	padding: 0 30rpx;
	.titBox {
		padding: 30rpx 20rpx;
		.tit {
			line-height: 42rpx;
			color: #000;
			font-size: 28rpx;
			border: 2rpx solid rgba(0, 0, 0, 1);
			padding: 0 24rpx;
			border-radius: 21rpx;
			&.select {
				background: #ff5858;
				color: #ffffff;
				border-color: #ff5858;
			}
		}
	}
	.lsitbox {
		position: relative;
		overflow: hidden;
		border-radius: 20px 20px 0px 0px;
		// top: -15px;
		.titview {
			line-height: 40px;
			margin-top: 20px;
			font-size: 16px;
		}
		.item {
			padding: 30rpx;
			border-bottom: 1rpx solid #ededed;
			& > image {
				width: 220rpx;
				height: 220rpx;
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
					.bg-cancel {
						background: #f1f1f1 !important;
						color: #fff;
					}
				}
			}
		}
		.itemFree {
			padding: 0 30rpx;
			margin-bottom: 30rpx;
			background: #ffffff;
			border-radius: 20rpx;
			& > image {
				width: 140rpx;
				height: 140rpx;
			}
			.infobox {
				margin-left: 34rpx;
				flex: 1;
				height: 260rpx;
				padding: 30rpx 0;
				.info {
					font-size: 32rpx;
					line-height: 48rpx;
					color: #000000;
					.typeName {
						margin-right: 4px;
						display: inline-block;
						line-height: 36rpx;
						padding: 2px 6px;
						font-size: 22rpx;
						&.typeName1 {
							color: #ff4b4b;
							border: 1px solid #ff4b4b;
						}
						&.typeName2 {
							color: #ef9b29;
							border: 1px solid #ef9b29;
						}
						&.typeName3 {
							color: #57c77a;
							border: 1px solid #57c77a;
						}
					}
				}
				.moneybox {
					margin-top: 10px;
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
					& > button {
						height: 46rpx;
						line-height: 46rpx;
						font-size: 28rpx;
						border-radius: 23rpx;
						padding: 0 24rpx;
						background: #ff5858;
						color: #fff;
					}
					.bg-cancel {
						background: #f1f1f1 !important;
						color: #fff;
					}
				}
			}
		}
	}
}
</style>
