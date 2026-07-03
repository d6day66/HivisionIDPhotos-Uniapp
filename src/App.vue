<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
    mpType: 'app',
    onLaunch() {
        console.log('App Launch')

    },
    onShow() {
        console.log('App Show')
        // #ifndef APP-NVUE
        uni.requireNativePlugin = () => { };
        // #endif

    },
    onHide() {
        console.log('App Hide')
    }
});
</script>

<style lang="scss">
@import "uview-ui/index.scss";

/* 全局元素样式必须放在 app.wxss，避免注入组件作用域后产生非法标签选择器。 */
page {
    height: 100%;
}

._div {
    box-sizing: border-box;
}
</style>
