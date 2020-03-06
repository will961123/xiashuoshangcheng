<template>
	<view class="counpon bg-white">
		<view class="counponListBox">
			<view v-for="(item, index) in counponList" :key="index" :class="item.canUse ?'bg-red':'bg-gray'" class="item  ">
				<view class="top flex justify-between align-center">
					<view class="price">{{ item.price }} <text style="font-size: 24rpx;margin-left: 5px;" >{{item.canUse?"可用":"不可用"}}</text></view>
					<view class="right">
						<view class="name">{{ item.name }}</view>
						<view class="data">领取时间: {{ item.getDate }}</view>
					</view>
				</view>
				<view class="bottom">{{ item.tit }}</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			counponList: [
				{ name: '优惠卷1', getDate: '2020-03-08 15:15:15', price: 20, tit: '优惠卷说明', id: 123, canUse: true },
				{ name: '优惠卷2', getDate: '2020-03-08 15:15:15', price: 10, tit: '优惠卷说明', id: 1223, canUse: false }
			]
		};
	},
	onLoad() {
		this.getList()
	},
	methods: {
		getList() {
			this.showLoading()
			this.request({
				url: '',
				data: {
					id: uni.getStorageSync('userInfo').id
				},
				success: res => {
					uni.hideLoading()
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
	.counponListBox {
		padding: 0 30rpx;
		padding-top: 20px;
		.item {
			border-radius: 14rpx;
			padding: 16px 24px;
			margin-bottom: 20px;
			.top {
				border-bottom: 1px dashed #555555;
				padding-bottom: 10px;
				.price {
					font-size: 30px;
				}
			}
			.bottom {
				padding-top: 10px;
			}
		}
	}
}
</style>
