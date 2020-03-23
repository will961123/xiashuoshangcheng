<template>
	<view class="myPrize bg-white">
		<view @click="gotoMyPrize(1)" class="item bg-red flex align-center">
			<image src="/static/mycounp.png" mode="widthFix"></image>
			我的奖券
		</view>
		<view @click="gotoMyPrize(2)" class="item bg-red flex align-center">
			<image style="width: 40rpx;" src="/static/myprize.png" mode="widthFix"></image>
			我的奖品
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	methods: {
		gotoMyPrize(type) {
			switch (type) {
				case 1:
					uni.navigateTo({
						url: '/pages/my/myCouponList'
					});
					break;
				case 2:
					uni.navigateTo({
						url: '/pages/my/myPrizeList'
					});
					break;
			}
		}
	}
};
</script>

<style lang="less">
.myPrize {
	height: 100vh;
	padding: 0 20rpx;
	padding-top: 14px;
	.item {
		line-height: 46px;
		color: #fff;
		font-size: 30rpx;
		padding: 0 30rpx;
		margin-bottom: 14px;
		border-radius: 8px;
		& > image {
			width: 35rpx;
			margin-right: 10px;
		}
	}
}
</style>
