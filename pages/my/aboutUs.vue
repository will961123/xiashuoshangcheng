<template>
	<view class="aboutUs">
		<view class="bg-img"><image src="/static/aboutusbg.png" mode="aspectFill"></image></view>
		<view class="item bg-white">
			<view class="tit">公司简介</view>
			<view class="main">{{ aboutUs.content }}</view>
		</view>
		<view class="item bg-white">
			<view class="tit">联系方式</view>
			<view class="main flex align-center justify-between">
				<view>
					<view class="phone">{{ contact.phone }}</view>
					<view class="name">联系人：{{ contact.name }}</view>
				</view>
				<image src="/static/abuotphone.png" mode="aspectFit"></image>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			aboutUs: {},
			contact: {}
		};
	},
	onLoad() {
		this.getAboutUs();
		this.findContact()
	},
	methods: {
		getAboutUs() {
			this.showLoading();
			this.request({
				url: '/appAbout/find',
				data: {},
				success: res => {
					console.log('关于我们', res);
					uni.hideLoading();
					if (res.data.errMsg === 'request:ok') {
						this.aboutUs = res.data[0];
					}
				}
			});
		},

		findContact() {
			this.request({
				url: '/appcontact/findContact',
				data: {},
				success: res => {
					console.log('联系方式', res);
					if (res.data.returnCode === 1) {
						this.contact = res.data.obj;
					}
				}
			});
		}
	}
};
</script>

<style lang="scss">
.aboutUs {
	.bg-img {
		width: 100%;
		height: 200px;
		& > image {
			width: 100%;
			height: 100%;
		}
	}
	.item {
		margin-bottom: 10px;
		padding: 0 30rpx 0 30rpx;
		font-size: 26rpx;
		.tit {
			font-size: 28rpx;
			letter-spacing: 1rpx;
			color: #0d0d0d;
			line-height: 112rpx;
			border-bottom: 1rpx solid #ededed;
		}
		.main {
			padding: 30rpx 0;
			letter-spacing: 1rpx;
			line-height: 1.8em;
			color: #999999;
			& > image {
				width: 40rpx;
				height: 40rpx;
			}
		}
	}
}
</style>
