<template>
  <div class="pagebg">
    <canvas id="fullstarbg">你的浏览器不支持canvas标签</canvas>
    <div class="contanter">
      <div class="logoct">
        <img
          class="logo animated"
          :class="{ swing: logoactive === 1 }"
          :src="logo"
          alt=""
          srcset=""
          @mousemove="logoactive = 1"
          @mouseout="logoactive = 2"
        />
      </div>
      <!-- tab切换 -->
      <div class="tabs">
        <ul class="tabs-header clearfix">
          <li
            v-for="(fitem, findex) in urldata"
            :class="{ active: tabindex === findex }"
            :key="findex"
            @click="tabClick(fitem, findex)"
          >
            {{ fitem.title }}
          </li>
        </ul>
        <transition name="no-mode-translate-fade" mode="out-in">
          <div :key="tabindex">
            <GeminiScrollbar class="my-scroll-bar" :key="tabindex">
              <ul class="tabs-content clearfix">
                <li
                  class="tabs-item poi"
                  v-for="(item, index) in activeItem"
                  :key="index"
                  @mousemove="activeLink = index"
                  @mouseout="activeLink = ''"
                  @click="recentVisit(item)"
                >
                  <div
                    class="tabs-logo animated"
                    :class="{ heartBeat: activeLink === index }"
                  >
                    <img
                      class="db"
                      :src="item.icon || logo_link"
                      alt=""
                      srcset=""
                    />
                  </div>
                  <p class="tc" :title="item.title">{{ item.title }}</p>
                </li>
              </ul>
            </GeminiScrollbar>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import urldata from '@/data/URL.json'
import '@/utils/effect/EasePack.min.js'
import '@/utils/effect/TweenLite.min.js'
import '@/utils/effect/rAF.min.js'
import particleEffect from '@/utils/effect/particleEffect'
import logo from '@/assets/logo.png'
import search from '@/assets/icon_search@2x.png'
import logo_link from '@/assets/logo_link_default@2x.png'

export default {
  name: 'Home',
  data() {
    return {
      logo,
      search,
      logo_link,
      pholsd: true,
      searchValue: '',
      activeLink: '',
      activeItem: [],
      logoactive: 2,
      tabindex: 0,
      historyData: [], // 最近浏览
      urldata: urldata
    }
  },
  created() {
    this.historyData =
      window.locMemory.localStorage.getItem('historyData') || []
    if (this.historyData.length > 4) {
      this.urldata.unshift({
        title: '最近访问',
        data: this.historyData
      })
    } else {
      this.urldata.push({
        title: '最近访问',
        data: this.historyData
      })
    }

    this.activeItem = this.urldata[this.tabindex].data
  },
  mounted() {
    particleEffect('fullstarbg')
  },
  methods: {
    tabClick(item, index) {
      this.tabindex = index
      this.activeItem = item.data
    },
    recentVisit(item) {
      // 收集用户最近访问网址
      let historyData = this._.clone(this.historyData)
      this._.remove(historyData, function(obj) {
        return obj.link == item.link
      })
      // if (historyData.length > 9) {
      //   // 删除最后一个
      //   historyData.pop()
      // }
      historyData.unshift(item)
      this.historyData = historyData
      window.locMemory.localStorage.setItem('historyData', historyData)
      window.open(item.link)
    },
    commonlyUsed(item) {
      // 收集用户常用网址
      let commonlyData =
        window.locMemory.localStorage.getItem('historyData') || []
      const index = this._.findindex(commonlyData, { link: item.link })
      if (index > -1) {
        commonlyData[index].count++
      } else {
        const obj = this._.clone(item)
        obj.count = 1
        commonlyData.push(obj)
      }
      commonlyData = this._.orderby(commonlyData, ['count'], ['desc'])
      window.locMemory.localStorage.setItem('commonlyData', commonlyData)
    }
  }
}
</script>
<style lang="scss" scoped>
#fullstarbg {
  display: absolute;
  margin: 0;
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: -1;
}
.contanter {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  max-width: 960px;
  width: 100%;
  height: 620px;
  margin: auto;
}
.logoct {
  padding-bottom: 90px;
  height: 170px;
  text-align: center;
  .logo {
    width: 130px;
    height: 80px;
  }
}
.pagebg {
  position: relative;
  width: 100%;
  background: url('~@/assets/background_quickfinder2@3x.jpg') no-repeat center;
  background-size: cover;
  overflow: hidden;
  z-index: 1;
  .list {
    padding-bottom: 20px;
  }
}
.tabs {
  height: 450px;
  overflow: hidden;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  box-shadow: 0px 1px 20px rgba(0, 0, 0, 0.06);
}
.my-scroll-bar {
  height: 414px;
}
.tabs-content {
  padding: 18px 40px;
  padding-left: 30px;
  .tabs-item {
    float: left;
    padding: 6px;
    margin-left: 24px;
    margin-top: 21px;
    // background-color: rgba(255, 255, 255, 0.5);
    border-radius: 2px;
    &:hover {
      .tabs-logo {
        box-shadow: 0px 1px 30px rgba(2, 231, 255, 1);
      }
    }
    .tabs-logo {
      margin: 0 auto;
      background-color: #fff;
      border-radius: 6px;
      width: 60px;
      height: 60px;
      line-height: 60px;
      text-align: center;
      transition: all 0.3s;
      img {
        display: inline-block;
        vertical-align: middle;
        width: 38px;
        max-width: 44px;
        max-height: 44px;
      }
    }
    p {
      width: 74px;
      text-align: center;
      font-size: 12px;
      color: #fff;
      margin-top: 5px;
      line-height: 1.2;
      height: 28px;
      overflow: hidden;
      text-overflow: ellipsis; //文本溢出显示省略号
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
}
.tabs-header {
  background-color: rgba(255, 255, 255, 0.06);
  li {
    width: 100px;
    height: 32px;
    line-height: 32px;
    float: left;
    font-size: 14px;
    color: #fff;
    cursor: pointer;
    transition: all 0.3s;
    text-align: center;
    &:hover {
      color: rgba(255, 255, 255, 0.5);
    }
    &.active {
      color: #5b64e9;
      background: #02e7ff;
      &:hover {
        color: #5b64e9;
      }
    }
  }
}
.collect {
  li {
    display: inline-block;
    margin-left: 70px;
    margin-top: 20px;
    img {
      width: 80px;
      height: 80px;
      transition: all 0.3s ease-in-out;
    }
    &:hover {
      img {
        transform: scale(1.1);
      }
    }
    p {
      width: 80px;
      font-size: 12px;
      color: #ffffff;
    }
  }
}
.no-mode-translate-fade-enter-active,
.no-mode-translate-fade-leave-active {
  transition: all 0.3s;
}
.no-mode-translate-fade-enter,
.no-mode-translate-fade-leave-active {
  opacity: 0;
}
.no-mode-translate-fade-enter {
  transform: translateX(30px);
}
.no-mode-translate-fade-leave-active {
  transform: translateX(-30px);
}
</style>
