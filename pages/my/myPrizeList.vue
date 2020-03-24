<template>
	<view class="Integral">
		<view class="lsitbox " style="border: none;">
			<view v-for="(item, index) in goodsList" :key="index" class="itemFree  flex align-center">
				<image :src="item.prize_picture" mode="aspectFill"></image>
				<view style="height: auto;" class="infobox flex flex-direction justify-between">
					<view class="info textov2">{{ item.prize_name }}</view>
					<view class="moneybox flex align-center justify-between">
						<view class="money">￥0</view>
						<!-- <view class="xl">剩余{{ item.saleNum }}份</view> -->
						<button @click="clickBtn(item)" class="btn cu-btn  ">填写地址</button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			goodsList: [],
			addressInfo: null
		};
	},
	onLoad(options) {
		this.getList();
	},
	methods: {
		getList() {
			this.showLoading();
			this.request({
				url: '/prize/myPrizeList',
				data: {},
				success: res => {
					uni.hideLoading();
					console.log('奖品列表', res);
					if (res.data.status === 1) {
						res.data.list = res.data.list.map(i => {
							i.prize_picture = res.data.image_url + i.prize_picture;
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
					productId: item.id,
					productName: item.prize_name,
					productPic: item.prize_picture,
					price: 0,
					number: 1,
					total: 0
				}
			];
			let url = '/pages/index/confirmOrder?from=3&goodslist=' + JSON.stringify(goodslist) + '&buyType=6'; 
			uni.navigateTo({
				url: url
			});  
		}
	}
};
</script>

<style lang="scss">
.Integral {
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
				}
			}
		}
	}
}
</style>
