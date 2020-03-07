<template>
	<view class="confirmOrder">
		<view class="topbox bg-white">
			<view @click="chooseAddressInfo" v-if="addressInfo" class="addressbox flex justify-between align-center">
				<image class="address" src="/static/addredd.png" mode="aspectFit"></image>
				<view class="uinfobox">
					<view class="namebox">
						{{ addressInfo.name }}
						<text style="margin-left: 40rpx;">{{ addressInfo.phone }}</text>
					</view>
					<view class="addbox">{{ addressInfo.province }}-{{ addressInfo.city }}-{{ addressInfo.area }} {{ addressInfo.address }}</view>
				</view>
				<image class="row" src="/static/aroow.png" mode="aspectFill"></image>
			</view>
			<view @click="chooseAddressInfo" v-else class="noaddess flex align-center justify-between">
				<view class="left flex align-center">
					<image src="/static/addredd.png" mode="aspectFit"></image>
					<text>选择收货地址</text>
				</view>
				<image class="row" src="/static/aroow.png" mode="aspectFill"></image>
			</view>
			<image class="topbg" src="/static/addressorderbg.png"></image>
		</view>

		<view class="assemble bg-white margin-bottom-sm " v-if="isAssemble">
			<view class="tit">团队成员</view>
			<view v-if="assembleByself" class="userBox flex justify-center">
				<view class="item flex flex-direction align-center">
					<image src="/static/goods.jpg" mode="widthFix"></image>
					<view class="state">团长</view>
				</view>
			</view>
			<view v-else class="userBox flex justify-center">
				<view class="item flex flex-direction align-center">
					<image :src="assemble.user.captain.pic" mode="widthFix"></image>
					<view class="state">{{ assemble.user.captain.name }}</view>
				</view>
				<view v-for="(item, index) in assemble.user.team" :key="index" class="item flex flex-direction align-center">
					<image :src="item.pic" mode="widthFix"></image>
					<view class="state">已支付</view>
				</view>
				<view class="item flex flex-direction align-center">
					<image src="/static/goods.jpg" mode="widthFix"></image>
					<view class="state">待支付</view>
				</view>
			</view>
		</view>

		<view class="mainbox bg-white">
			<view class="payStyle flex justify-between align-center">
				支付方式
				<text>微信支付</text>
				<!-- <text @click="choosePayStyle" v-if="goodslist[0].hot != 4">{{ payStyle === 1 ? '微信支付' : payStyle === 2 ? '支付宝支付' : '余额支付' }}</text> -->
				<!-- <text v-else>{{ '积分支付' }}</text> -->
			</view>
			<view class="goodslist">
				<view v-for="(item, index) in goodslist" :key="index" class="item flex">
					<image :src="item.productPic" mode="aspectFill"></image>
					<view class="infobox flex flex-direction justify-between">
						<view>
							<view class="tip">{{ item.productName }}</view>
							<view class="gg">{{ item.productSpecName }}</view>
						</view>
						<view class="moneybox flex justify-between">
							<view v-if="goodslist[0].hot != 4" class="money">
								￥
								<text>{{ item.price }}</text>
							</view>
							<view v-else class="money">
								积分：
								<text>{{ item.price }}</text>
							</view>
							<view class="num">×{{ item.number }}</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 	<view class="sendStyle payStyle flex justify-between align-center">
				配送方式
				<view>
					快递包邮
					<image src="/static/aroow.png" mode="aspectFill"></image>
				</view>
			</view> -->
			<view class="message flex  align-center">
				买家留言
				<input type="text" v-model="message" placeholder="对本次交易的说明 " />
			</view>
			<view class="totbox">
				共{{ goodslist.length }}件商品
				<text class="ff">共计：</text>
				<text v-if="goodslist[0].hot != 4" class="money">￥{{ allPrice }}</text>
				<text v-else class="money">积分：{{ allPrice }}</text>
			</view>
		</view>

		<view class="buynowbox flex">
			<view v-if="goodslist[0].hot != 4" class="tot btn bg-white">￥{{ allPrice }}</view>
			<view v-else class="tot btn bg-white">积分：{{ allPrice }}</view>
			<button @click="saveOrder" class="buynow btn cu-btn">立即购买</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			from: 1, // 1 详情来 2 购物车来
			goodslist: [],
			cartIds: [],
			addressInfo: '',
			payStyle: 1, // 1wx 2ali 3yue
			message: '',

			isAssemble: false,
			assemble: {},
			assembleByself: false,
			
			buyType: 1// 1 普通 2 参与拼团 3 发起拼团 4 会员领取 5分享领取
		};
	},
	onLoad(options) {
			this.buyType  = options.buyType?Number(options.buyType):1
			console.log(this.buyType,"----1 普通 2 参与拼团 3 发起拼团 4 会员领取 5分享领取");
		if (options.from) {
			this.from = Number(options.type) || 1;
			this.goodslist = JSON.parse(options.goodslist);
			this.cartIds = options.cartIds ? JSON.parse(options.cartIds) : [];
			console.log('商品', this.goodslist, '购物车', this.cartIds);
		}
	
		
		if (options.buyType == 2) {
			this.assemble = JSON.parse(options.assemble);
			this.isAssemble = true; 
			console.log('参与拼团', this.assemble);
		}
		if (options.buyType == 3) {
			this.isAssemble = true;
			this.assembleByself = true;
			console.log('发起拼团');
		}
	},
	onShow() {
		let addressInfo = uni.getStorageSync('addressInfo');
		addressInfo ? (this.addressInfo = addressInfo) : '';
	},
	computed: {
		allPrice() {
			let allPrice = 0;
			for (let idx in this.goodslist) {
				allPrice += Number(this.goodslist[idx].total);
			}
			return allPrice;
		}
	},
	methods: {
		saveOrder() {
			if (!this.addressInfo) {
				this.showToast('请选择地址');
				return;
			}
			if (this.goodslist.length == 0) {
				this.showToast(请重新选择商品);
				return;
			}
			let userInfo = uni.getStorageSync('userInfo');
			if (!userInfo) {
				this.showToast('请先登录');
				return;
			}
			uni.redirectTo({
				url: '/pages/index/paymentResult?type=1'
			});
			return;
			let orderType = 2;
			let formdata = {
				payUserId: userInfo.userId,
				price: this.allPrice,
				payStyle: this.payStyle, // 支付方式 1微信 2支付宝 3余额
				state: 1,
				logisticsType: 1, // 配送方式 1快递
				receiver: this.addressInfo.name,
				province: this.addressInfo.province,
				city: this.addressInfo.city,
				area: this.addressInfo.area,
				address: this.addressInfo.province + this.addressInfo.city + this.addressInfo.area + this.addressInfo.address,
				phone: this.addressInfo.phone,
				remark: this.message ? this.message : '',
				orderType: orderType, // 1活动 2普通 3会员 4新人 5积分
				carts: JSON.stringify(this.goodslist)
			};
			this.showLoading();
			this.request({
				url: '',
				data: formdata,
				success: res => {
					console.log('生成订单编号', res);
					if (res.data.returnCode === 1) {
						this.changeOrderType(res.data.obj.id, 2);
						this.del();
					} else {
						this.showToast(res.data.returnStr);
					}
				}
			});
		},
		// 改变订单状态
		changeOrderType(id, state) {
			this.request({
				url: '',
				data: {
					id: id,
					state: state
				},
				success: res => {
					console.log('改变订单状态', res);
					uni.hideLoading();
					if (res.data.returnCode === 1) {
						uni.redirectTo({
							url: '/pages/index/paymentResult?type=1'
						});
					} else {
						// 到时间挪到支付失败的地方
						uni.redirectTo({
							url: '/pages/index/paymentResult?type=2'
						});
					}
				}
			});
		},
		// 删除购物车
		del() {
			let ids = this.cartIds;
			if (!ids.length) {
				return;
			}
			this.request({
				url: '',
				data: {
					ids: ids.join(',')
				},
				success: res => {
					console.log('删除购物车', res);
				}
			});
		},
		chooseAddressInfo() {
			uni.navigateTo({
				url: '/pages/my/myAddress?type=1'
			});
		},
		choosePayStyle() {
			uni.showActionSheet({
				// #ifdef MP-WEIXIN
				itemList: ['微信支付'],
				// 若要余额支付把下面放开上面注释
				// itemList: ['微信支付', '余额支付'],
				// #endif
				// #ifdef APP-PLUS
				itemList: ['微信支付', '支付宝支付', '余额支付'],
				// #endif
				// #ifdef H5
				itemList: ['微信支付', '支付宝支付', '余额支付'],
				// #endif
				success: res => {
					this.payStyle = Number(res.tapIndex) + 1;
					// #ifdef MP-WEIXIN
					if (this.payStyle === 2) {
						this.payStyle = 3;
					}
					// #endif
				}
			});
		}
	}
};
</script>

<style lang="scss">
.confirmOrder {
	padding-bottom: 126rpx;
	.topbox {
		margin-bottom: 20rpx;
		.noaddess {
			height: 96rpx;
			padding: 0 30rpx;
			font-size: 28rpx;
			letter-spacing: 1rpx;
			color: #333333;
			.left {
				& > image {
					width: 32rpx;
					height: 32px;
					margin-right: 32rpx;
				}
			}
			.row {
				width: 12rpx;
				height: 24rpx;
			}
		}
		.addressbox {
			padding: 26rpx 30rpx;
			.address {
				width: 32rpx;
				height: 32px;
				margin-right: 32rpx;
			}
			.uinfobox {
				flex: 1;
				.namebox {
					margin-bottom: 18rpx;
				}
			}
			.row {
				width: 12rpx;
				height: 24rpx;
				margin-left: 54rpx;
			}
		}
		.topbg {
			width: 100%;
			height: 6rpx;
		}
	}
	.assemble {
		padding-bottom: 20px;
		.tit {
			font-size: 16px;
			font-weight: bold;
			text-align: center;
			padding: 10px 0;
		}
		.userBox {
			.item {
				width: 100rpx;
				& > image {
					width: 70rpx;
					height: 70rpx;
					border-radius: 50%;
				}
				.state {
					position: relative;
					margin-top: -10rpx;
					background-image: linear-gradient(-90deg, #ff585f 0%, #ff826a 100%);
					font-size: 20rpx;
					color: #fff;
					padding: 0 10rpx;
					line-height: 30rpx;
					border-radius: 15rpx;
				}
			}
		}
	}
	.mainbox {
		.payStyle {
			border-bottom: 1rpx solid #ededed;
			padding: 0 30rpx;
			height: 96rpx;
			font-size: 28rpx;
			letter-spacing: 1rpx;
			color: #333333;
			& > text {
				font-size: 26rpx;
				letter-spacing: 1rpx;
				color: #999999;
			}
		}
		.goodslist {
			.item {
				padding: 30rpx;
				border-bottom: 1rpx solid #ededed;
				& > image {
					width: 200rpx;
					height: 200rpx;
				}
				.infobox {
					height: 200rpx;
					padding: 10rpx 0;
					margin-left: 28rpx;
					flex: 1;
					.tip {
						font-size: 26rpx;
						line-height: 36rpx;
						letter-spacing: 1rpx;
						color: #333333;
					}
					.gg {
						font-size: 24rpx;
						letter-spacing: 1rpx;
						color: #666666;
						margin-top: 10rpx;
					}
					.moneybox {
						.money {
							font-size: 24rpx;
							letter-spacing: 1rpx;
							color: #f23030;
							& > text {
								font-size: 30rpx;
							}
						}
						.num {
							font-size: 24rpx;
							letter-spacing: 0px;
							color: #333333;
						}
					}
				}
			}
		}
		.sendStyle {
			view {
				font-size: 26rpx;
				letter-spacing: 1rpx;
				color: #999999;
			}
			image {
				width: 13rpx;
				height: 24rpx;
				margin-left: 20rpx;
			}
		}
		.message {
			padding: 0 30rpx;
			height: 96rpx;
			font-size: 28rpx;
			letter-spacing: 1rpx;
			color: #333333;
			border-bottom: 1rpx solid #ededed;
			input {
				margin-left: 20rpx;
				flex: 1;
				font-size: 28rpx;
			}
		}
		.totbox {
			padding: 0 30rpx;
			line-height: 96rpx;
			text-align: right;
			font-size: 28rpx;
			color: #333333;
			.ff {
				margin-left: 30rpx;
			}
			.money {
				color: #f23030;
			}
		}
	}

	.buynowbox {
		width: 100%;
		height: 96rpx;
		line-height: 96rpx;
		position: fixed;
		left: 0;
		bottom: 0;
		.btn {
			width: 50%;
			height: 100%;
			&.tot {
				padding-left: 40rpx;
				font-size: 30rpx;
				letter-spacing: 1rpx;
				color: #f23030;
			}
			&.buynow {
				background-image: linear-gradient(-90deg, #ff585f 0%, #ff826a 100%);
				border-radius: 0;
				font-size: 32rpx;
				letter-spacing: 2rpx;
				color: #ffffff;
			}
		}
	}
}
</style>
