<template>
	<view class="integral">
		<!-- 1积分 2余额 -->
		<view v-if="type == 1" class="banner   type1 flex justify-center align-center text-center text-white">
			<image class="bg-img" src="/static/jfbg1.png" mode=""></image>
			<view style="z-index: 99;">
				<view class="num">1234</view>
				<view class="tit">我的积分</view>
			</view>
		</view>
		<view v-if="type == 2" class="banner  type2 flex justify-center align-center text-center text-white" style=" height: 200px;position: relative;">
			<image class="bg-img" src="/static/jfbg1.png" mode=""></image>
			<view style="z-index: 99;">
				<view class="num">1234</view>
				<view class="tit">我的余额</view>
				<button @click="gotoIntegralWithdraw" class="btn cu-btn bg-white">提现</button>
			</view>
		</view>

		<view class="listBox bg-white">
			<view class="tit">{{ type == 1 ? '积分明细' : '余额明细' }}</view>
			<view v-for="(item, index) in integralList" :key="index" class="item flex align-center justify-between">
				<view class="left">
					<view class="type">{{ item.type }}</view>
					<view class="date">{{ item.date }}</view>
				</view>
				<view class="num">
					<text>{{ item.row === 1 ? '+' : '-' }}</text>
					<text v-if="type == 2">￥</text>
					{{ item.num }}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			type: 1, //1收藏 2足迹
			offset: 1,
			integralList: new Array(3).fill({ type: '签到', row: 1, num: 100, date: '2019-06-03 24:00:00' }) 
		};
	},
	onLoad(options) {
		this.type = options.type || 1;
		uni.setNavigationBarTitle({
			title: this.type == 1 ? '积分' : '余额'
		});
		this.getIntegralList();
	},
	methods: {
		gotoIntegralWithdraw() {
			uni.navigateTo({
				url: '/pages/my/balanceWithdraw'
			});
		},
		getIntegralList() {
			let userInfo = uni.getStorageSync('userInfo');
			if (!userInfo) {
				this.showToast('请先登录');
				return;
			}
			// 1 积分 2余额
			let url = '';
			let formData = { 
				userId: userInfo.userId, 
			};
			if (this.type == 2) {
				url = '';
			}
			this.showLoading();
			this.request({
				url: url,
				data: formData,
				success: res => {
					console.log(this.type == 1 ? '积分' : '余额', res);
					uni.hideLoading();
					if (res.data.returnCode === 1) {
						this.offset += 1;
						this.integralList.push(...res.data.list);
					}
				}
			});
		}
	}
};
</script>

<style lang="scss">
.integral {
	.banner {
		height: 140px;
		position: relative;
		.bg-img {
			width: 100%;
			height: 100%;
			position: absolute;
			left: 0;
			top: 0;
		}
		.num {
			font-size: 60rpx;
			letter-spacing: 4rpx;
		}
		.tit {
			font-size: 24rpx;
		}
		.btn {
			width: 200rpx;
			height: 60rpx;
			border-radius: 30rpx;
			margin-top: 20px;
			font-size: 32rpx;
			letter-spacing: 1rpx;
			color: #f23030;
		}
	}
	.listBox {
		.tit {
			font-size: 32rpx;
			color: #333333;
			padding: 0 30rpx;
			line-height: 44px;
		}
		.item {
			border-top: 1rpx solid #e5e5e5;
			padding: 0 30rpx;
			height: 56px;
			.left {
				.type {
					font-size: 28rpx;
					color: #333333;
				}
				.date {
					font-size: 24rpx;
					color: #999999;
				}
			}
			.num {
				font-size: 30rpx;
				color: #333333;
			}
		}
	}
}
</style>
