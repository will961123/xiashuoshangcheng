<template>
	<view class="my">
		<view class="topUinfo">
			<image class="bg" src="/static/my_bg.png" mode="aspectFill"></image>
			<view class="userbox flex justify-between align-center">
				<view class="headerbox flex align-center">
					<image :src="userInfo ? userInfo.wxPic || '/static/headerpic.png' : ''" mode="aspectFill" style="border-radius:50%;"></image>
					<view>
						<view class="uname">{{ userInfo ? userInfo.account || userInfo.wxName : '' }}</view>
						<!-- <view class="uphone">{{ userInfo ? userInfo.phone || '暂未设置' : '暂未设置' }}</view> -->
						<view class="uVipLv bg-black">普通会员</view>
					</view>
				</view>
				<!-- 	<view @click="gotoQrcode" class="ewmbox flex align-center">
					<image src="/static/ewmsm.png" mode="aspectFit"></image>
					<text>二维码</text>
				</view>	 -->
				<view @click="signIn" class="ewmbox flex align-center"><text>签到送礼</text></view>
			</view>
			<!-- <view class="numbox flex text-center justify-around">
				<view @click="gotoSc(index)" v-for="(item, index) in numlist" :key="index" class="numlist flex flex-direction">
					<view v-if="index === 0" class="num">{{ collectNum }}</view>
					<view v-if="index === 1" class="num">{{ footMarkNum }}</view>
					<view v-if="index === 2" class="num">{{ userInfo.integral || 0 }}</view>
					<view v-if="index === 3" class="num">{{ userInfo.balance || 0 }}</view>
					<view class="tit">{{ item }}</view>
				</view>
			</view> -->
		</view>

		<view style="padding: 0 30rpx;">
			<view class="mainbox item1  bg-white">
				<view class="titbox flex justify-between">
					<view class="itemTit">我的订单</view>
					<view @click="gotoOrder(-1)" class="arowbox flex align-center">
						<text>全部订单</text>
						<image src="/static/aroow.png" mode=""></image>
					</view>
				</view>
				<view class="item1list flex justify-around">
					<view @click="gotoOrder(index)" v-for="(item, index) in orderlist" v-if="index < 4" :key="index" class="item flex flex-direction align-center ">
						<view class="imgbox">
							<image :src="`../../static/my_icon${Number(index) + 1}.png`" mode="aspectFit"></image>
							<!-- 	<view v-if="index === 0 && orderNum.notPaying" class="redbox">{{ orderNum.notPaying }}</view>
							<view v-if="index === 1 && orderNum.notSend" class="redbox">{{ orderNum.notSend }}</view>
							<view v-if="index === 2 && orderNum.toSend" class="redbox">{{ orderNum.toSend }}</view>
							<view v-if="index === 3 && orderNum.done" class="redbox">{{ orderNum.done }}</view> -->
						</view>
						<text>{{ item }}</text>
					</view>
				</view>
			</view>

			<view class="mainbox item2  bg-white">
				<view class="titbox flex justify-between"><view class="itemTit">我的工具</view></view>
				<view class="item2list flex ">
					<button style="border-radius: 0;" open-type="contact" class="item flex flex-direction align-center justify-center bg-white">
						<view class="imgbox"><image src="/static/my_icon5.png" mode="aspectFit"></image></view>
						<text>联系客服</text>
					</button>
					<view
						@click="gotoGj(index)"
						v-for="(item, index) in orderlist"
						v-if="index >= 5"
						:key="index"
						:class="{ nobottom: index >= 7 }"
						class="item flex flex-direction align-center justify-center "
					>
						<view class="imgbox"><image :src="`/static/my_icon${Number(index) + 1}.png`" mode="aspectFit"></image></view>
						<text>{{ item }}</text>
					</view>
				</view>
			</view>

			<!-- <view class="mainbox   bg-white">
				<view @click="Logout" class="titbox flex justify-between" style="border: none;"><view class="itemTit">退出登录</view></view>
			</view> -->
		</view>

		<!-- #ifdef MP-WEIXIN -->
		<will-mc class="mc" v-if="showGetAuthor">
			<view class="_mcMain bg-white ">
				<image @click="showGetAuthor = false" src="/static/delect.png" mode=""></image>
				<view class="tit">欢迎授权登录霞烁商城</view>
				<view class="tip">授权登录后即可使用哦~</view>
				<button @getuserinfo="getOpenId_btn" class="btn cu-btn" open-type="getUserInfo">点击授权</button>
			</view>
		</will-mc>
		<!-- #endif -->

		<will-mc class="mc" v-if="showQrcode">
			<view class="_mcMain bg-white ">
				<image @click="showQrcode = false" src="/static/delect.png" mode=""></image>
				<view style="width: 400rpx; margin: 0 auto;"><image src="/static/goods.jpg" style="width: 400rpx;margin: 30px 0; " mode="widthFix"></image></view>

				<button @click="saveQrcode" class="btn cu-btn">保存</button>
			</view>
		</will-mc>
	</view>
</template>

<script>
export default {
	data() {
		return {
			numlist: ['收藏', '足迹', '积分', '余额'],
			// orderlist: ['待付款', '待发货', '待收货', '待评价', '实名认证', '会员', '我的评价', '收货地址', '建议反馈', '关于我们'],
			orderlist: ['待付款', '待发货', '待收货', '待评价', '联系客服', '优惠卷', '我的评价', '收货地址', '建议反馈', '关于我们'],
			orderNum: {
				notPaying: 1,
				notSend: 2,
				toSend: 3,
				done: 4
			},
			userInfo: {
				wxName: '用户名',
				phone: 12345697,
				wxPic: '/static/goods.jpg'
			},
			showGetAuthor: false,
			showQrcode: false,
			collectNum: 0,
			footMarkNum: 0
		};
	},
	onLoad() {},
	onShow() {
		// if (!this.isLoad()) {
		// 	// #ifdef MP-WEIXIN
		// 	this.showGetAuthor = true;
		// 	// #endif
		// } else {
		// 	// #ifdef MP-WEIXIN
		// 	this.showGetAuthor = false;
		// 	// #endif
		// }
		// // #ifdef MP-WEIXIN
		// this.checkUserInfo_openid();
		// // #endif
		// this.getOrderNum();
		// this.getCollectNum();
		// this.getFootMarkNum();
		// this.userInfo = uni.getStorageSync('userInfo') || {};
	},
	methods: {
		signIn() {
			uni.showModal({
				title: '签到结果',
				content: '签到成功！积分增加10分',
				showCancel: false,
				success: res => {}
			});
			let userInfo = uni.getStorageSync('userInfo');
			if (!userInfo) {
				return;
			}
			this.request({
				url: '',
				data: {
					userId: userInfo.id
				},
				success: res => {
					console.log('签到结果', res);
				}
			});
		},
		getCollectNum() {
			let userInfo = uni.getStorageSync('userInfo');
			if (!userInfo) {
				return;
			}
			this.request({
				url: '',
				data: {
					userId: userInfo.userId
				},
				success: res => {
					console.log('收藏数量', res);
					if (res.data.returnCode === 1) {
						this.collectNum = res.data.obj;
					}
				}
			});
		},
		getFootMarkNum() {
			let userInfo = uni.getStorageSync('userInfo');
			if (!userInfo) {
				return;
			}
			this.request({
				url: '',
				data: {
					userId: userInfo.userId
				},
				success: res => {
					console.log('足迹数量', res);
					if (res.data.returnCode === 1) {
						this.footMarkNum = res.data.obj;
					}
				}
			});
		},
		getOrderNum() {
			let userInfo = uni.getStorageSync('userInfo');
			if (!userInfo) {
				return;
			}
			this.request({
				url: '',
				data: {
					userId: userInfo.userId
				},
				success: res => {
					console.log('订单数量', res);
					if (res.data.returnCode === 1) {
						this.orderNum = res.data.obj;
					}
				}
			});
		},

		// '收藏', '足迹', '积分', '余额'
		gotoSc(type) {
			console.log(type);
			if (type < 2) {
				uni.navigateTo({
					url: '/pages/my/myCollection?type=' + (Number(type) + 1)
				});
			} else {
				uni.navigateTo({
					url: '/pages/my/myIntegral?type=' + (Number(type) - 1)
				});
			}
		},
		// '待付款', '待发货', '待收货', '退款'
		gotoOrder(type) {
			uni.navigateTo({
				url: '/pages/my/myOrder?type=' + (Number(type) + 1)
			});
		},
		// '实名认证', '钱包/优惠卷', '我的评价', '收货地址', '建议反馈', '关于我们'
		gotoGj(type) {
			console.log(type);
			switch (type) {
				case 4:
					return;
					uni.navigateTo({
						// url: '/pages/my/realNameAuth'
						url: '/pages/my/myCollection?type=1'
					});
					break;
				case 5:
					uni.navigateTo({
						url: '/pages/my/coupon'
					});
					break;
				case 6:
					uni.navigateTo({
						url: '/pages/my/myEvaluate'
					});
					break;
				case 7:
					uni.navigateTo({
						url: '/pages/my/myAddress'
					});
					break;
				case 8:
					uni.navigateTo({
						url: '/pages/my/feedback'
					});
					break;
				case 9:
					uni.navigateTo({
						url: '/pages/my/aboutUs'
					});
					break;
			}
		},
		gotoQrcode() {
			this.showQrcode = true;
			// uni.navigateTo({
			// 	url: '/pages/my/myQrcode'
			// });
		},
		saveQrcode() {},
		Logout() {
			uni.showModal({
				content: '确定退出吗?',
				title: '退出登录',
				success: res => {
					if (res.confirm) {
						console.log('退出');
					}
				}
			});
		}
	}
};
</script>

<style lang="scss">
.my {
	padding-bottom: 10px;
	.toptit {
		background: #ff585f;
		// padding-top: var(--status-bar-height);
		line-height: 40px;
		font-size: 36rpx;
		color: #fff;
		text-align: center;
	}
	.topUinfo {
		width: 100%;
		position: relative;
		height: 174px;
		color: #fff;
		.bg {
			width: 100%;
			height: 174px;
			position: absolute;
			left: 0;
			top: 0;
		}
		.userbox {
			position: relative;
			padding: 30rpx 0 30rpx 30rpx;
			.headerbox {
				& > image {
					width: 104rpx;
					height: 104rpx;
					margin-right: 37rpx;
				}
				.uname {
					font-size: 36rpx;
					line-height: 1.6em;
				}
				.uphone {
					font-size: 26rpx;
				}
				.uVipLv {
					line-height: 30rpx;
					border-radius: 15rpx;
					padding: 10rpx;
					text-align: center;
					font-size: 22rpx;
				}
			}
			.ewmbox {
				height: 60rpx;
				background-color: rgba(179, 18, 26, 0.8);
				border-radius: 30px 0px 0px 30px;
				padding: 0 34rpx 0 30rpx;
				& > image {
					width: 32rpx;
					height: 32rpx;
					margin-right: 26rpx;
				}
			}
		}
		.numbox {
			position: relative;
		}
	}

	.mainbox {
		position: relative;
		width: 100%;
		border-radius: 20rpx;
		margin-bottom: 20px;
		.titbox {
			border-bottom: 1rpx solid #e5e5e5;
			padding: 0 30rpx;
			line-height: 48px;
			.itemTit {
				font-size: 34rpx;
				font-weight: bold;
				color: #333333;
			}
			.arowbox {
				& > image {
					width: 12rpx;
					height: 24rpx;
					margin-left: 20rpx;
				}
			}
		}
		&.item1 {
			margin-top: -70px;
			.item1list {
				.item {
					padding: 40rpx 0;
					font-size: 26rpx;
					color: #333;
					.imgbox {
						position: relative;
						.redbox {
							position: absolute;
							top: -10rpx;
							right: -10rpx;
							width: 28rpx;
							height: 28rpx;
							background-color: #f23030;
							font-size: 20rpx;
							color: #fff;
							text-align: center;
							border-radius: 50%;
						}

						& > image {
							width: 56rpx;
							height: 56rpx;
							margin-bottom: 10rpx;
						}
					}
				}
			}
		}
		&.item2 {
			.item2list {
				flex-wrap: wrap;
				.item {
					width: calc(100% / 3);
					height: 230rpx;
					border-right: 1rpx solid #e5e5e5;
					border-bottom: 1rpx solid #e5e5e5;
					&:nth-child(3n) {
						border-right: none;
					}
					&.nobottom {
						border-bottom: none;
					}
					.imgbox {
						& > image {
							width: 56rpx;
							height: 56rpx;
						}
					}
					& > text {
						font-size: 24rpx;
						line-height: 40rpx;
						color: #333333;
					}
				}
			}
		}
	}
}
</style>
