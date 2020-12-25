<template>
<div class="Project">
    <myhead myTitle="文章管理系统"  :myProject="currentProject" :myName="currentUserName" :myDepartment="currentUserDepartment"></myhead>
    <div class="Project-main">
        <router-view :key="refreshRouteKey" />
    </div>
</div>
</template>

<script>
import {
    mapState,mapMutations
} from 'vuex'
import Myhead from '@/components/Myhead.vue'
export default {
    name: 'Main',
    data() {
        return {
            currentUserName: '',
        }
    },
    components: {
        'myhead': Myhead
    },
    computed: {
        ...mapState(['refreshRouteKey','currentProject'])
    },
    created() {
        this.currentUserName = localStorage.getItem('kwmUser')
        this.currentUserDepartment = localStorage.getItem('kwmdepart')
    },
    beforeDestroy() {},
    watch: {
    },
    methods: {
         ...mapMutations(['changeCurrentProject'])
    }
}
</script>

<style>
.projectScope .ivu-tabs-nav-scroll {
    display: flex !important;
    justify-content: center !important
}

.layout-sider.ivu-layout-sider.ivu-layout-sider-collapsed .ivu-menu-submenu-title>i.ivu-icon.ivu-icon-ios-arrow-down.ivu-menu-submenu-title-icon {
    display: none !important
}

.layout-sider.ivu-layout-sider.ivu-layout-sider-collapsed .ivu-menu-submenu-title>span {
    text-align: center
}

.layout-sider.ivu-layout-sider.ivu-layout-sider-collapsed .ivu-menu-submenu-title {
    padding: 20px 5px
}

.projectScope .ivu-tabs-bar {
    border-bottom: 0px
}

.ivu-card-body {
    padding: 5px 0 !important
}

.layout-sider-menu.ivu-menu.ivu-menu-light.ivu-menu-vertical.menu-item {
    height: 100%
}

.layout {
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;

}

.layout-sider.ivu-layout-sider {
    height: calc(100vh - 60px);
    background: #fff;
    width: 150px !important;
    min-width: 0px !important;
    position: fixed;
    top: 61px;
    left: 1px;
    text-align: left !important;
    font-weight: bold;
}

.layout-sider.ivu-layout-sider.ivu-layout-sider-collapsed {
    width: 50px !important;
    min-width: 0px !important;

}

.layout-sider.ivu-layout-sider span {
    width: auto
}

.layout-sider.ivu-layout-sider span {
    width: auto
}

.menu-icon {
    transition: all .3s;
}

.rotate-icon {
    transform: rotate(-90deg);
}

.menu-item span {
    display: inline-block;
    overflow: hidden;
    width: 69px;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: bottom;
    transition: width .2s ease .2s;
}

.menu-item i {
    transform: translateX(0px);
    transition: font-size .2s ease, transform .2s ease;
    vertical-align: middle;
    font-size: 16px;
}

.collapsed-menu span {
    width: 0px;
    transition: width .2s ease;
}

.collapsed-menu i {
    transform: translateX(5px);
    transition: font-size .2s ease .2s, transform .2s ease .2s;
    vertical-align: middle;
    font-size: 22px;
}

.layout-content {
    padding-top: 40px;
    margin-left: 160px;
    margin-right: 20px
}

.layout-content.collpsed {
    margin-left: 60px;
    margin-right: 10px
}

.sidebar-item.ivu-menu-item.ivu-menu-item-active.ivu-menu-item-selected {
    color: white !important;
    background-color: #057009 !important
}

.sidebar-item.ivu-menu-item.ivu-menu-item-active.ivu-menu-item-selected a {
    color: white
}

.sidebar-item a {
    color: #212990;
    display: block;
    padding: 15px 5px
}

.ivu-poptip-body-content .sidebar-item a {
    padding: 5px
}

.ivu-menu li {
    padding: 0
}

.ivu-menu-submenu-title span {
    color: #057009
}

>>>.ivu-menu-submenu-title {
    padding: 14px 5px !important
}

.layout-sider.ivu-layout-sider {
    flex: 0 0 150px !important
}

>>>.ivu-icon.ivu-icon-ios-arrow-down.ivu-menu-submenu-title-icon {
    right: 14px
}

.menu-item span {
    overflow: visible
}

.sidebar-item.ivu-menu-item {
    padding-left: 30px !important
}

.ivu-poptip-body-content .sidebar-item.ivu-menu-item {
    padding-left: 5px !important
}

>>>li.sidebar-item.ivu-menu-item:hover {
    background-color: #057009;
    color: #fff !important;

}

>>>li.sidebar-item.ivu-menu-item:hover a {
    color: #fff !important;

}

.breadCrumb {
    margin-bottom: 10px;
    background-color: #eaeaea;
    position: fixed;
    top: 60px;
    z-index: 5;
    width: 100%
}

>>>.ivu-table th {
    background: #fff;
    border-bottom: 10px solid #e8eaec;
}

>>>.ivu-table-hidden {
    visibility: visible;
}


.Project-main .ivu-menu-submenu-title {
    padding: 14px 10px !important
}

.ivu-icon.ivu-icon-ios-arrow-down.ivu-menu-submenu-title-icon{
right: 0px
}

.layout-sider.ivu-layout-sider .ivu-menu li{
    padding: 0 
}

.layout-content{
    padding-top: 25px
}
</style>
