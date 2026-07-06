<template>
  <view class="home-page">
    <swiper class="hero-swiper" :autoplay="true" :circular="true" :interval="4200" :duration="500"
      :indicator-dots="true" indicator-color="rgba(255,107,87,.28)" indicator-active-color="#ff6b57"
      aria-label="AI证件照主视觉轮播">
      <swiper-item v-for="(banner, index) in heroBanners" :key="index">
        <view class="hero-slide">
          <image class="hero-image" :src="banner" mode="widthFix" />
        </view>
      </swiper-item>
    </swiper>

    <view class="page-content">
      <view class="size-panel">
        <view class="size-option active" @click="navigateToPhotoSelect(11)">
          <view class="selected-mark"><u-icon name="checkmark" color="#fff" size="22" /></view>
          <u-icon name="account-fill" color="#ff6b57" size="52" />
          <text class="size-name">一寸照</text>
          <text class="size-meta accent">25×35mm</text>
        </view>
        <view class="divider" />
        <view class="size-option" @click="navigateToPhotoSelect(12)">
          <u-icon name="account" color="#262626" size="56" />
          <text class="size-name">二寸照</text>
          <text class="size-meta">35×49mm</text>
        </view>
        <view class="divider" />
        <view class="size-option" @click="openCustomSize(true)">
          <u-icon name="scan" color="#262626" size="54" />
          <text class="size-name">自定义尺寸</text>
          <text class="size-meta">自由设置大小</text>
        </view>
      </view>

      <view class="popular-panel">
        <view class="section-head">
          <view class="section-title"><u-icon name="star-fill" color="#ff6b57" size="34" /><text>热门证件</text></view>
          <text class="more" @click="goToAllSizes">全部更多 ›</text>
        </view>
        <view class="photo-grid">
          <view class="photo-item" v-for="(item, index) in displayList" :key="index"
            @click="navigateToPhotoSelect(item.id || 1)">
            <text class="rank">{{ numberCase(index) }}</text>
            <text class="photo-name">{{ item.name }}</text>
            <u-icon name="arrow-right" color="#9b9b9b" size="22" />
          </view>
        </view>
      </view>
    </view>

    <u-popup :show="customSize" mode="bottom" :round="24" @close="openCustomSize(false)">
      <view class="size-form-box">
        <view class="sheet-handle" />
        <view class="sheet-title">自定义证件照尺寸</view>
        <u-form label-width="120rpx" :model="customSizeForm" ref="sizeForm">
          <u-form-item label="宽度" prop="width"><u-input type="number" v-model="customSizeForm.width" placeholder="80-1200" /><text slot="right">px</text></u-form-item>
          <u-form-item label="高度" prop="height"><u-input type="number" v-model="customSizeForm.height" placeholder="80-1200" /><text slot="right">px</text></u-form-item>
          <u-form-item label="实际尺寸"><text slot="right">{{ mmHeight && mmWidth ? `${mmWidth} × ${mmHeight} mm` : '-' }}</text></u-form-item>
          <u-form-item label="分辨率"><text slot="right">{{ customSizeForm.dpi }} DPI</text></u-form-item>
        </u-form>
        <view class="sheet-actions">
          <u-button class="secondary-btn" :plain="true" @click="openCustomSize(false)">取消</u-button>
          <u-button class="primary-btn" @click="goToGenerate">生成证件照</u-button>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Ref } from 'vue-property-decorator'
import { photoSizes, PhotoSize, getPhotoSize } from '@/model/PhotoSize'
import { Mutation } from 'vuex-class'

const DPICoefficient = 25.4

@Component
export default class Index extends Vue {
  heroBanners = [
    '/static/home-hero-reference.jpg',
    '/static/home-hero-white-suit.jpg'
  ]
  hostList = photoSizes.slice(0, 10)
  customSize = false
  customSizeForm: AnyObject = { height: undefined, width: undefined, dpi: 300 }

  @Ref('sizeForm') readonly sizeForm!: HTMLFormElement
  @Mutation('SET_PHOTO_SIZE') setPhotoSize!: (data: PhotoSize) => void

  get displayList() { return this.hostList.slice(0, 8) }
  get mmWidth() { return Math.round(this.customSizeForm.width * DPICoefficient / this.customSizeForm.dpi) }
  get mmHeight() { return Math.round(this.customSizeForm.height * DPICoefficient / this.customSizeForm.dpi) }

  rules = {
    height: [{ required: true, message: '请输入高度', trigger: ['change', 'blur'] }, { type: 'integer', message: '请输入整数', trigger: ['change', 'blur'] }, { validator: (_rule: any, value: any, callback: any) => Number(value) >= 80 && Number(value) <= 1200 ? callback() : callback(new Error()), message: '高度应在80-1200px之间', trigger: ['change', 'blur'] }],
    width: [{ required: true, message: '请输入宽度', trigger: ['change', 'blur'] }, { type: 'integer', message: '请输入整数', trigger: ['change', 'blur'] }, { validator: (_rule: any, value: any, callback: any) => Number(value) >= 80 && Number(value) <= 1200 ? callback() : callback(new Error()), message: '宽度应在80-1200px之间', trigger: ['change', 'blur'] }]
  }

  mounted() { this.sizeForm && this.sizeForm.setRules(this.rules) }
  numberCase(index: number) { return String(index + 1).padStart(2, '0') }
  openCustomSize(flag: boolean) { this.customSize = flag }
  goToAllSizes() { uni.navigateTo({ url: '/pages/sizes/index' }) }

  goToGenerate() {
    this.sizeForm.validate().then(() => {
      const photoSize: PhotoSize = { name: '自定义尺寸', pxHeight: this.customSizeForm.height, pxWidth: this.customSizeForm.width, mmHeight: this.mmHeight, mmWidth: this.mmWidth, dpi: this.customSizeForm.dpi }
      uni.navigateTo({ url: '/pages/photo/index', success: () => this.setPhotoSize(photoSize) })
    }).catch(() => uni.showToast({ title: '请按规则填写宽度和高度', icon: 'none' }))
  }

  navigateToPhotoSelect(id: number) {
    const photoSize = getPhotoSize(id)
    if (photoSize) uni.navigateTo({ url: `/pages/photo/index?id=${id}`, success: () => this.setPhotoSize(photoSize) })
  }
}
</script>

<style lang="scss" scoped>
.home-page { min-height: 100%; background: #fbfaf9; color: #252525; padding-bottom: 36rpx; }
.hero-swiper { width: 100%; height: 540rpx; background: #fff8f5; }
.hero-slide { position: relative; width: 100%; height: 540rpx; overflow: hidden; }
.hero-image { position: absolute; top: 0; left: 0; width: 100%; height: auto; display: block; }
.hero-swiper ::v-deep .uni-swiper-dots { bottom: 22rpx; }
.page-content { position: relative; z-index: 2; margin-top: -4rpx; padding: 0 30rpx; }
.size-panel { height: 336rpx; display: flex; align-items: center; padding: 30rpx 20rpx; background: rgba(255,255,255,.97); border-radius: 34rpx; box-shadow: 0 18rpx 52rpx rgba(71,48,42,.1); }
.size-option { position: relative; flex: 1; height: 274rpx; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 18rpx; border: 2rpx solid transparent; border-radius: 24rpx; }
.size-option.active { border-color: #ff6b57; background: #fffaf8; }
.selected-mark { position: absolute; top: 14rpx; right: 14rpx; width: 42rpx; height: 42rpx; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: #ff6b57; }
.divider { width: 1rpx; height: 220rpx; background: #e8e5e3; }
.size-name { font-size: 30rpx; line-height: 1.2; font-weight: 600; white-space: nowrap; }
.size-meta { color: #a5a3a2; font-size: 23rpx; white-space: nowrap; }
.size-meta.accent { color: #ff6b57; }
.popular-panel { margin-top: 28rpx; padding: 34rpx 34rpx 18rpx; background: #fff; border-radius: 34rpx; box-shadow: 0 16rpx 48rpx rgba(71,48,42,.07); }
.section-head, .section-title, .photo-item { display: flex; align-items: center; }
.section-head { justify-content: space-between; margin-bottom: 20rpx; }
.section-title { gap: 12rpx; font-size: 32rpx; font-weight: 700; }
.more { color: #8f8c8a; font-size: 24rpx; }
.photo-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); column-gap: 30rpx; }
.photo-item { min-width: 0; height: 96rpx; border-bottom: 1rpx solid #eeeae8; }
.photo-item:nth-last-child(-n+2) { border-bottom: 0; }
.rank { flex: none; width: 52rpx; height: 42rpx; line-height: 42rpx; text-align: center; border-radius: 12rpx; color: #ff6b57; background: #fff1ed; font-size: 23rpx; font-weight: 600; }
.photo-name { flex: 1; min-width: 0; margin-left: 18rpx; font-size: 26rpx; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.size-form-box { padding: 20rpx 44rpx 54rpx; background: #fff; }
.sheet-handle { width: 68rpx; height: 8rpx; margin: 0 auto 26rpx; border-radius: 8rpx; background: #dedbd9; }
.sheet-title { margin-bottom: 20rpx; font-size: 34rpx; font-weight: 700; }
.sheet-actions { display: flex; gap: 20rpx; margin-top: 34rpx; }
.sheet-actions ::v-deep .u-button { height: 88rpx; border-radius: 24rpx; }
.secondary-btn { color: #ff6b57 !important; border-color: #ff6b57 !important; }
.primary-btn { color: #fff !important; background: #ff6b57 !important; border-color: #ff6b57 !important; }
</style>
