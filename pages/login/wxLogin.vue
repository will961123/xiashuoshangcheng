<template>
	<view>
		<image src="/static/login_bg.png" style="width: 100%;" mode="widthFix"></image>

		<will-mc class="mc" v-if="showGetAuthor">
			<view class="_mcMain bg-white ">
				<!-- <image @click="showGetAuthor = false" src="/static/delect.png" mode=""></image> -->
				<view class="tit">欢迎授权登录霞烁商城</view>
				<view class="tip">授权登录后即可使用哦~</view>
				<button @getuserinfo="getOpenId_btn" class="btn cu-btn" open-type="getUserInfo">点击授权</button>
			</view>
		</will-mc>

		<will-mc class="mc" v-if="showMc">
			<view class="userAgreementTXT  bg-white radius" style="height: 75%; width: 100%;margin-top: 80px;overflow-y: auto; padding: 30rpx;position: relative;">
				{{ userAgreementTXT }}
				<image @click="showMc = false" src="/static/delect.png" mode="aspectFill" style="width: 16px;height: 16px;position: absolute;right: 10px;top: 10px;"></image>
			</view>
		</will-mc>
	</view>
</template>

<script>
export default {
	data() {
		return {
			showGetAuthor: true,
			userAgreementTXT: '',
			showMc: false
		};
	},
	onLoad() {},
	methods: {
		getOpenId_btn(e) { 
			this.showLoading();
			console.log('按钮信息', e);
			if (e.detail.errMsg === 'getUserInfo:ok') {
				uni.login({
					provider: 'weixin',
					success: code => {
						console.log('code', code);
						this.request({
							url: '',
							data: {
								appId: this.appId,
								appScret: this.appScret,
								code: code.code
							},
							success: res => {
								console.log('openid', res);
								if (res.data.returnCode === 1) {
									uni.setStorageSync('openId', res.data.obj.openid);
									// that.showGetAuthor = false;
									this.checkUserInfo_wx();
								} else {
									uni.hideLoading();
									this.showToast(res.data.returnStr);
								}
							}
						});
					}
				});
			} else {
				uni.hideLoading();
			}
		},
		checkUserInfoByOpenid() {
			this.request({
				url: '',
				data: {
					openId: uni.getStorageSync('openId')
				},
				success: res => {
					uni.hideLoading();
					if (res.data.returnCode === 1) {
						uni.setStorageSync('userInfo', res.data.obj);
						uni.switchTab({
							url: '/pages/index/index'
						});
					} else {
						this.showToast(res.data.returnStr);
					}
				}
			});
		}
	}
};
</script>

<style lang="scss">
.mine {
	width: 640rpx;
	margin: 0 auto;
	transform: translateY(-180rpx);
	box-shadow: 0px 10px 40px 0px rgba(223, 223, 223, 0.91);
	border-radius: 28rpx;
	padding: 70rpx 40rpx;
	.tit {
		font-size: 36rpx;
		color: #000;
		padding: 0 8rpx;
		padding-bottom: 10rpx;
		font-weight: bold;
		border-bottom: 6rpx solid #fff;
		&.select {
			border-bottom-color: #ff585f;
			color: #ff585f;
		}
	}
	.iptbox {
		background: #f8f8f8;
		border-radius: 14rpx;
		font-size: 28rpx;
		margin-top: 40rpx;
		height: 88rpx;

		& > image {
			width: 30rpx;
			height: 36rpx;
			margin: 0 35rpx;
		}
		& > input {
			flex: 1;
		}
	}
	.code {
		box-sizing: border-box;
		width: 210rpx;
		text-align: center;
		line-height: 88rpx;
		height: 88rpx;
		border: solid 1px #ff585f;
		color: #ff585f;
		border-radius: 14rpx;
		margin-left: 10rpx;
		margin-top: 40rpx;
	}
	.xieyi {
		margin-top: 24rpx;
		margin-bottom: 34rpx;
		font-size: 26rpx;
		color: #333;
		& > image {
			width: 32rpx;
			height: 32rpx;
			margin-right: 20rpx;
		}
	}

	.login {
		width: 100%;
		height: 88rpx;
		line-height: 88rpx;
		color: #fff;
		font-size: 36rpx;
		text-align: center;
		background-image: linear-gradient(-90deg, #ff585f 0%, #ff826a 100%);
		border-radius: 44rpx;
		margin-top: 30px;
		margin-bottom: 20px;
	}
	.rejist {
		margin-top: 0;
	}
	.forget {
		font-family: PingFang-SC-Medium;
		font-size: 28rpx;
		color: #ff585f;
		text-align: center;
	}
}
</style>
