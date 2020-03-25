<template>
	<view class="myContributionList">
		<view class="menubox flex justify-between align-center">
			<view @click="gotoAddCategory(1)" class="addbox flex align-center">
				<image src="/static/add.png" mode="aspectFill"></image>
				<text>发布文稿</text>
			</view>
			<view @click="del" class="delbox flex align-center">
				<image src="/static/delete.png" mode="aspectFill"></image>
				<text>删除</text>
			</view>
		</view>
		<view v-for="(item, index) in list" :key="index" class="item">
			<!-- <view @click="gotoAddCategory(2, item)" class="topbox flex align-center justify-end">
				<image src="/static/xiugai.png" mode="aspectFill"></image>
				<text>修改</text>
			</view> -->
			<view class="infoBox flex align-center">
				<view class="left flex align-center">
					<view @click="changeRadio(index)" style="padding-right:24rpx ;">
						<image class="select" :src="selectIdx[index] ? '/static/select.png' : '/static/noo.png'" mode="aspectFill"></image>
					</view>
					<image class="pic" :src="item.picture" mode="aspectFill"></image>
				</view>
				<view class="right flex flex-direction  ">
					<view class="titbox">
						<view class="tit1 textov1 ">{{ item.title }}</view>
						<view class="tit2  textov1 ">{{ item.desc }}</view>
					</view>
					<view class="viewbox">
						<image src="/static/eye.png" mode="aspectFill" style="margin-right: 6px;"></image>
						<text>{{ item.see_num }}</text>
					</view>
				</view>
			</view>
		</view>
		<will-nodata v-if="list.length==0" ></will-nodata>
	</view>
</template>

<script>
export default {
	data() {
		return {
			list: [],
			selectIdx: []
		};
	},
	onShow() {
		this.getList();
	},
	methods: {
		getList() {
			this.showLoading();
			this.request({
				url: '/works/getMyList',
				data: {},
				success: res => {
					uni.hideLoading();
					console.log('投稿列表', res);
					if (res.data.status === 1) {
						res.data.list = res.data.list.map(i => {
							i.picture = res.data.image_url + i.picture;
							return i;
						});
						this.list = res.data.list;
						let newSelect = new Array(res.data.list.length).fill(false);
						this.selectIdx = newSelect;
					} else {
						this.list = [];
						this.selectIdx = [];
					}
				}
			});
		},
		gotoAddCategory(type, item) {
			if (type === 1) {
				uni.navigateTo({
					url: '/pages/my/upLoadContribution'
				});
			} else {
				uni.navigateTo({
					url: '/pages/my/upLoadContribution?type=2&item=' + JSON.stringify(item)
				});
			}
		},
		changeRadio(idx) {
			this.selectIdx.splice(idx, 1, !this.selectIdx[idx]);
		},
		del() {
			if (
				this.selectIdx.every(val => {
					return val === false;
				})
			) {
				this.showToast('请勾选文稿');
				return;
			} else {
				let idArr = [];
				for (let idx in this.selectIdx) {
					if (this.selectIdx[idx]) {
						idArr.push(this.list[idx].id);
					}
				}
				console.log(idArr);
				if (!idArr.length) {
					this.showToast('请勾选文稿');
					return;
				}
				uni.showModal({
					title: '删除文稿',
					content: '确定删除吗?',
					success: res => {
						if (res.confirm) {
							this.showLoading();
							this.request({
								url: '/works/postDelete',
								method: 'POST',
								data: {
									works_ids: idArr.join(',')
								},
								success: res => {
									uni.hideLoading();
									console.log('删除结果', res);
									this.getList();
								}
							});
						}
					}
				});
			}
		}
	}
};
</script>

<style lang="less">
.myContributionList {
	.menubox {
		font-size: 32rpx;
		color: #000;
		background: #ffe0a9;
		padding: 0 30rpx;
		height: 40px;
		.addbox > image,
		.delbox > image {
			margin-right: 17rpx;
			width: 32rpx;
			height: 32rpx;
		}
	}
	.item {
		margin-top: 8px;
		background: #fff;
		padding: 0 30rpx;
		.topbox {
			height: 60rpx;
			border-bottom: 1rpx solid #e8e8e8;
			font-size: 28rpx;
			& > image {
				margin-right: 10rpx;
				width: 28rpx;
				height: 28rpx;
			}
		}
		.infoBox {
			padding: 30rpx 0;
			.left {
				.select {
					width: 34rpx;
					height: 34rpx;
					// margin-right: 24rpx;
				}
				.pic {
					width: 220rpx;
					height: 146rpx;
				}
			}
			.right {
				padding-left: 30rpx;
				width: calc(100% - 250rpx);
				.titbox {
					.tit1 {
						font-size: 32rpx;
						color: #000;
					}
					.tit2 {
						font-size: 26rpx;
						color: #777777;
						margin-top: 4px;
						margin-bottom: 8px;
					}
				}
				.viewbox {
					font-size: 22rpx;
					color: #9d9d9d;
					& > image {
						width: 22rpx;
						height: 16rpx;
					}
				}
			}
		}
	}
}
</style>
