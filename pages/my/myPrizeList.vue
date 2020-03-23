<template>
	<view class="Integral">
		<view class="titBox flex ">
			<view style="margin-right: 50rpx;" @click="changeType(0)" :class="[{ select: freeTitType === 0 }]" class="tit">待发货</view>
			<view @click="changeType(1)" :class="[{ select: freeTitType === 1 }]" class="tit">待收货</view>
		</view>
		<view class="lsitbox " style="border: none;">
			<view v-if="item.status === freeTitType" v-for="(item, index) in goodsList" :key="index" class="itemFree  flex align-center">
				<image :src="item.smallPic" mode="aspectFill"></image>
				<view style="height: auto;" class="infobox flex flex-direction justify-between">
					<view class="info textov2">{{ item.name }}此标题最多显示2行此标题最多显示2行此标题最多</view>
					<view class="moneybox flex align-center justify-between">
						<view class="money">￥123</view>
						<!-- <view class="xl">剩余{{ item.saleNum }}份</view> -->
						<button v-if="item.status === 0" @click="clickBtn(item.id, item.status)" class="btn cu-btn  ">填写地址</button>
						<button v-else @click="clickBtn(item.id, item.status)" class="btn cu-btn  ">确认收货</button>
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
			goodsList: [
				{
					smallPic: '/static/goods.jpg',
					name: '0元',
					price: 100,
					saleNum: 999,
					id: 1,
					status: 0
				},
				{
					smallPic: '/static/goods.jpg',
					name: '会员免费',
					price: 100,
					saleNum: 999,
					id: 2,
					status: 1
				}
			], 
			freeTitType: 0,  
		};
	},
	onLoad(options) {},
	methods: {
		changeType(type) {
			if (type === this.freeTitType) {
				return;
			}
			this.freeTitType = type;
		},
		clickBtn(id, type) {
			if (type === 0) {
				var that = this;
				uni.getSetting({
					success(res) { 
						if (res.authSetting['scope.address']) {
							uni.chooseAddress({
								success(res) {
									console.log(res);
									that.addressInfo = res;
								}
							});
						} else {
							if (res.authSetting['scope.address'] == false) {
								uni.openSetting({
									success(res) {
										if (res.authSetting['scope.address']) {
											uni.chooseAddress({
												success(res) {
													console.log(res);
													that.addressInfo = res;
												}
											});
										}
									}
								});
							}
						}
					}
				});
			} else if (type === 1) {
				uni.showModal({
					title:'确认收货',
					content:'确定要确认收货吗？',
					success:res=>{
						if(res.confirm){
							this.showToast('确认收货');
						}
					}
				})
			}
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
