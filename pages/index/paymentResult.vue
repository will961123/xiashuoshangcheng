<template>
	<view class="paymentResult bg-white">
		<image :src="type === 1 ? '/static/paysuccess.png' : '/static/payerror.png'" mode="aspectFill"></image>
		<view class="tip1">{{ type === 1 ? '支付成功' : '支付失败' }}</view>
		<view v-if="type === 1" class="tip2">订单已完成</view>
		<button @click="gotoMyOrder" :class="{ mtop: type === 2 }" class="btn cu-btn">查看订单详情</button>
	</view>
</template>

<script>
export default {
	data() {
		return {
			type: 1 // 1成功 2失败
		};
	},
	onLoad(options) {
		if (options) {
			this.type = Number(options.type);
		}
	},
	methods: {
		gotoMyOrder() {
			uni.redirectTo({
				url: '/pages/my/myOrder?type=' + (this.type === 1 ? 2 : 1)
			});
		}
	}
};
</script>

<style lang="scss">
.paymentResult {
	padding: 60rpx 0 80rpx 0;
	text-align: center;
	image {
		width: 260rpx;
		height: 220rpx;
	}
	.tip1 {
		font-size: 36rpx;
		color: #333333;
	}
	.tip2 {
		font-size: 24rpx;
		color: #999999;
		margin: 15rpx 0 20rpx 0;
	}
	.btn {
		width: 320rpx;
		height: 88rpx;
		line-height: 88rpx;
		background-image: linear-gradient(0deg, #ff585f 0%, #ff826a 100%);
		border-radius: 44rpx;
		font-size: 32rpx;
		color: #ffffff;
	}
	.mtop {
		margin-top: 29rpx;
	}
}
</style>
