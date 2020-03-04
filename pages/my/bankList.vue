<template>
	<view class="bankList">
		<view @click="showMc(1)" class="addCard flex align-center justify-between bg-white">
			<view>
				<text style="margin-right: 20rpx;">+</text>
				添加银行卡
			</view>
			<image src="/static/aroow.png" mode="aspectFit"></image>
		</view>
		<view class="listBox">
			<view v-for="(item, index) in Cardlsit" :key="index" class="item ">
				<view @click="setBankInfo(item)" class="topinfo flex align-center justify-between text-white">
					<view class="left">
						<view class="namebox">
							<text class="bank">{{ item.bankNmae }}</text>
							<text>{{ item.name }}</text>
						</view>
						<view class="number">{{ item.cardId | newStr }}</view>
					</view>
					<image v-if="false" class="whitebox" src="/static/bankselect.png" mode="aspectFit"></image>
				</view>
				<view class="bottombtnbox flex bg-white align-center justify-between ">
					<view @click="showMc(2, $event)" :data-item="JSON.stringify(item)" class="btn text-center">修改</view>
					<view class="line"></view>
					<view class="btn del text-center">删除</view>
				</view>
			</view>
		</view>

		<will-mc v-if="showAddcard">
			<view class="main bg-white">
				<view class="tit">{{ type === 1 ? '添加银行卡' : '修改银行卡' }}</view>
				<view class="item flex align-center text-right">
					姓名
					<input type="text " v-model="cardInfo.name" placeholder="请输入" />
				</view>
				<view class="item flex align-center text-right">
					开户行
					<input type="text" v-model="cardInfo.bankNmae" placeholder="请输入" />
				</view>
				<view class="item flex align-center text-right">
					银行卡号
					<input type="text" v-model="cardInfo.cardId" placeholder="请输入" />
				</view>
				<button @click="saveCard" class="btn cu-btn text-white">提交</button>
				<image @click="showAddcard = false" class="close" src="/static/backdel.png" mode="widthFix"></image>
			</view>
		</will-mc>
	</view>
</template>

<script>
export default {
	data() {
		return {
			CansetBankInfo: false,
			Cardlsit: new Array(4).fill({ name: '李拴蛋', bankNmae: '建设银行', cardId: '123456789000' }),
			showAddcard: false,
			type: 1, // 1添加 2修改

			cardInfo: {
				name: '',
				bankNmae: '',
				cardId: ''
			}
		};
	},
	onLoad(options) {
		let CansetBankInfo = options.setBankInfo;
		if (CansetBankInfo) {
			this.CansetBankInfo = true;
		}
	},
	filters: {
		newStr(val) {
			let newStr = '';
			for (let i = 1; i < val.length + 1; i++) {
				newStr += val[i - 1];
				if (i % 4 === 0) {
					newStr += ' ';
				}
			}
			return newStr;
		}
	},
	methods: {
		saveCard() {
			if (!this.cardInfo.name) {
				this.showToast('请输入姓名');
				return;
			}
			if (!this.cardInfo.bankNmae) {
				this.showToast('请输入开户行');
				return;
			}
			if (!this.cardInfo.name) {
				this.showToast('请输入银行卡');
				return;
			}
			this.showLoading();
			this.request({
				url: '/',
				data: {
					id: this.type === 2 ? '' : ''
				},
				success: res => {
					uni.hideLoading();
					this.showAddcard = false;
					if (res.data.returnCode === 1) {
						this.showToast(this.type === 1 ? '新增成功' : '修改成功');
					} else {
						this.showToast(res.data.returnStr);
					}
				}
			});
		},
		getCardList() {
			this.showLoading();
			this.request({
				url: '/',
				data: {},
				success: res => {
					uni.hideLoading();
					if (res.data.returnCode === 1) {
						this.Cardlsit.push(res.data.list);
					}
				}
			});
		},
		showMc(type, e) {
			if (type == 1) {
				this.cardInfo = {
					name: '',
					bankNmae: '',
					cardId: ''
				};
			} else {
				this.cardInfo = JSON.parse(e.currentTarget.dataset.item);
			}

			this.type = type;
			this.showAddcard = true;
		},
		setBankInfo(item) {
			if (!this.CansetBankInfo) {
				return;
			}
			uni.setStorageSync('bankInfo', item);
			uni.navigateBack({});
		}
	}
};
</script>

<style lang="scss">
page {
	background: #f5f5f5;
}
.bankList {
	.addCard {
		height: 44px;
		padding: 0 30rpx;
		font-size: 28rpx;
		color: #333333;
		& > image {
			width: 12rpx;
			height: 24rpx;
		}
	}

	.listBox {
		padding: 15px 30rpx 0 30rpx;
		.item {
			width: 100%;
			border-radius: 5px;
			overflow: hidden;
			margin-bottom: 10px;

			.topinfo {
				height: 90px;
				background-image: linear-gradient(89deg, #fd9785 0%, #fd797e 100%);
				padding: 0 28rpx;
				.left {
					padding: 20px 0;
					.namebox {
						font-size: 28rpx;
						letter-spacing: 1rpx;
						.bank {
							font-size: 32rpx;
							margin-right: 40rpx;
						}
					}
					.number {
						font-size: 28rpx;
						letter-spacing: 1rpx;
						margin-top: 26rpx;
					}
				}
				.whitebox {
					width: 36rpx;
					height: 36rpx;
				}
			}
			.bottombtnbox {
				.btn {
					flex: 1;
					line-height: 44px;
					&.del {
						color: #f23030;
					}
				}
				.line {
					width: 1rpx;
					height: 32rpx;
					background-color: #d9d9d9;
				}
			}
		}
	}

	.main {
		position: relative;
		border-radius: 10px;
		margin-top: 120px;
		.tit {
			font-size: 32rpx;
			color: #333333;
			line-height: 57px;
			border-bottom: 1rpx solid #ededed;
			margin-bottom: 12px;
		}
		.item {
			height: 48px;
			font-size: 28rpx;
			padding: 0 30rpx;
			color: #333333;
			& > input {
				flex: 1;
				height: 100%;
				font-size: 28rpx;
			}
		}
		.btn {
			width: calc(100% - 60rpx);
			height: 48px;
			background-image: linear-gradient(-90deg, #ff585f 0%, #ff826a 100%);
			border-radius: 24px;
			margin: 24px 0 40px 0;
			font-size: 32rpx;
		}
		.close {
			position: absolute;
			width: 68rpx;
			right: 0;
			top: 0;
			transform: translateY(-100%);
		}
	}
}
</style>
