<template>
	<view class="balanceWithdraw">
		<view class="topbox bg-white">
			<view class="money flex justify-between">
				当前余额
				<text>￥{{ userInfo.balance||0 }}</text>
			</view>
			<view @click="gotoSetBnakList" class="bank flex justify-between align-center">
				<view v-if="bankInfo" class="left ">
					<view class="name">{{ bankInfo.bankNmae }}</view>
					<view class="tip">尾号 {{ bankInfo.cardId | newStr }}</view>
				</view>
				<view v-else class="left "><view class="name">请选择银行卡</view></view>
				<image src="/static/aroow.png" mode="aspectFit"></image>
			</view>
		</view>

		<view class="moneyBox bg-white">
			<view class="listbox flex justify-between flex-wrap">
				<view @click="changeSelectIdx(index)" v-for="(item, index) in moneyList" :key="index" :class="{ select: selectIdx == index }" class="item text-center">{{ item }}</view>
			</view>
			<view class="inputbox">
				<view class="tip">提现金额</view>
				<view class="iptbox flex align-center">
					￥
					<input @input="selectIdx = -1" v-model="money" type="number" placeholder="请输入提现金额" value="" />
				</view>
			</view>
		</view>

		<view class="btnBox bg-white text-center">
			<button @click="balanceWithdraw" class="btn cu-btn text-white text-content">立即提现</button>
			<view class="tip">提现说明：每次提现最少提现金额100.00元</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			money: '',
			userInfo: '',
			bankInfo: '',
			moneyList: [10, 20, 30, 40, 600],
			selectIdx: -1
		};
	},
	onLoad() {
		// this.checkUserInfo();
	},
	onShow() {
		this.getBankInfo();
	},
	filters:{
		newStr(val){ 
			if(!val){
				return
			}
			return val.slice(-6)
		}
	},
	methods: {
		gotoSetBnakList() {
			uni.navigateTo({
				url: '/pages/my/bankList?setBankInfo=true'
			});
		},
		getBankInfo() {
			let bankInfo = uni.getStorageSync('bankInfo');
			console.log(bankInfo);
			if (bankInfo) {
				this.bankInfo = bankInfo;
			}
		},
		checkUserInfo() {
			this.showLoading(),
				this.request({
					url: '/',
					data: {},
					success: res => {
						uni.hideLoading();
						if (res.data.returnCode === 1) {
							this.userInfo = res.data.obj;
						}
					}
				});
		},
		balanceWithdraw() {
			if (!this.money) {
				this.showToast('请输入金额');
				return;
			}
			if (Number(this.money) % 100 !== 0) {
				this.showToast('请输入100倍数');
				return;
			}
			if (!this.bankInfo) {
				this.showToast('请选择银行卡');
				return;
			}
		},
		changeSelectIdx(idx) {
			this.selectIdx = idx;
			this.money = this.moneyList[this.selectIdx];
		}
	}
};
</script>

<style lang="scss">
.balanceWithdraw {
	.topbox {
		padding: 0 30rpx;
		margin-bottom: 10px;
		.money {
			line-height: 57px;
			font-size: 28rpx;
			color: #333333;
			& > text {
				font-size: 30rpx;
				color: #f23030;
			}
		}
		.bank {
			border-top: 1rpx solid #ededed;
			height: 60px;
			.left {
				font-size: 28rpx;
				color: #333333;
				.tip {
					font-size: 26rpx;
					color: #999999;
				}
			}
			& > image {
				width: 12rpx;
				height: 24rpx;
			}
		}
	}

	.moneyBox {
		border-bottom: 1rpx solid #ededed;
		padding: 30px 30rpx 20px 30rpx;
		.listbox {
			.item {
				width: 160rpx;
				height: 40px;
				line-height: 40px;
				border-radius: 5px;
				border: solid 1rpx #999999;
				color: #333;
				font-size: 28rpx;
				margin-bottom: 14px;
				&.select {
					border: solid 1rpx #f23030;
					color: #f23030;
				}
			}
		}
		.inputbox {
			color: #333333;
			.tip {
				font-size: 28rpx;
				padding: 30px 0 0 0;
			}
			.iptbox {
				font-size: 28rpx;
				padding: 15px 0 0 0;
				& > input {
					font-size: 24rpx;
					flex: 1;
					margin-left: 17rpx;
				}
			}
		}
	}

	.btnBox {
		padding: 33px 30rpx 15px 30rpx;
		.btn {
			width: 100%;
			height: 44px;
			background-image: linear-gradient(-90deg, #ff585f 0%, #ff826a 100%);
			border-radius: 22px;
		}
		.tip {
			font-size: 24rpx;
			letter-spacing: 1rpx;
			color: #666666;
			margin-top: 10px;
		}
	}
}
</style>
