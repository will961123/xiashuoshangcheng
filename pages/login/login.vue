<template>
	<view>
		<image src="/static/login_bg.png" style="width: 100%;" mode="widthFix"></image>
		<view class="mine bg-white">
			<view class="flex justify-center ">
				<view @click="changeType(1)" class="tit" :class="{ select: type === 1 }" style=" margin-right: 65rpx;">登录</view>
				<view @click="changeType(2)" class="tit" :class="{ select: type === 2 }">注册</view>
			</view>
			<view class="iptbox flex align-center">
				<image src="/static/login_phone.png" mode="aspectFit"></image>
				<input v-model="formData.phone" type="text" value="" placeholder="请输入您的手机号" />
			</view>
			<view v-show="type === 2" class="flex align-center " style="height: 88rpx;">
				<view class="iptbox flex align-center">
					<image src="/static/code.png" mode="aspectFit"></image>
					<input v-model="formData.code" type="text" value="" placeholder="请输入验证码" />
				</view>
				<view class="code" @click="getCode">{{ time ? `${time} 秒获取` : '获取验证码' }}</view>
			</view>
			<view class="iptbox flex align-center">
				<image src="/static/login_mm.png" mode="aspectFit"></image>
				<input v-model="formData.pwd" type="password" value="" placeholder="请输入您的密码" />
			</view>
			<view v-show="type === 2" class="xieyi flex align-center">
				<image @click="select = !select" :src="select ? '/static/select.png' : '/static/no.png'" mode="aspectFit"></image>
				<text @click="showMc = true">阅读相关协议并同意</text>
			</view>
			<view @click="rejistOrlogin" class="login " :class="{ rejist: type === 2 }">{{ type === 2 ? '注册' : '登录' }}</view>
			<navigator v-show="type === 1" class="forget" url="/pages/login/forget">忘记密码</navigator>
		</view>

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
			type: 1, //1登录 2注册
			select: false,
			time: '',
			trueCode: '',
			formData: {
				phone: '',
				pwd: '',
				code: ''
			},
			userAgreementTXT: '',
			showMc: false
		};
	},
	onLoad() {
		this.userAgreement();
	},
	methods: {
		userAgreement() {
			this.showLoading();
			this.request({
				url: '/appUserAgreement/find',
				data: {},
				success: res => {
					uni.hideLoading();
					console.log('用户协议', res);
					if (res.data.returnCode === 1) {
						this.userAgreementTXT = res.data;
					}
				}
			});
		},
		rejistOrlogin() {
			if (!this.formData.phone) {
				this.showToast(`请输入手机号`);
				return;
			}
			if (!this.checkPhone(this.formData.phone)) {
				this.showToast(`请输入正确手机号`);
				return;
			}
			if (!this.formData.pwd) {
				this.showToast(`请输入密码`);
				return;
			}
			if (this.type === 1) {
				console.log('登录', this.type);
			} else {
				if (!this.select) {
					this.showToast(`请勾选协议`);
					return;
				}
				if (!this.formData.code) {
					this.showToast(`请输入验证码`);
					return;
				}
				if (!this.trueCode) {
					this.showToast(`请获取验证码`);
					return;
				}
				if (!this.trueCode == this.formData.code) {
					this.showToast(`验证码错误`);
					return;
				}
				this.showLoading();
				this.request({
					url: '/appLogin/saveUser',
					data: {
						account: this.formData.phone,
						phone: this.formData.phone,
						password: this.formData.pwd
					},
					success: res => {
						uni.hideLoading();
						console.log('注册', res);
					}
				});
			}
		},
		changeType(type) {
			if (this.type === type) {
				return;
			}
			this.type = type;
			this.formData = {
				phone: '',
				pwd: '',
				code: ''
			};
		},
		getCode() {
			if (this.time) {
				this.showToast(`等待${this.time}秒再点击`);
				return;
			}
			if (!this.formData.phone) {
				this.showToast(`输入手机号`);
				return;
			}
			this.showLoading();
			this.request({
				url: '/appLogin/sendVerifyNum',
				data: {
					phone: this.formData.phone
				},
				success: res => {
					uni.hideLoading();
					console.log('手机号', res);
					if (res.data.returnCode === 1) {
						this.showToast('发送成功');
						this.trueCode = res.data.returnStr;
					} else {
						this.showToast(res.data.returnStr);
					}
				}
			});
			this.time = 60;
			let timer = setInterval(() => {
				this.time -= 1;
				if (this.time < 0) {
					this.time = '';
					clearInterval(timer);
				}
			}, 1000);
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
