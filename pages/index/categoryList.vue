<template>
	<view class="categoryList">
		<view class="search bg-white flex align-center">
			<view class="searchiptbox flex align-center">
				<image src="/static/search.png" mode="aspectFill"></image>
				<input v-model="searchName" type="text" placeholder="请输入关键字" value="" />
				<view  @click="getList" style="width: 40px;height: 100%;line-height: 30px;margin-left: 10px;">搜索</view>
			</view>
		</view>

		<view style="background: #fff;padding: 0 30rpx;">
			<view @click="gotoCategoryDetail(item.id)" v-for="(item, index) in list" :key="index" class="item flex">
				<image class="pic" :src="item.picture" mode="aspectFill"></image>
				<view class="right flex flex-direction justify-between">
					<view class="titbox">
						<view class="tit1 textov1">{{ item.title }}</view>
						<view class="tit2 textov1">{{ item.desc }}</view>
					</view>
					<view>
						<image class="icon" src="/static/eye.png" style="margin-right: 6px;" mode="widthFix"></image>
						<text>{{ item.see_num }}</text>
					</view>
				</view>
			</view>
			
			<will-nodata v-if="list.length==0" ></will-nodata>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			searchName: '',
			list: []
		};
	},
	onLoad() {
		this.getList();
	},
	onShareAppMessage(res) {
		return {
			title: '苍都牧场',
			path: '/pages/index/categoryList?parentId=' + this.getUserId() || ''
			// imageUrl: '测试图片'
		};
	},
	methods: {
		getList() {
			this.showLoading();
			this.request({
				url: '/works/getList/'+this.searchName , 
				data: {},
				success: res => {
					uni.hideLoading();
					console.log('投稿列表', res);
					if(res.data.status===1){
						res.data.list = res.data.list.map(i => {
							i.picture = res.data.image_url + i.picture;
							return i;
						});
						this.list = res.data.list;
					}else{
						this.list =[]
					}
					
				}
			});
		},
		gotoCategoryDetail(id) {
			uni.navigateTo({
				url: '/pages/index/categoryDetail?id=' + id
			});
		}
	}
};
</script>

<style lang="less">
page {
	background: #fff;
}
.categoryList {
	.search {
		padding: 20rpx 30rpx;
		& > navigator {
			& > image {
				width: 20px;
				height: 20px;
				margin-right: 15px;
			}
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

	.item {
		width: 100%;
		padding: 15px 0;
		border-bottom: 1rpx solid #dbd8db;
		&:last-child {
			border-bottom: none !important;
		}
		.pic {
			width: 240rpx;
			height: 160rpx;
		}
		.right {
			padding: 4px 0;
			padding-left: 30rpx;
			flex: 1;
			width: calc(100% - 250rpx);
			font-size: 26rpx;
			color: #7e7e7e;
			.tit1 {
				font-size: 32rpx;
				color: #000;
			}
			.tit2 {
				margin-top: 4px;
			}
			.icon {
				width: 24rpx;
				height: 17rpx;
				margin-right: 5px;
			}
		}
	}
}
</style>
