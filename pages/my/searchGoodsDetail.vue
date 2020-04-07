<template>
	<view class="searchDetail">
		<view  v-for="(item,index) in list " :key='index' class="item bg-white flex justify-between align-center">
			<image :src="item.avatar" mode="aspectFill"></image>
			<text class="name">分享给:{{item.nickName}}</text>
			<text class="time">{{item.date}}</text>
		</view>
		<will-nodata v-if="!list.length " ></will-nodata>
	</view>
</template>

<script>
export default {
	data() {
		return {
			goodsId: '',
			list: []
		};
	},
	onLoad(options) {
		console.log(options.id);
		options.id && this.getDetail(options.id);
	},
	methods: {
		getDetail(id) {
			this.checkLogin().then(success => {
				this.showLoading();
				this.request({
					url: '/tryAssemble/postShareUser',
					method: 'POST',
					data: {
						product_id: id,
						user_mark_id: this.getUserId()
					},
					success: res => {
						uni.hideLoading();
						console.log(res);
						if (res.data.list) {
							this.list = res.data.list;
						}
					}
				});
			});
		}
	}
};
</script>

<style lang="less">
page {
	background: #f3f3f3;
}
.searchDetail {
	padding-top: 12px;
	.item {
		line-height: 40px;
		padding: 0 6px;
		margin-bottom: 1px ;
		& > image {
			width: 60rpx;
			height: 60rpx;
		}
		.name {
			font-size: 28rx;
			color: #000;
		}
		.time {
			font-size: 24rx;
			color: #999;
		}
	}
}
</style>
