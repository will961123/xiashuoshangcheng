<template>
	<view class="orderDetail">
		<view class="topbg  flex justify-between align-center">
			<image class="bg-img" src="/static/orderdetailbg.png"></image>

			<text v-if="order.order_status !== -1" style="z-index: 99;" class="text-bold">{{ typelist[Number(order.order_status) - 1] }}</text>
			<view v-else style="z-index: 99;" class="text-bold">{{ order.is_back === 1 ? '申请退款' : '退款完成' }}</view>

			<image v-if="order && order.order_status != -1" :src="'/static/orderdetailtype' + (order.order_status?order.order_status - 1:1) + '.png'" mode="aspectFit"></image>
			<image v-if="order && order.order_status == -1" src="/static/orderdetailtype1.png" mode="aspectFit"></image>
		</view>
		<view class="uinfo bg-white flex align-center">
			<image src="/static/addredd.png" mode="widthFix"></image>
			<view class="infobox">
				<view class="namebox flex justify-between">
					<view>收货人：{{ order.consignee }}</view>
					<view>{{ order.phone }}</view>
				</view>
				<view class="addressbox">{{ order.provinceName }}-{{ order.cityName }}-{{ order.areaName }} {{ order.detailInfo }}</view>
			</view>
		</view>
		<view class="goodsinfo bg-white">
			<view v-for="(item, index) in order.order_product_list" :key="index" class="item flex ">
				<view class="imgbox"><image :src="item.product_image" mode="aspectFill"></image></view>
				<view class="rightbox flex flex-direction justify-between">
					<view class="infobox">
						<view class="info textov1" style="width: 450rpx;">{{ item.product_name }}</view>
						<!-- <view class="tip">规格：{{ item.productSpecName }}</view> -->
					</view>
					<view class="moneybox flex justify-between">
						<view class="money">￥{{ item.product_price }}</view>
						<!-- <view v-if="order.orderType !== 5" class="money">￥{{ item.price }}</view> -->
						<!-- <view v-else class="money">积分：{{ item.price }}</view> -->
						<view>×{{ item.product_num }}</view>
					</view>
				</view>
			</view>
			<view class="totalbox">
				共计：
				<text>￥{{ order.total_money }}</text>
				<!-- <text v-if="order.orderType !== 5">￥{{ order.price }}</text> -->
				<!-- <text v-else>积分：{{ order.price }}</text> -->
			</view>
		</view>
		<view class="orderinfo bg-white">
			<view class="item">订单编号：{{ order.id }}</view>
			<view class="item">支付方式： 微信支付</view>
			<!-- <view class="item">支付方式：{{ order.payStyle === 1 ? '微信支付' : '支付宝支付' }}</view> -->
			<view class="item">下单时间：{{ order.date }}</view>
		</view>

		<view v-if="order.order_status >= 3" class="orderinfo bg-white" style="margin-top: 10px;">
			<view class="item">快递名称： {{ order.express }}</view>
			<view class="item">快递编号： {{ order.expressNumber }}</view>
		</view>

		<!-- <view class="btnList bg-white flex justify-end align-center flex-wrap">
			<button @click="contactUs" class="btn bg-white cu-btn">联系卖家</button>order_id
			<button @click="cancelOrder" v-if="order.order_status === 1" class="btn bg-white cu-btn">取消订单</button>
			<button @click="payment" v-if="order.order_status === 1" class="btn bg-white cu-btn selectbtn">确认付款</button>
			<button @click="refund" v-if="order.order_status === 2" class="btn bg-white cu-btn">退款</button>
			<button @click="receipt" v-if="order.order_status === 3" class="btn bg-white cu-btn ">确认收货</button>
			<button @click="gotoEvaluate" v-if="order.order_status === 4" class="btn bg-white cu-btn">去评价</button>
		</view> -->
	</view>
</template>

<script>
export default {
	data() {
		return {
			orderId: '',
			order: {},
			typelist: ['待付款', '待发货', '待收货', '待评价', '已完成']
		};
	},
	onLoad(options) {
		if (options.order) {
			// this.order = JSON.parse(options.order);
		}
		if (options.orderId) {
			this.orderId = options.orderId;
			this.getOrder();
		}
		console.log(this.order);
	},
	methods: {
		getOrder() {
			this.showLoading();
			this.request({
				url: '/order/getOrderOne/' + this.orderId,
				data: {},
				success: res => {
					uni.hideLoading();
					console.log('订单详情', res);
					res.data.order_list.order_product_list = res.data.order_list.order_product_list.map(i => {
						i.product_image = res.data.image_url + i.product_image;
						return i;
					});
					this.order = res.data.order_list;
				}
			});
		},
		// 联系卖家
		contactUs() {
			uni.showActionSheet({
				itemList: ['拨打电话', '添加微信'],
				success: res => {
					console.log(res);
				}
			});
		},
		// 取消订单
		cancelOrder() {},
		// 确认付款
		payment() {},
		// 退款
		refund() {},
		// 确认收货
		receipt() {},
		// 去评价
		gotoEvaluate() {
			console.log(this.order);
			uni.navigateTo({
				url: '/pages/my/addEvaluate?order=' + JSON.stringify(this.order)
			});
		},

		// 改变订单状态
		changeOrderType(id, type) {
			this.request({
				url: '/',
				data: {
					id: id,
					type: type
				},
				success: res => {
					if (res.data.returnCode === 1) {
					}
				}
			});
		}
	}
};
</script>

<style lang="scss">
.orderDetail {
	padding-bottom: 116rpx;
	.topbg {
		height: 80px;
		position: relative;
		.bg-img {
			height: 100%;
			width: 100%;
			position: absolute;
			left: 0;
			top: 0;
		}
		& > image {
			width: 96rpx;
			height: 90rpx;
			margin-right: 80rpx;
		}
		font-size: 32rpx;
		letter-spacing: 1rpx;
		color: #ffffff;
		padding-left: 30rpx;
	}

	.uinfo {
		padding: 33rpx 30rpx;
		& > image {
			width: 32rpx;
			margin-right: 30rpx;
		}
		.infobox {
			flex: 1;
			font-size: 26rpx;
			line-height: 36rpx;
			letter-spacing: 1rpx;
			color: #333333;
			.addressbox {
				margin-top: 21rpx;
			}
		}
	}

	.goodsinfo {
		margin: 10px 0;
		.item {
			width: 100%;
			padding: 20rpx 30rpx;
			border-bottom: 1rpx solid #ededed;
			.imgbox {
				width: 180rpx;
				height: 180rpx;
				margin-right: 30rpx;
				& > image {
					width: 180rpx;
					height: 180rpx;
				}
			}
			.rightbox {
				flex: 1;
				padding: 15rpx 0;
				.infobox {
					font-size: 26rpx;
					color: #333333;
					.tip {
						font-size: 22rpx;
						color: #999999;
						margin-top: 14rpx;
					}
				}
				.moneybox {
					.money {
						font-size: 30rpx;
						color: #f23030;
					}
				}
			}
		}

		.totalbox {
			padding: 0 30rpx;
			font-size: 26rpx;
			line-height: 44px;
			text-align: right;
			color: #333333;
			& > text {
				color: #f23030;
			}
		}
	}

	.orderinfo {
		padding: 34rpx 30rpx 10rpx 30rpx;
		.item {
			margin-bottom: 14rpx;
			font-size: 26rpx;
			letter-spacing: 1rpx;
			color: #999999;
		}
	}

	.btnList {
		width: 100%;
		height: 96rpx;
		position: fixed;
		left: 0;
		bottom: 0;
		padding: 0 30rpx;
		.btn {
			margin-left: 30rpx;
			color: #666;
			width: 200rpx;
			height: 60rpx;
			border-radius: 30rpx;
			line-height: 60rpx;
			font-size: 22rpx;
			border: 1rpx solid #666666;
			&.selectbtn {
				background-image: linear-gradient(90deg, #ff585f 0%, #ff826a 100%);
				color: #fff;
				border: none;
			}
		}
	}
}
</style>
