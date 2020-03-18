<template>
	<view class="addEvaluate">
		<view v-for="(item, index) in order.product_order_list" :key="index" class="goodsitem flex align-center bg-white">
			<image :src="item.product_image" mode="aspectFill"></image>
			<view class="textov1">{{ item.product_name }}</view>
		</view>
		<view class="commitbox bg-white">
			<textarea v-model="commit" maxlength="999" placeholder="说说你使用的心得,分享给更多的朋友吧!" />
			<view class="cu-form-group" style="padding: 0;">
				<view class="grid col-4 grid-square flex-sub">
					<view class="solids" @tap="ChooseImage" v-if="imgList.length < 4"><text class="cuIcon-cameraadd"></text></view>
					<view class="bg-img" v-for="(item, index) in imgList" :key="index" @tap="ViewImage" :data-url="imgList[index]">
						<image :src="imgList[index]" mode="aspectFill"></image>
						<view class="cu-tag bg-red" @click.stop="DelImg" :data-index="index"><text class="cuIcon-close"></text></view>
					</view>
				
				</view>
			</view>
		</view>
		<view style="display: none;" class="anonymousBox flex align-center justify-between bg-white cu-form-group">
			<text>匿名</text>
			<!-- #ifdef MP-ALIPAY -->
			<switch class="red" @change="switchAnonymous" :class="{ checked: anonymous }" :checked="anonymous" color="#e54d42"></switch>
			<!-- #endif -->
			<!-- #ifndef MP-ALIPAY -->
			<switch class="red" @change="switchAnonymous" :class="{ checked: anonymous }" :checked="anonymous"></switch>
			<!-- #endif -->
		</view>

		<view class="btnbox"><button @click="saveCommit" class="btn cu-btn text-white ">提交评价</button></view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			order: '',
			commit: '',
			imgList: [],
			imgSrcList:[], // 上传后的路径
			anonymous: false	
		};
	},
	onLoad(options) {
		if (options.order) {
			this.order = JSON.parse(options.order);
			console.log(this.order);
		}
	},
	methods: {
		saveCommit() {
			if (!this.commit) {
				this.showToast('请输入评论内容');
				return;
			}
			// let userInfo = uni.getStorageSync('userInfo');
			// if (!userInfo) {
			// 	this.showToast('请先登录');
			// 	return;
			// }
			let formdata = { 
				userId: userInfo.userId,
				openid: uni.getStorageSync('openId'), 
				userName: userInfo.wxName || userInfo.name,
				userPic: userInfo.wxPic || '',
				toId: this.order.pro_list[0].productId,
				toName: this.order.pro_list[0].productName,
				toPic: this.order.pro_list[0].productPic,
				content: this.commit,
				anonymous: this.anonymous ? 1 : 2, // 是否匿名 1是 2否
				orderId: this.order.id
			};
			this.showLoading();
			this.request({
				url: '',
				data: formdata,
				success: res => {
					console.log('保存文字', res);
					if (res.data.returnCode === 1) {
						if (!this.imgList.length) {
							this.showSuccess();
						} else {
							Promise.all(this.uploadIMGlist(res.data.obj.id)).then(
								res => {
									console.log('promise数组全部成功', res);
									this.showSuccess();
								},
								err => {
									console.log('promise数组没有全部成功', err);
									this.showSuccess(2);
								}
							);
						}
					} else {
						uni.hideLoading();
						this.showToast(res.data.returnStr);
					}
				}
			});
		},
		uploadIMGlist(id) {
			console.log(id);
			let promiseArr = [];
			for (let idx in this.imgList) {
				promiseArr.push(
					new Promise((resolve, reject) => {
						uni.uploadFile({
							url: this.apiUrl + '', //仅为示例，非真实的接口地址
							filePath: this.imgList[idx],
							name: 'file',
							formData: {
								commentId: id,
								sort: idx
							},
							success: uploadFileRes => {
								console.log(uploadFileRes);
								resolve(uploadFileRes);
								// if (JSON.parse(uploadFileRes.data).returnCode === 1) {
								// 	resolve(uploadFileRes);
								// } else {
								// 	reject(uploadFileRes);
								// }
							},
							fail: err => {
								reject(err);
							}
						});
					})
				);
			}
			console.log('promise数组', promiseArr);
			return promiseArr;
		},
		showSuccess(type = 1) {
			uni.hideLoading();
			this.showToast(type === 1 ? '评价成功!' : '部分图片上传失败');
			setTimeout(() => {
				uni.redirectTo({
					url: '/pages/my/myOrder?type=0'
				});
			}, 1000);
		},
		// 改变订单状态
		changeOrderType(id, type) {
			this.request({
				url: '/',
				data: {
					id: id,
					type: type
				},
				success: res => {
					if (res.data.returnCode === 1) {
					}
				}
			});
		},
		ChooseImage() {
			if(this.imgList.length>2){
				return
			}
			uni.chooseImage({
				count: 1, //默认9
				sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album'], //从相册选择
				success: res => {
					if (this.imgList.length != 0) {
						this.imgList = this.imgList.concat(res.tempFilePaths);
					} else {
						this.imgList = res.tempFilePaths;
					}
					uni.uploadFile({
						url: this.uploadUrl +'/admin/upload', //仅为示例，非真实的接口地址
						filePath: res.tempFilePaths[0],
						name: 'file',
						formData: { 
						},
						success:res=>{
							let resoult = JSON.parse(res.data)
							console.log('上传图片',resoult); 
							if(resoult.status===1){
								this.imgSrcList.push(resoult.url)
								console.log(this.imgSrcList)
							}else{
								this.showToast(resoult.info)
							}
						},
						fail:err=>{
							console.log(err);
						}
					})
				}
			});
		},
		ViewImage(e) {
			uni.previewImage({
				urls: this.imgList,
				current: e.currentTarget.dataset.url
			});
		},
		DelImg(e) {
			console.log(1111)
			this.imgList.splice(e.currentTarget.dataset.index, 1);
			this.imgSrcList.splice(e.currentTarget.dataset.index, 1);
			console.log(this.imgSrcList);
		},
		switchAnonymous(e) {
			this.anonymous = e.detail.value;
		}
	}
};
</script>

<style lang="scss">
.addEvaluate {
	.goodsitem {
		border-bottom: 1rpx solid #ededed;
		padding: 0 30rpx;
		height: 96rpx;
		& > image {
			width: 80rpx;
			height: 80rpx;
			margin-right: 20rpx;
		}
		.textov1 {
			flex: 1;
		}
	}

	.commitbox {
		border-bottom: 1rpx solid #ededed;
		padding: 30rpx;
		& > textarea {
			font-size: 24rpx;
			width: 100%;
			height: 120px;
		}
	}

	.anonymousBox {
		font-size: 28rpx;
		color: #333333;
		height: 96rpx;
		padding: 0 30rpx;
	}

	.btnbox {
		padding: 0 30rpx;
		margin-top: 55px;
		.btn {
			width: 100%;
			height: 88rpx;
			background-image: linear-gradient(-90deg, #ff585f 0%, #ff826a 100%);
			border-radius: 44rpx;
			font-size: 32rpx;
		}
	}
}
</style>
