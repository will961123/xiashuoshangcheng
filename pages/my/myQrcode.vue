<template>
	<view class="myQrcode">
		<image src="/static/qrcodebg.png" style="width: 100%;height: 100%;position: absolute;" class="bg-img"></image>
		<view class="main">
			<view class="tit">{{userInfo?(userInfo.account||userInfo.wxName):''}}的专属二维码</view>
			<image :src="qrcode" mode="aspectFit"></image>
			<button @click="Forward" class="btn cu-btn">转发我的二维码</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			userInfo: {},
			qrcode: ''
		};
	},
	onLoad() {
		this.userInfo = uni.getStorageSync('userInfo');
	},
	methods: {
		getQrcode() {
			this.request({
				url: '',
				data: {
					userId: userInfo.userId
				},
				success: res => {
					if (res.data.returnCode === 1) {
						this.qrcode = res.data.obj;
					}
				}
			});
		},
	}
};
</script>

<style lang="scss">
uni-page-body {
	height: 100%;
}
page {
	height: 100%;
}
.myQrcode {
	height: 100%;
	position: relative;
	.main {
		margin: 0 auto;
		// padding-top: 368rpx;
		position: relative;
		top: 28%;
		width: 480rpx;
		text-align: center;

		.tit {
			font-size: 30rpx;
			letter-spacing: 2rpx;
			color: #333333;
		}
		& > image {
			width: 334rpx;
			height: 334rpx;
			margin: 80rpx 0 134rpx 0;
		}
		.btn {
			width: 100%;
			height: 88rpx;
			background-image: linear-gradient(-90deg, #ff585f 0%, #ff826a 100%);
			border-radius: 44rpx;
			font-size: 30rpx;
			color: #fefefe;
		}
	}
}
</style>
