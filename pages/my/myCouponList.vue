<template>
	<view class="counpon bg-white">
		<view class="titbox flex justify-between">
			<view @click="titType = 1" :class="titType === 1 ? 'item select' : 'item'"><text>可使用</text></view>
			<view @click="titType = 2" :class="titType === 2 ? 'item select' : 'item'"><text>已使用</text></view>
			<view @click="titType = 3" :class="titType === 3 ? 'item select' : 'item'"><text>已过期</text></view>
		</view>
		<view class="counponListBox">
			<view
				v-if="titType === item.status"
				v-for="(item, index) in counponList"
				:key="index"
				:style="{ background: item.status === 1 ? '#ff6f72' : '#c9c9c9' }"
				class="item  pulse flex align-center"
			>
				<view class="content flex  align-center">
					<view class="price flex  align-center">
						<text>￥</text>
						<text class="num">{{ item.price }}</text>
					</view>
					<view class="right flex align-center justify-around">
						<view>
							<view class="name">{{ item.name }}</view>
							<view class="data">2020-0-02到期</view>
						</view>
						<button class="btn cu-btn">{{ item.status === 1 ? '立即使用' : item.status === 2 ? '已使用' : '已过期' }}</button>
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
			titType: 1,
			counponList: [
				{ name: '无门槛', status: 1, getDate: '2020-03-08 15:15:15', price: 20, tit: '优惠卷说明', id: 123 },
				{ name: '满20元减10', status: 2, getDate: '2020-03-08 15:15:15', price: 10, tit: '优惠卷说明', id: 1223 },
				{ name: '满20元减10', status: 3, getDate: '2020-03-08 15:15:15', price: 10, tit: '优惠卷说明', id: 1223 }
			]
		};
	},
	onLoad() {
		// this.getList()
	},
	methods: {
		getList() {
			this.showLoading();
			this.request({
				url: '',
				data: {
					id: uni.getStorageSync('userInfo').id
				},
				success: res => {
					uni.hideLoading();
					console.log('优惠卷列表', res);
					if (res.data.returnCode === 1) {
						this.counponList = res.data.list;
					}
				}
			});
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
		margin-bottom: 20px;
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
		padding: 0 30rpx;
		.item {
			height: 80px;
			padding: 4px 0;
			box-sizing: content-box;
			border-color: transparent;
			background-color: #ff6f72;
			margin-bottom: 8px;
			.content {
				width: 100%;
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
