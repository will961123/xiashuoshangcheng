<template>
	<view class="forget">
		<view class="cu-form-group">
			<view class="title">手机号</view>
			<input v-model="formData.phone" placeholder="请输入手机号" name="input" />
		</view>
		<view class="cu-form-group">
			<input v-model="formData.code" placeholder="请输入验证码" name="input" />
			<button @click="getCode" class="cu-btn  bg-white shadow" style="color: #f23030;">{{ time ? `${time} 秒获取` : '获取验证码' }}</button>
		</view>
		<view class="cu-form-group">
			<view class="title">新密码</view>
			<input  type='password' v-model="formData.pwd" placeholder="输入新的登录密码" name="input" />
		</view>
		<view class="cu-form-group">
			<view class="title">确认密码</view>
			<input  type='password' v-model="formData.repwd" placeholder="请再次确认登录密码" name="input" />
		</view>
		<view @click="forget" class="forgetbtn">确认</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			time: '',
			formData: {
				phone: '',
				pwd: '',
				repwd: '',
				code: ''
			}
		};
	},
	methods: {
		forget() {
			if (!this.formData.phone) {
				this.showToast(`请输入手机号`);
				return;
			}
			if (!this.checkPhone(this.formData.phone)) {
				this.showToast(`请输入正确手机号`);
				return;
			}
			if (!this.formData.code) {
				this.showToast(`请输入验证码`);
				return;
			}
			if (!this.formData.pwd) {
				this.showToast(`请输入密码`);
				return;
			}
			if (this.formData.pwd !== this.formData.repwd) {
				this.showToast(`请输入相同密码`);
				return;
			}
		},
		getCode() {
			if (this.time) {
				this.showToast(`等待${this.time}秒再点击`);
				return;
			}
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
.forget {
	padding-top: 20rpx;
	background: #f5f5f5;
	.title {
		font-family: PingFang-SC-Medium;
		font-size: 30rpx;
		color: #333;
	}
	.forgetbtn {
		width: 100%;
		height: 88rpx;
		line-height: 88rpx;
		color: #fff;
		font-size: 36rpx;
		text-align: center;
		background-image: linear-gradient(-90deg, #ff585f 0%, #ff826a 100%);
		border-radius: 44rpx;
		margin-top: 40px;
		margin-bottom: 20px;
	}
}
</style>
