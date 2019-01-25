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
          @mouseenter="logoactive = 1"
          @mouseleave="logoactive = 2"
        />
      </div>
      <!-- tab切换 -->
      <div class="tabs">
        <div class="rel">
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
          <div
            class="right f16"
            @mouseenter="operating('on')"
            @mouseleave="operating('off')"
          >
            <transition name="mode-translate-fade" mode="out-in">
              <div :key="operatingFlg" class="dib vm">
                <div
                  class="operating"
                  v-if="operatingFlg"
                  @click="changeType(1)"
                  title="添加"
                >
                  <svg-icon icon-class="add" class-name="icon"></svg-icon>
                </div>
                <div
                  class="operating"
                  v-if="operatingFlg"
                  @click="changeType(2)"
                  title="修改"
                >
                  <svg-icon icon-class="edit" class-name="icon"></svg-icon>
                </div>
                <div
                  class="operating"
                  v-if="operatingFlg"
                  @click="changeType(3)"
                  title="删除"
                >
                  <svg-icon icon-class="delete" class-name="icon"></svg-icon>
                </div>
              </div>
            </transition>
            <div
              class="operating sts"
              v-if="activeObj.title != '最近访问'"
              @click="changeType(0)"
            >
              <svg-icon
                icon-class="setting"
                v-if="
                  !operatingFlg && (operatingType === 0 || operatingType === 1)
                "
                class-name="icon"
              ></svg-icon>
              <svg-icon
                icon-class="close"
                title="取消"
                v-else
                class-name="icon"
              ></svg-icon>
            </div>
          </div>
        </div>
        <!-- 网址列表数据 -->
        <transition name="mode-translate-fade" mode="out-in">
          <div :key="tabindex">
            <GeminiScrollbar class="my-scroll-bar" :key="tabindex">
              <ul class="tabs-content clearfix">
                <li
                  class="tabs-item rel animated infinite"
                  :class="{
                    active: operatingType === 0,
                    poi: operatingType === 0,
                    shake: operatingType === 3
                  }"
                  v-for="(item, index) in activeItem"
                  :key="index"
                  @mouseenter="activeLink = index"
                  @mouseleave="activeLink = ''"
                  @click="recentVisit(item)"
                >
                  <span
                    class="close poi"
                    @click="deleteHandle(item, index)"
                    v-if="operatingType === 3"
                  >
                    <svg-icon
                      icon-class="close"
                      title="删除"
                      class-name="icon"
                    ></svg-icon>
                  </span>
                  <div
                    class="tabs-logo animated rel"
                    :class="{
                      heartBeat: activeLink === index && operatingType === 0
                    }"
                  >
                    <div
                      class="edit-item"
                      v-if="operatingType === 2"
                      @click="updateItem(item, index)"
                      title="修改"
                    >
                      <svg-icon icon-class="edit" class-name="icon"></svg-icon>
                    </div>
                    <img class="db" v-lazy="item.icon" alt="" srcset="" />
                  </div>
                  <p class="tc" :title="item.title">{{ item.title }}</p>
                </li>
              </ul>
            </GeminiScrollbar>
          </div>
        </transition>
      </div>
    </div>
    <!-- 新增修改弹框 -->
    <el-dialog
      :title="operatingType === 1 ? '新增网址' : '修改网址'"
      :visible.sync="dialogFormVisible"
      :append-to-body="true"
      width="600px"
      @close="dialogClose()"
    >
      <el-form :model="requsetItem" label-width="80px" style="width:500px">
        <el-form-item label="所属分类">
          <span class="text-dark">{{ activeObj.title }}</span>
        </el-form-item>
        <el-form-item label="网站名称">
          <el-input v-model="requsetItem.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="网站图标">
          <el-input v-model="requsetItem.icon" autocomplete="off"></el-input>
          <span
            class="question poi"
            title="找不到图标，点这里"
            v-if="operatingType === 2"
            @click="dialogImgVisible = true"
          >
            <svg-icon
              icon-class="question-circle-fill"
              class-name="icon"
            ></svg-icon>
          </span>
        </el-form-item>
        <el-form-item label="网站链接">
          <el-input v-model="requsetItem.link" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUpdateInfo">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="找图标方法"
      fullscreen
      :append-to-body="true"
      :visible.sync="dialogImgVisible"
    >
      <img class="db pct100" :src="tip" alt="" srcset="" />
    </el-dialog>
  </div>
</template>

<script>
// import urldata from '@/data/URL.json'
import '@/utils/effect/EasePack.min.js'
import '@/utils/effect/TweenLite.min.js'
import '@/utils/effect/rAF.min.js'
import particleEffect from '@/utils/effect/particleEffect'
import logo from '@/assets/logo.png'
import search from '@/assets/icon_search@2x.png'
import tip from '@/assets/15482376521830.png'
import logo_link from '@/assets/logo_link_default@2x.png'
import { getInfo, addInfo, removeInfo, updateInfo } from '@/api/link'

export default {
  name: 'Home',
  data() {
    return {
      defaultImg: 'this.src="' + logo_link + '"',
      logo,
      search,
      logo_link,
      tip,
      dialogImgVisible: false,
      dialogFormVisible: false,
      pholsd: true,
      operatingFlg: false,
      operatingType: 0, // 1添加，2修改，3删除。
      searchValue: '',
      activeLink: '',
      activeItem: [],
      activeObj: {},
      logoactive: 2,
      tabindex: 0,
      historyData: [], // 最近浏览
      urldata: [],
      requsetItem: {
        title: '',
        icon: '',
        link: ''
      }
    }
  },
  created() {
    this.historyData =
      window.locMemory.localStorage.getItem('historyData') || []
    getInfo()
      .then(res => {
        this.urldata = res.data
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
        this.activeObj = this.urldata[this.tabindex]
        this.activeItem = this.urldata[this.tabindex].data
      })
      .catch(err => {
        this.$message({
          type: 'error',
          message: '服务器忙，请稍后再试'
        })
        console.log(err)
      })
  },
  mounted() {
    particleEffect('fullstarbg')
  },
  methods: {
    addUpdateInfo() {
      // 添加修改
      if (this.operatingType === 1) {
        addInfo(this.requsetItem)
          .then(res => {
            this.$message({
              type: 'success',
              message: '添加成功'
            })
            this.urldata[this.tabindex].data.push(res.data)
            this.dialogFormVisible = false
          })
          .catch(err => {
            this.$message({
              type: 'error',
              message: err.message || '服务器忙，请稍后再试'
            })
          })
      } else if (this.operatingType === 2) {
        updateInfo(this.requsetItem)
          .then(res => {
            this.$message({
              type: 'success',
              message: '修改成功'
            })
            this.urldata[this.tabindex].data[
              this.requsetItem.index
            ] = Object.assign({}, this.requsetItem)
            this.dialogFormVisible = false
            console.log(res)
          })
          .catch(err => {
            this.$message({
              type: 'error',
              message: err.message || '服务器忙，请稍后再试'
            })
          })
      }
    },
    dialogClose() {
      // 弹框关闭回调
      if (this.operatingType === 1) {
        this.operatingType = 0
      }
    },
    updateItem(item, index) {
      // 修改
      this.requsetItem.index = index
      this.requsetItem = Object.assign(this.requsetItem, item)
      this.dialogFormVisible = true
      console.log(index)
    },
    deleteHandle(item, index) {
      // 删除
      this.$confirm('此操作将永久删除该链接, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          removeInfo(item)
            .then(res => {
              this.activeItem.splice(index, 1)
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              console.log(res)
            })
            .catch(err => {
              this.$message({
                type: 'error',
                message: '服务器忙，请稍后再试'
              })
              console.log(err)
            })
        })
        .catch(() => {})
      console.log(item)
    },
    changeType(type) {
      // 操作类型
      this.operatingType = type
      this.operatingFlg = false
      if (this.operatingType === 1) {
        // 新增
        this.dialogFormVisible = true
        this.requsetItem = {
          id: this.activeObj.id,
          title: '',
          icon: '',
          link: ''
        }
      }
    },
    operating(what) {
      // 显示操作按钮
      if (this.operatingType === 2 || this.operatingType === 3) {
        return
      }
      if (what === 'on') {
        this.operatingFlg = true
      } else if (what === 'off') {
        this.operatingFlg = false
      }
    },
    tabClick(item, index) {
      // tab切换
      if (item.title === '最近访问' && this.operatingType !== 0) {
        this.$message({
          type: 'warning',
          message: '不允许操作最近访问~'
        })
        return
      }
      this.tabindex = index
      this.activeObj = item
      this.activeItem = item.data
    },
    recentVisit(item) {
      // 收集用户最近访问网址
      if (this.operatingType !== 0) {
        return
      }
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
    .close {
      position: absolute;
      z-index: 1;
      left: 5px;
      top: 0px;
      width: 18px;
      height: 18px;
      line-height: 18px;
      background-color: #f2f2f2;
      text-align: center;
      border-radius: 100%;
      .icon {
        color: rgb(46, 28, 14);
        font-size: 12px;
        vertical-align: -1px;
      }
    }
    &.active:hover {
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
      overflow: hidden;
      .edit-item {
        position: absolute;
        z-index: 1;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        text-align: center;
        background-color: rgba(0, 0, 0, 0.5);
        cursor: pointer;
        .icon {
          font-size: 28px;
          color: #fff;
          vertical-align: middle;
        }
      }
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
      // color: rgba(255, 255, 255, 0.5);
      background-color: rgba(255, 255, 255, 0.1);
    }
    &.active {
      color: #5b64e9;
      background: #02e7ff;
      &:hover {
        background: #02e7ff;
      }
    }
  }
}
.tabs {
  .right {
    position: absolute;
    top: 0;
    right: 0;
    font-size: 0;
    .operating {
      display: inline-block;
      width: 30px;
      line-height: 32px;
      text-align: center;
      transition: all 0.3s;
      cursor: pointer;
      &:not(.sts):hover {
        background-color: rgba(255, 255, 255, 0.1);
      }
      .icon {
        color: #fff;
        font-size: 16px;
        vertical-align: middle;
      }
    }
  }
}

.mode-translate-fade-enter-active,
.mode-translate-fade-leave-active {
  transition: all 0.3s;
}
.mode-translate-fade-enter,
.mode-translate-fade-leave-active {
  opacity: 0;
}
.mode-translate-fade-enter {
  transform: translateX(30px);
}
.mode-translate-fade-leave-active {
  transform: translateX(-30px);
}
@keyframes shake {
  from,
  to {
    transform: rotate(0deg);
  }

  10%,
  30%,
  50%,
  70%,
  90% {
    transform: rotate(-1.5deg);
  }

  20%,
  40%,
  60%,
  80% {
    transform: rotate(1.5deg);
  }
}
.question {
  position: absolute;
  top: 0;
  right: -20px;
  font-size: 16px;
}
.shake {
  animation-timing-function: ease-in-out;
  animation-duration: 1.3s;
  animation-name: shake;
}
</style>
