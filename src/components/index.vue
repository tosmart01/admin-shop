<template>
  <div class="index">
    <el-container>
      <el-header>
        <div>
          <img src="../assets/heima.png" alt="">
          <span>五五开管理系统</span>
        </div>
        <el-button type="info" round size="small">注销</el-button>
      </el-header>
      <el-container>
        <el-aside :width="width">
          <el-menu :default-active="defaultActive" router :collapse-transition="false" :collapse="collapse"
                   class="menu-side" background-color="#333744" text-color="#fff" style="width: 200px" unique-opened>
            <!--缩小菜单-->
            <div class="flex-menu" title="缩小" @click="flexMenu" :style="{width:width}">|||</div>
            <!--一级菜单-->
            <el-submenu :index="item.id.toString()" v-for="item in menuList">
              <template slot="title">
                <i :class="iconObj[item.name]"></i>
                <span>{{item.name}}</span>
              </template>
              <!--二级菜单-->
              <el-menu-item @click="activeMenu(child.url)" :index="child.url" :class="'el-icon-menu'"
                            v-for="child in item.children">{{child.name}}
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!--内容区域-->
        <el-main>
          <!--面包屑导航-->
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
          </el-breadcrumb>
          <router-view>

          </router-view>
        </el-main>
      </el-container>
    </el-container>


  </div>


</template>

<script>
  export default {

    data() {
      return {
        menuList: [],
        iconObj: {
          "用户管理": 'el-icon-s-custom',
          '权限管理': 'el-icon-s-release',
          '商品管理': 'el-icon-s-goods',
          '订单管理': 'el-icon-notebook-2',
          '数据统计': 'el-icon-s-data'
        },
        collapse: false,
        width: '200px',
        defaultActive: '/api/user/'
      }
    },

    methods: {
      async getMenuList() {
        const {data: res} = await this.axios.get('/api/menu/')

        if (res.code != 200) return this.$message.error('获取菜单失败')
        this.menuList = res.data
      },
      flexMenu() {
        this.collapse = !this.collapse
        this.width = this.collapse ? '56px' : '200px'
      },
      activeMenu(url) {
        window.sessionStorage.setItem('default-active', url)
        this.defaultActive = url
      },
    },
    created() {
      this.getMenuList()
      const active = window.sessionStorage.getItem('default-active')
      if (active) {
        this.defaultActive = active
      }
    },

  }
</script>


<style lang="less">
  .index {
    height: 100%;

    .el-container {
      height: 100%;
    }

    .el-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #fff;
      background-color: #373d41;

      div {
        display: flex;
        align-items: center;

        span {
          margin-left: 15px;
        }
      }
    }

    .el-aside {
      background-color: #333744;
      transition: all ease 0.4s;
    }

    .el-main {
      background-color: #eaedf1;
    }

    .el-icon-menu::before {
      margin-right: 5px;
    }

    .flex-menu {
      color: #fff;
      text-align: center;
      opacity: .7;
      cursor: pointer;

      &:hover {
        color: orange;
      }
    }

  }


</style>
