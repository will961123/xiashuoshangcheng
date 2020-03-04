<template>
	<view class="realNameAuth">
		<view class="imgbgbox"><image src="/static/shirenrezbg.jpg" mode="widthFix"></image></view>
		<view class="main bg-white">
			<view class="item bb flex align-center justify-between">
				<text>真实姓名</text>
				<input type="text" v-model="name" placeholder="请输入您的姓名" />
			</view>
			<view class="item  flex align-center justify-between ">
				<text>身份证号</text>
				<input type="text" v-model="cardNumber" placeholder="请输入您的身份证号" />
			</view>
		</view>
		<view class="text-center"><button @click="checkIdNo" class="btn cu-btn">提交</button></view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			name: '',
			cardNumber: ''
		};
	},
	methods: {
		checkIdNo() {
			if (!this.name) {
				this.showToast('请输入真实姓名');
				return;
			}
			if (!this.cardNumber) {
				this.showToast('请输入您的身份证号');
				return;
			}
			this.showLoading();
			this.request({
				url: '',
				data: {
					realName: this.name,
					cardNo: this.cardNumber
				},
				success: res => {
					uni.hideLoading();
					console.log('校验结果', res);
					if (res.data.returnCode === 1) { 
						this.editClientIdNo()
					} else {
						this.showToast(res.data.returnStr);
					}
				}
			});
		},
		editClientIdNo() {
			let userInfo = uni.getStorageSync('userInfo');
			if (!userInfo) {
				this.showToast('请先登录');
				return;
			}
			this.showLoading();
			this.request({
				url: '',
				data: { 
					userId: userInfo.userId, 
					name: this.name,
					idNo: this.cardNumber
				},
				success: res => {
					uni.hideLoading();
					console.log('保存结果', res);
					if (res.data.returnCode === 1) {
						this.showToast('保存成功');
					} else {
						this.showToast(res.data.returnStr||'请输入真实信息');
					}
				}
			});
		}
	}
};
</script>

<style lang="scss">
.realNameAuth {
	.imgbgbox {
		width: 100%; 
		& > image {
			width: 100%;
			height: 100%;
		}
	}
	.main {
		position: relative;
		z-index: 99;
		top: -10px;
		border-radius: 8px 8px 0 0;
		.item {
			padding: 0 30rpx;
			height: 88rpx;
			text {
				font-size: 28rpx;
				color: #333;
			}
			input {
				text-align: right;
				flex: 1;
				font-size: 24rpx;
			}
			&.bb {
				border-bottom: 1rpx solid #ededed;
			}
		}
	}
	.btn {
		width: calc(100% - 60rpx);
		height: 96rpx;
		background-image: linear-gradient(-90deg, #ff585f 0%, #ff826a 100%);
		border-radius: 48rpx;
		color: #fff;
		font-size: 32rpx;
		letter-spacing: 1rpx;
		margin-top: 25px;
	}
}
</style>
