<template>
	<view>
		<view class="VerticalBox">
			<scroll-view class="VerticalNav nav" scroll-y scroll-with-animation :scroll-top="verticalNavTop" :style="heightList">
				<view class="cu-item" :class="index == tabCur ? 'text-green cur' : ''" v-for="(item, index) in list" :key="index" @tap="TabSelect" :data-id="index">{{ item.name }}</view>
			</scroll-view>
			<scroll-view class="VerticalMain" scroll-y scroll-with-animation :style="heightList" :scroll-into-view="'main-' + mainCur" @scroll="VerticalMain">
				<view class="padding-top padding-lr" v-for="(item, index) in list" :key="index" :id="'main-' + index">
					<view class="cu-bar solid-bottom bg-white">
						<view class="action">
							<text class="cuIcon-title text-green"></text>
							{{ item.name }}
						</view>
					</view>
					<view class="cu-list menu-avatar">
						<view class="cu-item2 bg-white " style="height: auto;">
							<view class="flex flex-wrap">
								<view
									@click="gotoCategory(item2.id, item2.name)"
									class="item flex flex-direction  justify-center align-center "
									v-for="(item2, index2) in item.children"
									:key="index2"
								>
									<view class="imgbox"><image :src="  item2.icon" mode="aspectFill"></image></view>
									<text>{{ item2.name }}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>

		<!-- #ifdef MP-WEIXIN -->
		<will-mc class="mc" v-if="showGetAuthor">
			<view class="_mcMain bg-white ">
				<image @click="showGetAuthor = false" src="/static/delect.png" mode=""></image>
				<view class="tit">欢迎授权登录所暮商城</view>
				<view class="tip">授权登录后即可使用哦~</view>
				<button @getuserinfo="getOpenId_btn" class="btn cu-btn" open-type="getUserInfo">点击授权</button>
			</view>
		</will-mc>
		<!-- #endif -->
	</view>
</template>

<script>
export default {
	data() {
		return {
			list: [],
			tabCur: -1,
			mainCur: 0,
			verticalNavTop: 0,
			load: true, 
			heightList: 'height:calc(100vh - 50px )',
			showGetAuthor: false,
			userInfo: {}
		};
	},
	onLoad() {
		// #ifdef MP-WEIXIN
		this.heightList = 'height: 100vh';
		// #endif 
		
		let list = [{}];
		for (let i = 0; i < 26; i++) {
			list[i] = {};
			list[i].name =  '分类' + i;
			list[i].id = i;
			list[i].children =[{icon:"/static/goods.jpg",id:233},{icon:"/static/goods.jpg",id:2333}]
		}
		this.list = list; 	

		// this.getCategoryList();
	},
	onShow() {
		// if (!this.isLoad()) {
		// 	// #ifdef MP-WEIXIN
		// 	this.showGetAuthor = true;
		// 	// #endif
		// } else {
		// 	// #ifdef MP-WEIXIN
		// 	this.showGetAuthor = false;
		// 	// #endif
		// }
		// this.changeIdxByStorage();
	},
	onHide() {
		// uni.removeStorage({
		// 	key: 'tabCurId'
		// });
	},
	methods: {
		// #ifdef MP-WEIXIN
		getOpenId_btn(e) {
			this.getOpenId(e, this);
		},
		// #endif
		getCategoryList() {
			this.showLoading();
			this.request({
				url: '',
				data: {},
				success: res => {
					console.log('分类', res);
					uni.hideLoading();
					if (res.data.returnCode === 1) {
						this.list = res.data.list;
					}
				}
			});
		},
		gotoCategory(id, name) {
			uni.navigateTo({
				url: '/pages/category/categoryList?id=' + id + '&name=' + name + '&type=2'
			});
		},

		changeIdxByStorage() {
			let tabCurId = uni.getStorageSync('tabCurId');
			if (tabCurId && this.list) {
				for (let idx in this.list) {
					if (this.list[idx].id == tabCurId) {
						this.tabCur = idx;
						this.mainCur = idx;
						break;
					}
				}
			}
		},
		// ---------------------- 下面是滚动动画

		TabSelect(e) {
			this.tabCur = e.currentTarget.dataset.id;
			this.mainCur = e.currentTarget.dataset.id;
			this.verticalNavTop = (e.currentTarget.dataset.id - 1) * 50;
		},
		VerticalMain(e) {
			// #ifdef MP-ALIPAY
			return false; //支付宝小程序暂时不支持双向联动
			// #endif
			let that = this;
			let tabHeight = 0;
			if (this.load) {
				for (let i = 0; i < this.list.length; i++) {
					let view = uni.createSelectorQuery().select('#main-' + this.list[i].id);
					view
						.fields(
							{
								size: true
							},
							data => {
								this.list[i].top = tabHeight;
								tabHeight = tabHeight + data.height;
								this.list[i].bottom = tabHeight;
							}
						)
						.exec();
				}
				this.load = false;
			}
			let scrollTop = e.detail.scrollTop + 10;
			for (let i = 0; i < this.list.length; i++) {
				if (scrollTop > this.list[i].top && scrollTop < this.list[i].bottom) {
					this.verticalNavTop = (this.list[i].id - 1) * 50;
					this.tabCur = this.list[i].id;
					console.log(scrollTop);
					return false;
				}
			}
		}
	}
};
</script>

<style lang="scss">
.fixed {
	position: fixed;
	z-index: 99;
}

.VerticalNav.nav {
	width: 200upx;
	white-space: initial;
}

.VerticalNav.nav .cu-item {
	width: 100%;
	text-align: center;
	background-color: #fff;
	margin: 0;
	border: none;
	height: 50px;
	position: relative;
}

.VerticalNav.nav .cu-item.cur {
	background-color: #f1f1f1;
}

.VerticalNav.nav .cu-item.cur::after {
	content: '';
	width: 8upx;
	height: 30upx;
	border-radius: 10upx 0 0 10upx;
	position: absolute;
	background-color: currentColor;
	top: 0;
	right: 0upx;
	bottom: 0;
	margin: auto;
}

.VerticalBox {
	display: flex;
}

.VerticalMain {
	background-color: #f1f1f1;
	flex: 1;
}

.cu-item2 {
	// padding: 0 20rpx;
	.item {
		width: calc(100% / 3);
		padding-bottom: 10rpx !important;
		& > text {
			font-size: 26rpx;
			color: #333333;
			padding: 10px 0;
		}
		.imgbox {
			width: 112rpx;
			height: 112rpx;
			image {
				width: 112rpx;
				height: 112rpx;
			}
		}
	}
}
</style>
