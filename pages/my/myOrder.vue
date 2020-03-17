<template>
	<view class="myOrder">
		<view class="titbox flex justify-between bg-white">
			<view @click="typeChange(index)" v-for="(item, index) in titList" :key="index" class="item">
				<view :class="{ select: type === index }">
					{{ item }}
					<view class="line" :class="{ select: type === index }"></view>
				</view>
			</view>
		</view>

		<swiper @change="swiperChange" :current="type" class="orderList" style="height: calc(100% - 100rpx);">
			<swiper-item v-for="(swiperitem, swiperindex) in orderList" :key="swiperindex" class="orderList">
				<scroll-view @scrolltolower="scrollBottom" :scroll-y="true" style="width: 100%;height: 100%;">
					<view v-for="(item, index) in orderList[swiperindex]" :key="index" :class="{ nomargin: index === orderList[swiperindex].length - 1 }" class="item bg-white">
						<view class="datebox flex justify-between">
							<view>{{ item.date }}</view>
							<view v-if="item.order_status!=-1" class="tip">{{ typelist[item.order_status - 1] }}</view>
							<view v-else   class="tip">{{ item.is_back===1?'申请退款':'退款完成' }}</view>
						</view>
						<view class="goodsinfoBox">
							<view @click="gotoOrderDetail(item)" class="goods flex" v-for="(goods, goodsindex) in item.product_order_list" :key="goodsindex">
								<view class="imgbox"><image :src="goods.product_image" mode="aspectFill"></image></view>
								<view class="infobox flex flex-direction justify-between">
									<view class="info">
										<view class="tetov1">{{ goods.product_name }}</view>
										<!-- <view class="gg">规格：{{ goods.productSpecName }}</view> -->
									</view>
									<view class="moneybox flex justify-between">
										<view class="money">￥{{ goods.product_price }}</view>
										<!-- <view v-if="item.orderType !== 5" class="money">￥{{ goods.price }}</view> -->
										<!-- <view v-else class="money">积分：{{ goods.price }}</view> -->
										<view class="num">×{{ goods.product_num }}</view>
									</view>
								</view>
							</view>
							<view class="totalbox">
								共{{ item.product_order_list | getGoodsNum }}件商品
								<text style="margin: 0 22rpx;">合计:</text>
								<text style="color: #f23030;">￥{{ item.total_money }}</text>
								<!-- <text v-if="item.orderType !== 5" style="color: #f23030;">￥{{ item.price }}</text> -->
								<!-- <text v-else style="color: #f23030;">积分：{{ item.price }}</text> -->
							</view>
							<view class="btnList flex justify-end flex-wrap">
								<!-- <button @click="contactUs" v-if="item.state < 4" class="btn bg-white cu-btn">联系卖家</button> -->
								<button @click="cancelOrder" :data-item="JSON.stringify(item)" v-if="item.order_status === 1" class="btn bg-white cu-btn">取消订单</button>
								<button @click="payment" :data-item="JSON.stringify(item)" v-if="item.order_status === 1" class="btn bg-white cu-btn">确认付款</button>
								<button @click="refund" :data-item="JSON.stringify(item)" v-if="item.order_status === 2" class="btn bg-white cu-btn">退款</button>
								<button @click="receipt" :data-item="JSON.stringify(item)" v-if="item.order_status === 3" class="btn bg-white cu-btn">确认收货</button>
								<button @click="gotoEvaluate" :data-item="JSON.stringify(item)" v-if="item.order_status === 4" class="btn bg-white cu-btn">去评价</button>
								<!-- <button @click="changeOrderType2" :data-item="item" v-if="item.state === 5" class="btn bg-white cu-btn">改成待评价</button> -->
							</view>
						</view>
					</view>
					<view v-if="!orderList[swiperindex].length && canshowNoData" style="padding-top: 40%;"><will-nodata></will-nodata></view>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
export default {
	data() {
		return {
			titList: ['全部', '待付款', '待发货', '待收货', '待评价', '已完成'],
			typelist: ['等待买家付款', '等待卖家发货', '卖家已发货', '待评价', '已完成'],
			type: 0,
			offser: 1,
			orderList: [[], [], [], [], []],
			canshowNoData: false,
			canPushData: true,
			offset: 1,
			contactData: { wxnum: '123', phone: 1599999999 }
		};
	},
	onLoad(option) {
		if (option.type) {
			this.type = Number(option.type);
		}
		this.getOrderList();
		// this.findContact();
	},
	filters: {
		getGoodsNum(e) {
			return e.reduce((tot, item) => {
				return (tot += item.product_num);
			}, 0);
		}
	},
	methods: {
		// 联系卖家
		contactUs() {
			if (!this.contactData) {
				this.showToast('暂未填写联系信息');
				return;
			}
			uni.showActionSheet({
				itemList: ['拨打电话', '添加微信'],
				success: res => {
					if (res.tapIndex === 1) {
						uni.setClipboardData({
							data: this.contactData.wxnum,
							success: () => {
								this.showToast('复制成功');
							}
						});
					} else if (res.tapIndex === 0) {
						uni.makePhoneCall({
							phoneNumber: this.contactData.phone + '' //仅为示例
						});
					}
				}
			});
		},
		// 取消订单
		cancelOrder(e) {
			let item = JSON.parse(e.currentTarget.dataset.item);
			console.log(item);
			uni.showModal({
				title: '取消订单',
				content: '取消后不可恢复。',
				success: res => {
					if (res.confirm) {
						this.showLoading();
						this.request({
							url: '/order/delOrder',
							method: 'post',
							data: {
								order_id: item.order_id
							},
							success: res => {
								uni.hideLoading();
								this.orderList.splice(this.type, 1, []);
								this.getOrderList();
								console.log('取消订单', res);
							}
						});
					}
				}
			});
		},
		// 确认付款
		payment(e) {
			console.log(e);
			let item = e.currentTarget.dataset.item;
		},
		// 退款
		refund(e) {
			let item = JSON.parse(e.currentTarget.dataset.item);
			console.log(item);
			uni.showModal({
				title: '确认退款',
				content: '确定确认退款吗?',
				success: res => {
					if (res.confirm) {
						this.showLoading();
						this.request({
							url: '/order/backGoods',
							method: 'post',
							data: {
								order_id: item.order_id
							},
							success: res => {
								uni.hideLoading();
								this.orderList.splice(this.type, 1, []);
								this.getOrderList();
								console.log('确认退款', res);
							}
						});
					}
				}
			});
		},
		// 确认收货
		receipt(e) {
			let item = JSON.parse(e.currentTarget.dataset.item);
			console.log(item);
			uni.showModal({
				title: '确认收货',
				content: '确定确认收货吗?',
				success: res => {
					if (res.confirm) {
						this.showLoading();
						this.request({
							url: '/order/getOrder',
							method: 'post',
							data: {
								order_id: item.order_id
							},
							success: res => {
								uni.hideLoading();
								this.type =  4
								this.orderList.splice(this.type, 1, []);
								this.getOrderList();
								console.log('确认收货', res);
							}
						});
					}
				}
			});
		},
		// 去评价
		gotoEvaluate(e) {
			let item = e.currentTarget.dataset.item;
			uni.navigateTo({
				url: '/pages/my/addEvaluate?order=' + item
			});
		},
		// 去订单详情
		gotoOrderDetail(item) {
			console.log(item); 
			uni.navigateTo({
				url: '/pages/my/orderDetail?orderId=' +item.order_id
			});
		},
		changeOrderType2(e) {
			let item = e.currentTarget.dataset.item;
			this.changeOrderType(item.id, 4);
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
					}
				}
			});
		},
		findContact() {
			this.request({
				url: '',
				data: {},
				success: res => {
					console.log('联系我们', res);
					if (res.data.returnCode === 1) {
						this.contactData = res.data.obj;
					}
				}
			});
		},
		getOrderList() {
			// let userInfo = uni.getStorageSync('userInfo');
			// if (!userInfo) {
			// 	this.showToast('请先登录');
			// 	return;
			// }
			this.showLoading();
			this.request({
				url: '/order/orderList/' + this.type,
				data: {
					// payUserId: userInfo.userId,
					// state: this.type === 0 ? '' : this.type, //0是全部
					// offset: this.offset,
					// limit: 10,
					// type: this.type
				},
				success: res => {
					console.log('订单列表', res);
					this.canshowNoData = true;
					uni.hideLoading();
					if (res.data.status === 1) {
						// this.offset += 1;
						res.data.order_list = res.data.order_list.map(i => {
							i.product_order_list = i.product_order_list.map(g => {
								g.product_image = res.data.image_url + g.product_image;
								return g;
							});
							return i;
						});
						this.orderList[this.type].push(...res.data.order_list);
					}
				}
			});
		},
		scrollBottom() {
			console.log(this.type);
			// this.getOrderList();
		},
		typeChange(type) {
			this.type = Number(type);
			this.offset = 1;
			this.orderList.splice(this.type, 1, []);
			this.getOrderList();
		},
		swiperChange(e) {
			if (e.detail.source === 'touch') {
				this.type = Number(e.detail.current);
				this.offset = 1;
				this.orderList.splice(this.type, 1, []);
				this.getOrderList();
			}
		}
	}
};
</script>

<style lang="scss">
page {
	height: 100%;
}
.myOrder {
	height: 100%;
	.titbox {
		border-bottom: 1rpx solid #ededed;
		padding: 0 30rpx;
		.item {
			padding-top: 14px;
			& > view {
				transition: all 0.5s;
				display: inline-block;
				line-height: 0;
				&.select {
					color: #f23030;
				}
				.line {
					transition: all 0.5s;
					width: 0%;
					margin: 0 auto;
					margin-top: 16px;
					height: 4px;
					border-radius: 2px;
					&.select {
						width: 80%;
						background-image: linear-gradient(0deg, #ff585f 0%, #ff826a 100%);
					}
				}
			}
		}
	}

	.orderList {
		.item {
			padding: 0 30rpx 30rpx 30rpx;
			margin-bottom: 10px;
			&.nomargin {
				margin-bottom: 0;
			}
			.datebox {
				line-height: 44px;
				font-size: 26rpx;
				border-bottom: 1rpx solid #ededed;
				color: #333333;
				.tip {
					color: #f23030;
				}
			}

			.goodsinfoBox {
				.goods {
					padding: 20rpx 0;
					width: 100%;
					box-sizing: border-box;
					border-bottom: 1rpx solid #ededed;
					.imgbox {
						width: 180rpx;
						height: 180rpx;
						image {
							width: 180rpx;
							height: 180rpx;
						}
					}

					.infobox {
						flex: 1;
						margin-left: 32rpx;
						padding: 16rpx 0;
						.info {
							font-size: 26rpx;
							color: #333333;
							.tetov1 {
								overflow: hidden;
								text-overflow: ellipsis;
								white-space: nowrap;
								width: 450rpx;
							}
							.gg {
								font-size: 22rpx;
								color: #999999;
								margin-top: 12rpx;
							}
						}
					}
					.moneybox {
						.money {
							font-size: 30rpx;
							line-height: 36rpx;
							color: #f23030;
						}
						.num {
							font-size: 24rpx;
							line-height: 36rpx;
							color: #333333;
						}
					}
				}
				.totalbox {
					text-align: right;
					font-size: 26rpx;
					margin: 28rpx 0 0 0;
				}
				.btnList {
					margin-right: -30rpx;
					.btn {
						color: #666;
						width: 160rpx;
						height: 50rpx;
						border-radius: 25rpx;
						line-height: 50rpx;
						font-size: 22rpx;
						border: 1rpx solid #666666;
						margin: 20rpx 20rpx 0 0;
					}
				}
			}
		}
	}
}
</style>
