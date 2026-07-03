<template>
  <view class="sizes-page">
    <view class="search-wrap">
      <u-search v-model="keyword" placeholder="搜索证件名称或尺寸" bg-color="#ffffff"
        search-icon-color="#ff6b57" :show-action="false" height="84" />
    </view>

    <view class="page-head">
      <view>
        <text class="title">全部证件尺寸</text>
        <text class="subtitle">已收录 {{ filteredSizes.length }} 种常用规格</text>
      </view>
      <view class="count-badge">{{ allSizes.length }}</view>
    </view>

    <view v-if="filteredSizes.length" class="size-list">
      <view class="size-row" v-for="(item, index) in filteredSizes" :key="index" @click="selectSize(item)">
        <view class="number">{{ numberCase(index) }}</view>
        <view class="size-info">
          <text class="name">{{ item.name }}</text>
          <view class="meta-row">
            <text>{{ item.mmWidth }} × {{ item.mmHeight }} mm</text>
            <text>{{ item.pxWidth }} × {{ item.pxHeight }} px</text>
            <text>{{ item.dpi }} DPI</text>
          </view>
        </view>
        <u-icon name="arrow-right" color="#aaa5a2" size="24" />
      </view>
    </view>

    <view v-else class="empty-state">
      <u-icon name="search" color="#d8d2ce" size="72" />
      <text class="empty-title">没有找到相关尺寸</text>
      <text class="empty-desc">换个名称或输入“25×35”试试</text>
    </view>
  </view>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { Mutation } from 'vuex-class'
import { allSize, PhotoSize } from '@/model/PhotoSize'

@Component
export default class AllSizes extends Vue {
  keyword = ''
  allSizes: Array<PhotoSize> = allSize

  @Mutation('SET_PHOTO_SIZE') setPhotoSize!: (data: PhotoSize) => void

  get filteredSizes() {
    const key = this.keyword.trim().toLowerCase().replace(/[×x*\s]/g, '')
    if (!key) return this.allSizes
    return this.allSizes.filter(item => {
      const name = (item.name || '').toLowerCase()
      const mm = `${item.mmWidth}${item.mmHeight}`
      const px = `${item.pxWidth}${item.pxHeight}`
      return name.indexOf(key) !== -1 || mm.indexOf(key) !== -1 || px.indexOf(key) !== -1
    })
  }

  numberCase(index: number) { return String(index + 1).padStart(2, '0') }

  selectSize(item: PhotoSize) {
    this.setPhotoSize(item)
    uni.navigateTo({ url: '/pages/photo/index' })
  }
}
</script>

<style lang="scss" scoped>
.sizes-page { min-height: 100%; padding: 24rpx 30rpx 50rpx; background: #fbfaf9; color: #252525; box-sizing: border-box; }
.search-wrap { position: sticky; top: 0; z-index: 5; padding: 8rpx 0 24rpx; background: #fbfaf9; }
.search-wrap ::v-deep .u-search__content { border: 1rpx solid #f0e8e4; box-shadow: 0 10rpx 32rpx rgba(71,48,42,.05); }
.page-head { display: flex; align-items: center; justify-content: space-between; padding: 18rpx 6rpx 30rpx; }
.page-head > view:first-child { display: flex; flex-direction: column; gap: 8rpx; }
.title { font-size: 40rpx; line-height: 1.25; font-weight: 700; }
.subtitle { color: #99928e; font-size: 24rpx; }
.count-badge { min-width: 58rpx; height: 58rpx; padding: 0 12rpx; border-radius: 20rpx; line-height: 58rpx; text-align: center; color: #ff6b57; background: #fff0eb; font-size: 24rpx; font-weight: 700; box-sizing: border-box; }
.size-list { overflow: hidden; padding: 6rpx 28rpx; border-radius: 30rpx; background: #fff; box-shadow: 0 16rpx 48rpx rgba(71,48,42,.07); }
.size-row { display: flex; align-items: center; min-height: 132rpx; border-bottom: 1rpx solid #eeeae8; }
.size-row:last-child { border-bottom: 0; }
.number { flex: none; width: 58rpx; height: 46rpx; border-radius: 13rpx; line-height: 46rpx; text-align: center; color: #ff6b57; background: #fff1ed; font-size: 22rpx; font-weight: 600; }
.size-info { flex: 1; min-width: 0; margin: 0 20rpx; display: flex; flex-direction: column; gap: 14rpx; }
.name { overflow: hidden; color: #292725; font-size: 28rpx; font-weight: 600; text-overflow: ellipsis; white-space: nowrap; }
.meta-row { display: flex; flex-wrap: wrap; gap: 10rpx 18rpx; color: #9b9692; font-size: 21rpx; }
.empty-state { height: 520rpx; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16rpx; }
.empty-title { margin-top: 12rpx; font-size: 30rpx; font-weight: 600; }
.empty-desc { color: #aaa4a0; font-size: 24rpx; }
</style>
