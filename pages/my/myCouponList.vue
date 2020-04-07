<template>
	<view class="counpon bg-white">
		<view v-if="!isSelectCoupon" class="titbox flex justify-between">
			<view @click="chageTit(1)" :class="titType === 1 ? 'item select' : 'item'"><text>可使用</text></view>
			<view @click="chageTit(2)" :class="titType === 2 ? 'item select' : 'item'"><text>已使用</text></view>
			<view @click="chageTit(3)" :class="titType === 3 ? 'item select' : 'item'"><text>已过期</text></view>
		</view>
		<view class="counponListBox" style="padding-top: 20px;">
			<will-nodata v-if="counponList[titType - 1].length === 0" style="padding-top: 30px;"></will-nodata>
			<view
				v-for="(item, index) in counponList[titType - 1]"
				:key="index"
				:style="{ background: titType === 1 ? '#ff6f72' : '#c9c9c9' }"
				class="item  pulse flex align-center"
			>
				<view @click="changeSelectIndex(index)" v-if="isSelectCoupon" class="radioBox">
					<image :src="selectIndex === index ? '/static/select.png' : '/static/noo.png'" mode=""></image>
				</view>
				<view class="content flex  align-center">
					<view class="price flex  align-center">
						<text>￥</text>
						<text class="num">{{ item.discount_money }}</text>
					</view>
					<view class="right flex align-center justify-around">
						<view>
							<view class="name">满{{ item.start_money }}减{{ item.discount_money }}</view>
							<view class="data">{{ item.over_date.split(' ')[0] }}到期</view>
						</view>
						<!-- <button class="btn cu-btn">{{ titType === 1 ? '立即使用' : titType=== 2 ? '已使用' : '已过期' }}</button> -->
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			isSelectCoupon: false,
			selectIndex: -1,
			titType: 1,
			counponList: [[], [], []]
		};
	},
	onLoad(options) {
		if (options.isSelectCoupon) {
			this.isSelectCoupon = true;
		}
		this.getList();
	},
	methods: {
		changeSelectIndex(index) {
			this.selectIndex = index;
			let counponInfo = this.counponList[0][this.selectIndex];
			uni.setStorageSync('counponInfo', counponInfo);
			uni.navigateBack({
				delta: 1
			});
		},
		chageTit(type) {
			if (Number(type) === this.titType) {
				return;
			}
			this.titType = Number(type);
			this.counponList.splice(this.titType - 1, 1, []);
			this.getList();
		},
		getList() {
			this.checkLogin().then(
				reslove => {
					this.showLoading();
					this.request({
						url: '/prize/myCouponList',
						method: 'POST',
						data: {
							coupon_type: this.titType,
							user_mark_id: this.getUserId()
						},
						success: res => {
							uni.hideLoading();
							console.log('优惠卷列表', res);
							if (res.data.status === 1) {
								this.counponList.splice(this.titType - 1, 1, res.data.list);
								console.log(this.counponList);
							} else {
								this.counponList.splice(this.titType - 1, 1, []);
							}
						}
					});
				},
				err => {
					console.log('走进了而然');
				}
			);
		}
	}
};
</script>

<style lang="scss">
.counpon {
	min-height: 100vh;
	background: #fff;
	.titbox {
		padding: 0 60rpx;
		font-size: 30rpx;
		color: #b4b4b4;
		border-bottom: 1rpx solid #f3f3f3;
		height: 40px;
		line-height: 38px;
		.item {
			text {
				display: inline-block;
			}
			&.select {
				color: #000;
				border-bottom: 2px solid #000;
			}
		}
	}
	.counponListBox {
		// padding: 0 30rpx;
		.item {
			height: 80px;
			padding: 4px 0rpx;
			box-sizing: content-box;
			border-color: transparent;
			background-color: #ff6f72;
			margin-bottom: 8px;
			.radioBox {
				width: 44rpx;
				height: 44rpx;
				background: #fff;
				border-radius: 50%;
				margin-left: 30rpx;
				& > image {
					width: 100%;
					height: 100%;
				}
			}
			.content {
				// width: 100%;
				width: calc(100% - 60rpx);
				// flex: 1;
				height: 100%;
				color: rgba(255, 255, 255, 0.7);
				padding: 0 34rpx;
				.price {
					// line-height: 50px;
					padding-right: 8px;
					border-right: 2px dashed rgba(255, 255, 255, 0.7);
					& > text {
						color: rgba(255, 255, 255, 0.7);
						font-size: 26px;
					}
					.num {
						font-size: 50px;
						color: #fff;
						font-weight: 700;
						display: inline-block;
						// height: 50px;
					}
				}
				.right {
					flex: 1;
					.name {
						font-size: 16px;
						color: #fff;
						margin-bottom: 5px;
					}
					.btn {
						padding: 0;
						color: rgba(255, 255, 255, 0.7);
						background: transparent;
						width: 140rpx;
						border-radius: 17px;
						line-height: 34px;
						border: 2px solid #fff;
						text-align: center;
						font-size: 24rpx;
					}
				}
			}
			&.pulse {
				position: relative;
				overflow: hidden;
				&::before,
				&::after {
					position: absolute;
					transform: translateX(-50%);
					content: '';
					display: block;
					width: 14px;
					height: 14px;
					border-radius: 50%;
					background: #fff;
					box-shadow: -40px 0 0 white, -20px 0 0 white, 0 0 0 white, 20px 0 0 white, 40px 0 0 white;
					border: 1rpx solid #fff;
					box-sizing: content-box;
				}
				&::before {
					right: -7px;
					top: 50%;
					transform: rotate(90deg) translateX(-50%);
				}

				&::after {
					left: -7px;
					top: 50%;
					transform: rotate(90deg) translateX(-50%);
				}
			}
		}

		// .pulse::before,
		// .pulse::after {
		// 	position: absolute;
		// 	transform: translateX(-50%);
		// 	content: '';
		// 	display: block;
		// 	width: 14px;
		// 	height: 14px;
		// 	border-radius: 50%;
		// 	background: #fff;
		// 	box-shadow: -40px 0 0 white, -20px 0 0 white, 0 0 0 white, 20px 0 0 white, 40px 0 0 white;
		// 	border: 1rpx solid #fff;
		// 	box-sizing: content-box;
		// }
		// .pulse::before {
		// 	right: -7px;
		// 	top: 50%;
		// 	transform: rotate(90deg) translateX(-50%);
		// }

		// .pulse::after {
		// 	left: -7px;
		// 	top: 50%;
		// 	transform: rotate(90deg) translateX(-50%);
		// }
	}
}
</style>
