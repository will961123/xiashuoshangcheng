<template>
	<view class="confirmOrder">
		<view class="topbox bg-white">
			<view @click="getWxAddress" v-if="addressInfo" class="addressbox flex justify-between align-center">
				<image class="address" src="/static/addredd.png" mode="aspectFit"></image>
				<view class="uinfobox">
					<view class="namebox">
						{{ addressInfo.userName }}
						<text style="margin-left: 40rpx;">{{ addressInfo.telNumber }}</text>
					</view>
					<view class="addbox">{{ addressInfo.provinceName }}-{{ addressInfo.cityName }}-{{ addressInfo.countyName }} {{ addressInfo.detailInfo }}</view>
				</view>
				<image class="row" src="/static/aroow.png" mode="aspectFill"></image>
			</view>
			<view @click="getWxAddress" v-else class="noaddess flex align-center justify-between">
				<view class="left flex align-center">
					<image src="/static/addredd.png" mode="aspectFit"></image>
					<text>选择收货地址</text>
				</view>
				<image class="row" src="/static/aroow.png" mode="aspectFill"></image>
			</view>
			<!-- <view @click="chooseAddressInfo" v-if="addressInfo" class="addressbox flex justify-between align-center">
				<image class="address" src="/static/addredd.png" mode="aspectFit"></image>
				<view class="uinfobox">
					<view class="namebox">
						{{ addressInfo.userName }}
						<text style="margin-left: 40rpx;">{{ addressInfo.telNumber }}</text>
					</view>
					<view class="addbox">{{ addressInfo.provinceName }}-{{ addressInfo.cityName }}-{{ addressInfo.countyName }} {{ addressInfo.detailInfo }}</view>
				</view>
				<image class="row" src="/static/aroow.png" mode="aspectFill"></image>
			</view>
			 <view @click="chooseAddressInfo" v-else class="noaddess flex align-center justify-between">
				<view class="left flex align-center">
					<image src="/static/addredd.png" mode="aspectFit"></image>
					<text>选择收货地址</text>
				</view>
				<image class="row" src="/static/aroow.png" mode="aspectFill"></image>
			</view> -->
			<image class="topbg" src="/static/addressorderbg.png"></image>
		</view>

		<!-- 	<view class="assemble bg-white margin-bottom-sm " v-if="isAssemble">
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
		</view> -->

		<view class="mainbox bg-white">
			<view v-if="from === 1 || from === 2" class="payStyle flex justify-between align-center">
				支付方式
				<text>微信支付</text>
				<!-- <text @click="choosePayStyle" v-if="goodslist[0].hot != 4">{{ payStyle === 1 ? '微信支付' : payStyle === 2 ? '支付宝支付' : '余额支付' }}</text> -->
				<!-- <text v-else>{{ '积分支付' }}</text> -->
			</view>
			<!-- <view v-if="buyType===1" @click="showCounpAnimation" class="payStyle flex justify-between align-center">
				优惠卷
				<text>{{ selectCounopIdx > -1 ? '选择了第' + selectCounopIdx + '个' : '请选择' }}</text>
			</view> -->
			<view v-if="buyType === 1" @click="gotoChangeCounp" class="payStyle flex justify-between align-center">
				优惠卷
				<text style="color: red;">{{ counponInfo ? '满' + counponInfo.start_money + '减' + counponInfo.discount_money : '请选择' }}</text>
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
							<view v-if="from === 1 || from === 2" class="money">
								￥
								<text>{{ item.price }}</text>
							</view>
							<view v-else-if="from == 3" class="money"><text>中奖商品</text></view>
							<view v-else-if="from == 4" class="money"><text>零元抢购</text></view>
							<view v-else-if="from == 5" class="money"><text>会员免费</text></view>
							<view v-else-if="from == 6" class="money"><text>分享免费</text></view>
							<!-- <view v-else class="money">
								积分：
								<text>{{ item.price }}</text>
							</view> -->
							<!-- <view class="num">×{{ item.number }}</view> -->
							<sunui-stepper
								:label="index"
								class="num"
								:val="item.number"
								:min="1"
								:max="(from === 1 || from == 2) && (buyType !== 2 && buyType !== 3) ? 999 : 1"
								@change="stepperChange"
							></sunui-stepper>
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
			<view v-if="from === 1 || from === 2" class="message flex  align-center">
				买家留言
				<input type="text" v-model="message" placeholder="对本次交易的说明 " />
			</view>
			<view class="totbox">
				共{{ goodsLength }}件商品
				<text v-if="from === 1 || from === 2" class="ff">共计：</text>
				<text v-if="from === 1 || from === 2" class="money">￥{{ allPrice }}</text>
				<!-- <text v-else class="money">积分：{{ allPrice }}</text> -->
			</view>
		</view>

		<view class="buynowbox flex">
			<view v-if="from === 1 || from === 2" class="tot btn bg-white">￥{{ allPrice }}</view>
			<view v-else-if="from === 3" class="tot btn bg-white">中奖商品</view>
			<view v-else-if="from === 4" class="tot btn bg-white">零元抢购</view>
			<view v-else-if="from === 5" class="tot btn bg-white">会员免费</view>
			<view v-else-if="from === 6" class="tot btn bg-white">分享免费</view>
			<!-- <view v-else class="tot btn bg-white">积分：{{ allPrice }}</view> -->
			<button @click="saveOrder" class="buynow btn cu-btn">{{ from === 3 || from === 4 || from === 5 || from === 6 ? '立即领取' : '立即购买' }}</button>
		</view>

		<will-mc @mcClick="closeAnimation" v-if="showCounp" style="padding: 0 !important;">
			<view @click.native.stop :animation="animationData" class="mcCountBox">
				<scroll-view scroll-y="true" class="mcScrollView">
					<view v-for="(item, index) in 10" :key="index" class="item flex bg-red justify-between align-center">
						<view class="moneyBox">
							<view class="money">￥15</view>
							<view class="needMoney">满50元可用</view>
						</view>
						<view class="infoBox">
							<view class="name">平台满减卷</view>
							<view class="endTime">2020-03-16日到期</view>
						</view>
						<view class="selectBox">
							<label class="radio" @click="changeRadio(index)"><radio :checked="selectCounopIdx === index" :color="'#000000'" value="" /></label>
						</view>
					</view>
				</scroll-view>
				<button @click="closeAnimation" class="btn cu-btn ">关闭</button>
			</view>
		</will-mc>
	</view>
</template>

<script>
export default {
	data() {
		return {
			from: 1, // 1 详情来 2 购物车来 3 我的奖品(转盘抽的)  4 零元枪来 5 会员免费来 6 分享免费来
			goodslist: [],
			cartIds: [],
			addressInfo: {
				telNumber: '12345678911',
				userName: 'userName',
				provinceName: '省',
				cityName: '市',
				countyName: '区',
				detailInfo: '详细地址'
			},
			payStyle: 1, // 1wx 2ali 3yue
			message: '',

			isAssemble: false,
			assemble: {},
			assembleByself: false,

			buyType: 1, // 1 普通 2 参与拼团 3 发起拼团 4 会员领取 5分享领取 6我的奖品 7零元枪

			// 显示优惠卷 弃用
			showCounp: false,
			animationData: {},
			selectCounopIdx: -1,

			counponInfo: ''
		};
	},
	onLoad(options) {
		this.buyType = options.buyType ? Number(options.buyType) : 1;
		console.log(this.buyType, '----1 普通 2 参与拼团 3 发起拼团 4 会员领取 5分享领取 6我的奖品 7 3种零元枪');
		if (options.from) {
			this.from = Number(options.from) || 1;
			this.goodslist = JSON.parse(options.goodslist);
			this.cartIds = options.cartIds ? JSON.parse(options.cartIds) : [];
			console.log('商品', this.goodslist, '购物车', this.cartIds);
		}

		if (options.buyType == 2) {
			this.assemble = JSON.parse(options.assemble);
			this.isAssemble = true;
			console.log('参与拼团', this.assemble);
		} else if (options.buyType == 3) {
			this.isAssemble = true;
			this.assembleByself = true;
			console.log('发起拼团');
		} else if (options.buyType == 6) {
			console.log('我的奖品 ');
		} else if (options.buyType == 7) {
			console.log('3种零元商品');
		}
		this.animationShow();
	},
	onShow() {
		// let addressInfo = uni.getStorageSync('addressInfo');
		// addressInfo ? (this.addressInfo = addressInfo) : '';

		if (this.buyType === 1) {
			this.counponInfo = uni.getStorageSync('counponInfo') ? uni.getStorageSync('counponInfo') : '';
			console.log('优惠卷', this.counponInfo);
		}
	},
	computed: {
		goodsLength() {
			return this.goodslist
				.map(i => {
					return i.number;
				})
				.reduce((tot, next) => {
					return tot + next;
				}, 0);
		},
		allPrice() {
			let allPrice = 0;
			for (let idx in this.goodslist) {
				allPrice += Number(this.goodslist[idx].total);
			}
			return allPrice;
		}
	},
	methods: {
		gotoChangeCounp() {
			uni.navigateTo({
				url: '../my/myCouponList?isSelectCoupon=1'
			});
		},
		stepperChange(e) {
			console.log(e);
			let idx = e.label;
			let val = e.val;
			console.log('idx:', idx, 'val:', val);
			let goodslist = this.goodslist;
			goodslist[idx].number = val;
			goodslist[idx].total = goodslist[idx].number * goodslist[idx].price;
			this.goodslist = goodslist;
		},
		changeRadio(idx) {
			if (this.selectCounopIdx === Number(idx)) {
				this.selectCounopIdx = -1;
				console.log(1);
			} else {
				console.log(2);
				this.selectCounopIdx = Number(idx);
			}
		},
		closeAnimation() {
			this.showCounp = false;
		},
		showCounpAnimation() {
			this.showCounp = true;
			this.animationShow();
		},
		animationShow() {
			var animation = uni.createAnimation({
				duration: 600,
				timingFunction: 'ease',
				delay: 0
			});
			animation.bottom('-70%').step();
			this.animationData = animation.export();
			setTimeout(() => {
				animation.bottom(0).step();
				this.animationData = animation.export();
			}, 200);
		},
		saveOrder() {
			if (!this.addressInfo) {
				this.showToast('请选择地址');
				return;
			}
			if (this.goodslist.length == 0) {
				this.showToast(请重新选择商品);
				return;
			}
			this.checkLogin().then(reslove => {
				// buyType: 1, // 1 普通 2 参与拼团 3 发起拼团 4 会员领取 5分享领取 6我的奖品 7零元枪
				// from: 1, // 1 详情来 2 购物车来 3 我的奖品(转盘抽的)  4 零元枪来 5 会员免费来 6 分享免费来
				let orderType = 2;
				if (this.from === 3) {
					let formdata = {
						prize_log_id: this.goodslist
							.map(i => {
								return i.productId;
							})
							.join(','),
						product_nums: this.goodslist
							.map(i => {
								return i.number;
							})
							.join(','),
						consignee: this.addressInfo.userName,
						phone: this.addressInfo.telNumber,
						address: this.addressInfo.detailInfo,
						province_name: this.addressInfo.provinceName,
						city_name: this.addressInfo.cityName,
						buy_note: this.message,
						area_name: this.addressInfo.countyName,
						is_cart: 0,
						user_mark_id: this.getUserId()
					};
					console.log(formdata);
					this.showLoading();
					this.request({
						url: '/prize/addPrizeOrder',
						method: 'POST',
						data: formdata,
						success: res => {
							console.log('我的奖品--生成订单编号', res);
							if (res.data.status === 1) {
								uni.redirectTo({
									url: '/pages/index/paymentResult?type=1'
								});
								// this.changeOrderType(res.data.obj.id, 2);
								// this.del();
							} else {
								this.showToast(res.data.info);
							}
						}
					});
				} else if (this.from === 4 || this.from === 5 || this.from === 6) {
					let formdata = {
						product_id: this.goodslist
							.map(i => {
								return i.productId;
							})
							.join(','),
						product_apply_id: this.goodslist
							.map(i => {
								return i.product_apply_id;
							})
							.join(','),
						product_nums: this.goodslist
							.map(i => {
								return i.number;
							})
							.join(','),
						consignee: this.addressInfo.userName,
						phone: this.addressInfo.telNumber,
						address: this.addressInfo.detailInfo,
						province_name: this.addressInfo.provinceName,
						city_name: this.addressInfo.cityName,
						buy_note: this.message,
						area_name: this.addressInfo.countyName,
						is_cart: 0,
						user_mark_id: this.getUserId(),
						assemble_type: 0
					};
					console.log(formdata);
					this.showLoading();
					this.request({
						url: '/tryAssemble/postAddOrder',
						method: 'POST',
						data: formdata,
						success: res => {
							console.log('零元抢购--生成订单编号', res);
							if (res.data.status === 1) {
								uni.redirectTo({
									url: '/pages/index/paymentResult?type=1'
								});
								// this.changeOrderType(res.data.obj.id, 2);
								// this.del();
							} else {
								this.showToast(res.data.info);
							}
						}
					});
				} else {
					let formdata = {
						product_ids: this.goodslist
							.map(i => {
								return i.productId;
							})
							.join(','),
						product_nums: this.goodslist
							.map(i => {
								return i.number;
							})
							.join(','),
						consignee: this.addressInfo.userName,
						phone: this.addressInfo.telNumber,
						address: this.addressInfo.detailInfo,
						province_name: this.addressInfo.provinceName,
						city_name: this.addressInfo.cityName,
						buy_note: this.message,
						area_name: this.addressInfo.countyName,
						is_cart: Number(this.from) === 2 ? 1 : 0,
						user_mark_id: this.getUserId()
					};
					let url = '/order/addOrder';
					if (this.buyType === 2 || this.buyType === 3) {
						url = '/tryAssemble/postAddOrder';
						formdata.product_id = this.goodslist
							.map(i => {
								return i.productId;
							})
							.join(',');
						formdata.product_num = this.goodslist
							.map(i => {
								return i.number;
							})
							.join(',');
						if (this.buyType === 2) {
							formdata.assemble_start_user_id = this.assemble.user_id;
							formdata.assemble_type = 'join';
						} else {
							formdata.assemble_type = 'start';
						}
					}
					if (this.buyType === 1) {
						if (this.counponInfo) {
							formdata.coupon_id = this.counponInfo.id;
						} else {
							formdata.coupon_id = 0;
						}
					}
					console.log(formdata);
					this.showLoading();
					this.request({
						url: url,
						method: 'POST',
						data: formdata,
						success: res => {
							console.log(this.buyType === 2 ? '参与拼团--生成订单编号' : this.buyType === 3 ? '发起拼团--生成订单编号' : '普通商品--生成订单编号', res);
							if (res.data.status === 1) {
								uni.removeStorageSync('counponInfo'); 
								this.payOrder(res.data.order_sn)
								// this.changeOrderType(res.data.obj.id, 2);
								// this.del();
							} else {
								this.showToast(res.data.info);
							}
						}
					});
				}
			});
		},
		payOrder(orderId) {
			this.showLoading();
			this.request({
				url: '/order/postDoPay',
				method: 'POST',
				data: {
					order_sn: orderId
				},
				success: res => {
					uni.hideLoading()
					console.log('支付', res);
					if(res.data.status===1){
						// 吊起微信支付
						uni.redirectTo({
							url: '/pages/index/paymentResult?type=1'
						});
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
		getWxAddress() {
			var that = this;
			uni.getSetting({
				success(res) {
					if (res.authSetting['scope.address']) {
						console.log('用户已经同意接口不会弹窗询问');
						uni.chooseAddress({
							success(res) {
								console.log(res);
								that.addressInfo = res;
							}
						});
					} else {
						if (res.authSetting['scope.address'] == false) {
							console.log('拒绝了授权，主动打开授权');
							uni.openSetting({
								success(res) {
									console.log(res.authSetting);
									if (res.authSetting['scope.address']) {
										wx.chooseAddress({
											success(res) {
												console.log(res);
												that.addressInfo = res;
											}
										});
									}
								}
							});
						} else {
							console.log('第一次授权');
							uni.chooseAddress({
								success(res) {
									console.log(res);
									that.addressInfo = res;
								}
							});
						}
					}
				}
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
.tc_mc {
	padding: 0 !important;
}
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

	.mcCountBox {
		width: 100%;
		height: 55%;
		background: white;
		position: absolute;
		// left: 0;
		.btn {
			background-image: linear-gradient(-90deg, #ff585f 0%, #ff826a 100%);
			width: calc(100% - 60rpx);
			height: 45px;
			font-size: 34rpx;
			color: #fff;
			font-weight: 700;
		}
	}
	.mcScrollView {
		height: calc(100% - 50px);
		padding: 10px 30rpx;
		// height: 50%;
		width: 100%;
		border-radius: 10rpx;
		.item {
			padding: 8px 16rpx;
			border-radius: 8rpx;
			margin-bottom: 14px;
			.moneyBox {
				.money {
					font-size: 24px;
					font-weight: 700;
				}
			}
			.infoBox {
				.endTime {
					color: #999;
					margin-top: 8px;
				}
			}
		}
	}
}
</style>
