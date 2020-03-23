<template>
	<view class="searchpage">
		<view class="search bg-white flex align-center">
			<view class="searchiptbox flex align-center">
				<image src="/static/search.png" mode="aspectFill"></image>
				<input v-model="search" type="text" placeholder="请输入关键字" value="" />
			</view>
			<button @click="gotoCategory" class="text-bold cu-btn bg-white">搜索</button>
		</view>

		<!-- <view class="itembox bg-white">
			<view class="titbox  text-bold"><text>热门搜索</text></view>
			<view class="mainbox flex flex-wrap">
				<button @click="changeSearch(item)" class="cu-btn item" v-for="(item, index) in searchItemList.hot" :key="index">{{ item }}</button>
			</view>
		</view>

		<view class="itembox bg-white">
			<view class="titbox historyTit flex align-center justify-between text-bold">
				<text>历史记录</text>
				<view class="del flex align-center">
					<image src="/static/delete.png" mode="aspectFit"></image>
					<button @click="del" class="cu-btn bg-white">清空</button>
				</view>
			</view>
			<view class="mainbox flex flex-wrap">
				<button @click="changeSearch(item)" class="item cu-btn  " v-for="(item, index) in searchItemList.history" :key="index">{{ item }}</button>
			</view>
		</view> -->
	</view>
</template>

<script>
export default {
	data() {
		return {
			searchItemList: {
				hot: ['时尚女装', '口红', '女鞋', '外套', '时尚女装'],
				history: ['时尚女装', '口红', '女鞋', '外套', '时尚女装']
			},
			search: ''
		};
	},
	methods: {
		changeSearch(item) {
			this.search = item;
		},
		gotoCategory() {
			if (!this.search) {
				this.showToast('请输入搜索关键字');
				return;
			}

			uni.navigateTo({
				url: '/pages/category/categoryList?name=' + this.search + '&type=1'
			});
		},
		del() {
			uni.showModal({
				title: '删除记录',
				content: '确认删除搜索记录吗',
				success: res => {
					if (res.confirm) {
						this.searchItemList.history = [];
					}
				}
			});
		}
	}
};
</script>

<style lang="scss">
.searchpage {
	.cu-btn {
		height: auto;
	}
	.search {
		padding: 20rpx 30rpx;
		margin-bottom: 10px;
		& > text {
			margin-left: 14px;
			font-size: 32rpx;
			color: #333333;
		}
		.searchiptbox {
			background: #f5f5f5;
			height: 30px;
			border-radius: 15px;
			padding: 0 30rpx;
			font-size: 26rpx;
			flex: 1;
			& > image {
				width: 16px;
				height: 16px;
				margin-right: 20rpx;
			}
			input {
				height: 30px;
				flex: 1;
			}
		}
	}

	.itembox {
		padding: 0 30rpx;
		.titbox {
			padding: 20px 0 15px 0;
			& > text {
				font-size: 30rpx;
				color: #333333;
			}
			&.historyTit {
				.del {
					& > image {
						width: 32rpx;
						height: 32rpx;
					}
					& > text {
						font-size: 28rpx;
						color: #666666;
						margin-left: 20rpx;
					}
				}
			}
		}
		.mainbox {
			.item {
				display: inline-block;
				background-color: #f5f5f5;
				border-radius: 15px;
				line-height: 30px;
				padding: 0 20px;
				font-size: 26rpx;
				color: #999999;
				margin: 0 10px 10px 0;
			}
		}
	}
}
</style>
