<template>
	<view class="myPrize  ">
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
	// padding: 0 20rpx;
	// padding-top: 14px;
	padding-top: 6px;
	background: #f2f2f2;
	.item {
		line-height: 40px;
		color: #000;
		background: #fff;
		// color: #fff;
		font-size: 30rpx;
		padding: 0 30rpx;
		// margin-bottom: 14px; 
		margin-bottom: 1px; 
		// border-radius: 8px;
		& > image {
			width: 35rpx;
			margin-right: 10px;
		}
	}
}
</style>
