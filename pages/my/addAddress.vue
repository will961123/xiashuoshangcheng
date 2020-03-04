<template>
	<view class="addAddress">
		<view class="item flex justify-between align-center bg-white">
			<text>收货人</text>
			<input type="text" v-model="address.name" placeholder="请输入" />
		</view>
		<view class="item flex justify-between align-center bg-white">
			<text>电话</text>
			<input type="number" v-model="address.phone" placeholder="请输入" />
		</view>
		<view class="item flex justify-between align-center bg-white">
			<text>请选择省、市、区</text>
			<view @tap="openAddres" class="pickerbox flex justify-end align-center">
				<input :disabled="true" :value="address.province ? address.province + '-' + address.city + '-' + address.area : ''" type="text" placeholder="请选择" />
				<image src="/static/aroow.png" mode="aspectFit"></image>
			</view>
		</view>
		<view class="item flex  align-center  bg-white" style="border-bottom: none;"><text>详细地址</text></view>
		<view class="textbox bg-white"><textarea v-model="address.address" placeholder="请输入详细地址" /></view>

		<view class="flex justify-center"><button @click="saveAddress" class="btn cu-btn text-white">提交</button></view>

		<simple-address ref="simpleAddress" @onConfirm="onConfirm" themeColor="#007AFF"></simple-address>
	</view>
</template>

<script>
import simpleAddress from '@/components/simple-address/simple-address.nvue';
export default {
	components: {
		simpleAddress
	},
	data() {
		return {
			type: -1, // 1新增 2修改
			address: {
				name: '',
				phone: '',
				province: '',
				city: '',
				area: '',
				area: '',
				address: '',
				id: ''
			},
			pickerText: ''
		};
	},
	onLoad(option) {
		if (option.type) {
			this.type = 2;
			this.address = Object.assign({}, this.address, JSON.parse(option.address));
			uni.setNavigationBarTitle({
				title: '修改收货地址'
			});
		} else {
			this.type = 1;
			uni.setNavigationBarTitle({
				title: '新增收货地址'
			});
		}
	},
	methods: {
		openAddres() {
			this.$refs.simpleAddress.open();
		},
		onConfirm(e) {
			let address = e.label.split('-');
			this.address.province = address[0];
			this.address.city = address[1];
			this.address.area = address[2];
			this.address.code = e.areaCode;
		},
		saveAddress() {
			if (!this.address.name) {
				this.showToast('请输入收货人');
				return;
			}
			if (!this.address.phone) {
				this.showToast('请输入电话');
				return;
			}
			if (!this.checkPhone(this.address.phone)) {
				this.showToast('请输入正确电话');
				return;
			}
			if (!this.address.province) {
				this.showToast('请选择省市区');
				return;
			}
			if (!this.address.address) {
				this.showToast('请输入详细地址');
				return;
			} 
			let userInfo = uni.getStorageSync('userInfo');
			if (!userInfo) {
				this.showToast('请先登录');
				return;
			}
			return
			// 1新增 2修改
			let url = '';
			let formData = { 
				userId: userInfo.userId,
				openid: uni.getStorageSync('openId'),
				wxName: userInfo.wxName || '',
				wxPic: userInfo.wxPic || '', 
				name: this.address.name,
				phone: this.address.phone,
				province: this.address.province,
				city: this.address.city,
				area: this.address.area,
				address: this.address.address
			};
			if (this.type === 2) {
				url = '';
				formData = { 
					userId: userInfo.userId,
					openid: uni.getStorageSync('openId'),
					wxName: userInfo.wxName || '',
					wxPic: userInfo.wxPic || '', 
					id: this.address.id,
					name: this.address.name,
					phone: this.address.phone,
					province: this.address.province,
					city: this.address.city,
					area: this.address.area,
					address: this.address.address
				};
			}
			this.showLoading();
			this.request({
				url: url,
				data: formData,
				success: res => {
					console.log(this.type === 1 ? '新增' : '修改', res);
					uni.hideLoading();
					if (res.data.returnCode === 1) {
						this.showToast(this.type === 1 ? '新增成功' : '修改成功');
					} else {
						this.showToast(res.data.returnStr);
					}
					setTimeout(() => {
						uni.navigateBack({});
					}, 1000);
				}
			});
		}
	}
};
</script>

<style lang="scss">
.addAddress {
	.item {
		height: 96rpx;
		padding: 0 30rpx;
		border-bottom: 1rpx solid #ededed;
		font-size: 28rpx;
		& > input {
			flex: 1;
			text-align: right;
			font-size: 28rpx;
		}
		.pickerbox {
			& > image {
				width: 12rpx;
				height: 24rpx;
				margin-left: 30rpx;
			}
			& > input {
				flex: 1;
				text-align: right;
				font-size: 28rpx;
			}
		}
	}
	.textbox {
		padding: 0 30rpx 30rpx 30rpx;
		& > textarea {
			width: 100%;
			height: 180rpx;
			background-color: #f5f5f5;
			padding: 20rpx 30rpx;
			font-size: 28rpx;
		}
	}
	.btnbox {
		margin-top: 40rpx;
		padding: 0 30rpx;
		.btn {
			width: 100%;
			height: 96rpx;
			background-image: linear-gradient(270deg, #ff585f 0%, #ff826a 100%);
			border-radius: 48rpx;
			font-size: 32rpx;
			letter-spacing: 1rpx;
		}
	}

	button {
		width: calc(100% - 60rpx);
		height: 88rpx;
		background-image: linear-gradient(-90deg, #ff585f 0%, #ff826a 100%);
		border-radius: 44rpx;
		font-size: 32rpx;
		letter-spacing: 1rpx;
		margin-top: 40rpx;
	}
}
</style>
