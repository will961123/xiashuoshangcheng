<template>
	<view v-show="itemInfo.video" class="prodectDetail">
		<view class="videobox  ">
			<video :src="itemInfo.video" controls></video>
			<view class="titBox">
				<view class="tit">【文稿标题】</view>
				<view class="info">{{ itemInfo.title }}</view>
				<view class="tit">【文稿详情】</view>
				<view class="info">{{ itemInfo.desc }}</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			id: '',
			itemInfo: {
				video: '',
				title: '',
				desc: ''
			}
		};
	},
	onLoad(options) {
		this.geDetail(options.id);
		this.id = options.id;
		this.addViewNum(options.id);
	},
	onShareAppMessage(res) {
		return {
			title: '苍都牧场',
			path: '/pages/index/categoryList?parentId=' + this.getUserId() || '' + '&id=' + this.id

			// imageUrl: '测试图片'
		};
	},
	methods: {
		geDetail(id) {
			if (!id) {
				uni.showModal({
					title: '提示',
					content: '该视频不存在!',
					showCancel: false,
					success: res => {
						if (res.confirm) {
							uni.switchTab({
								url: '/pages/index/index'
							});
						}
					}
				});
				return;
			}
			this.showLoading();
			this.request({
				url: '/works/getOne/' + id,
				data: {},
				success: res => {
					uni.hideLoading();
					console.log('文稿详情', res);
					res.data.works_info.video = res.data.image_url + res.data.works_info.video;
					this.itemInfo = res.data.works_info;
				}
			});
		},
		addViewNum(id) {
			if (!id) {
				return;
			}
			this.request({
				url: '/works/postSeeNum',
				method: 'POST',
				data: {
					id: id
				},
				success: res => {
					uni.hideLoading();
					console.log('浏览量', res);
				}
			});
		}
	}
};
</script>

<style lang="scss">
page {
	background: #fff;
}
.prodectDetail {
	.videobox {
		width: 100%;
		& > video {
			width: 100%;
		}
		.titBox {
			padding: 20rpx;
			.tit {
				font-weight: 500;
				font-size: 30rpx;
				line-height: 30px;
				font-size: #666;
			}
			.info {
				font-size: 26rpx;
				color: #666;
				text-indent: 2em;
			}
		}
	}
}
</style>
