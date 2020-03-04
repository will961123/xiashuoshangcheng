<template>
	<view class="myAddress">
		<view @click="gotoAddaddress" class="addCard flex align-center justify-between bg-white">
			<view>
				<text style="margin-right: 20rpx;">+</text>
				添加地址
			</view>
			<image src="/static/aroow.png" mode="aspectFit"></image>
		</view>

		<view v-for="(item, index) in addressList" :key="index" class="item bg-white">
			<view class="namebox flex justify-between">
				<text>{{ item.name }}</text>
				{{ item.phone }}
			</view>
			<view class="addressbox">地址：{{ item.province }}-{{ item.city }}-{{ item.area }} {{ item.address }}</view>
			<view class="btnbox flex align-center justify-between">
				<view class="flex align-center">
					<image
						@click="changeDeault(index, item.id)"
						:src="type === 1 ? (item.state === 2 ? '/static/select.png' : '/static/no.png') : selectIdx === index ? '/static/select.png' : '/static/no.png'"
						mode="aspectFit"
					></image>
					<text>{{ type === 1 ? '设为默认地址' : '使用此地址' }}</text>
				</view>
				<view v-if="type === 1">
					<button @click="gotoModifyAddress(item)" class="btn cu-btn bg-white">修改</button>
					<button @click="delAddress(item.id)" class="btn cu-btn bg-white">删除</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			type: 1, // 1管理 2选择
			selectIdx: -1,
			addressList: [
				{
					name: '收货人',
					phone: 1234578911,
					province: '河南省',
					city: '漯河市',
					area: '郾城区',
					address: '黄河西路',
					id: 1232313,
					state: -1
				},
				{
					name: '收货人',
					phone: 1234578911,
					province: '河南省',
					city: '漯河市',
					area: '郾城区',
					address: '黄河西路',
					id: 1232313,
					state: 2
				}
			]
		};
	},
	onLoad(option) {
		if (option.type) {
			this.type = 2;
			uni.setNavigationBarTitle({
				title: '选择收货地址'
			});
		} else {
			this.type = 1;
			uni.setNavigationBarTitle({
				title: '管理收货地址'
			});
		}
	},
	onShow() {
		// this.getAddressList();
	},
	methods: {
		gotoAddaddress() {
			uni.navigateTo({
				url: '/pages/my/addAddress'
			});
		},
		gotoModifyAddress(item) {
			uni.navigateTo({
				url: '/pages/my/addAddress?type=2&address=' + JSON.stringify(item)
			});
		},
		delAddress(id) {
			uni.showModal({
				title: '删除地址',
				content: '确认删除该地址吗',
				success: res => {
					return
					if (res.confirm) {
						this.showLoading();
						this.request({
							url: '',
							data: {
								id: id
							},
							success: res => {
								console.log('删除', res);
								uni.hideLoading();
								this.getAddressList();
							}
						});
					}
				}
			});
		},
		getAddressList() {
			let userInfo = uni.getStorageSync('userInfo');
			if (!userInfo) {
				this.showToast('请先登录');
				return;
			}
			this.showLoading();
			this.request({
				url: '',
				data: {
					userId: userInfo.userId
				},
				success: res => {
					console.log('收货地址列表', res);
					uni.hideLoading();
					if (res.data.returnCode === 1) {
						this.addressList = res.data.list;
					} else if (res.data.returnCode === 2) {
						this.showToast('暂无地址');
						this.addressList = [];
					} else {
						this.showToast(res.data.returnStr);
					}
				}
			});
		},
		changeDeault(idx, id) { 
			if (this.type === 1) {
				return
				this.showLoading();
				this.request({
					url: ' ',
					data: {
						userId: uni.getStorageSync('openId'),
						id: id
					},
					success: res => {
						console.log('修改默认地址', res);
						uni.hideLoading();
						this.getAddressList();
					}
				});
			} else {
				this.selectIdx = idx;
				uni.setStorageSync('addressInfo', this.addressList[idx]);
				uni.navigateBack({});
			}
		}
	}
};
</script>

<style lang="scss">
.myAddress {
	.addCard {
		height: 44px;
		padding: 0 30rpx;
		font-size: 28rpx;
		color: #333333;
		margin-bottom: 10px;
		& > image {
			width: 12rpx;
			height: 24rpx;
		}
	}
	.item {
		margin-bottom: 10px;
		.namebox {
			font-size: 28rpx;
			padding: 36rpx 30rpx;
		}
		.addressbox {
			font-size: 26rpx;
			padding: 0 30rpx;
		}
		.btnbox {
			height: 88rpx;
			padding: 0 30rpx;
			font-size: 26rpx;
			image {
				width: 32rpx;
				height: 32rpx;
				margin-right: 20rpx;
			}
			.btn {
				font-size: 26rpx;
				width: 160rpx;
				height: 50rpx;
				border-radius: 25rpx;
				border: solid 1rpx #666;
				margin-left: 30rpx;
			}
		}
	}
}
</style>
