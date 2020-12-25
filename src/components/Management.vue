<template>
<div class="Management">
    <div class="Management-tools">
        <i-page :total="projectCount" placement="bottom" :current="page" :page-size="page_size" :page-size-opts=[10,20,30,40,50,100] size="small" show-elevator show-total show-sizer @on-change="pageChange" @on-page-size-change="page_sizeChange" />
    </div>

    <div v-if="showLoading" class="demo-spin-col" span="8">
        <i-spin fix>
            <i-icon type="ios-loading" size=18 class="demo-spin-icon-load"></i-icon>
            <div>Loading</div>
        </i-spin>
    </div>

    <div v-else class="Management-cards">
        <i-card class="Management-card" style="width:210px" v-for="(rowData,index) in projectLists" :key="index">
            <div class="Management-card-in">
                        <div class="Management-input-project-title" >
                         <router-link class="Management-input-project-title-main" :to="'/Project/'+(rowData.name)">
                            <span class="index">{{rowData.xid}}</span>
                            <i-icon type="ios-film"></i-icon>
                           {{ rowData.name }}</router-link>
                        </div>
            </div>
            <div class="middle"> {{rowData.description}}</div>

            <div class="Management-cards-footer">
                <p>创建于</p>
                <p class="Management-cards-footer-timestamp">{{rowData.create_at.split('.')[0]}}</p>
            </div>
        </i-card>
    </div>
    <i-page :total="projectCount" placement="top"  :current="page" :page-size="page_size" :page-size-opts=[10,20,30,40,50,100] size="small" show-elevator show-total show-sizer @on-change="pageChange" @on-page-size-change="page_sizeChange" />
</div>
</template>

<script>
import {
    mapState,
    mapMutations
} from 'vuex'
export default {
    name: 'Management',
    data() {
        return {
            showLoading: true,
            projectCount: 0, // 分页中项目总数
            page: 1,
            page_size: 10,
            projectLists: ''
        }
    },
    computed: {
        ...mapState(['baseurl'])
    },
    filters: {
        getName: function (value) {
            if (!value) return ''
            value = value.toString()
            return value.split('@')[0]
        }
    },
    components: {
    },
    created() {
        this.changeCurrentProject('项目管理')
        // 获取所有项目数据
        this.fetchAllProjects()

    },
    beforeDestroy() {
        this.$Message.destroy()
    },
    methods: {
        ...mapMutations(['changeCurrentProject']),
        fetchAllProjects: function () {
            let self = this
            self.showLoading = true
            let pageParams = {
                'page': self.page,
                'page_size': self.page_size
            }
            self.axios({
                    method: 'get',
                    url: self.baseurl + 'projects',
                    params: pageParams
                })
                .then(res => {
                    //console.log(res)
                    if (res.data.count !== '') {
                        self.projectCount = res.data.total
                    }
                    
                    let temp = res.data.projects
                    let begin = (self.page -1) * self.page_size
                    for (let ele in temp){
                        temp[ele]['xid'] = begin + parseInt(ele) + 1
                    }
                    self.showLoading = false
                    self.projectLists = res.data.projects
                })
                .catch(err => {
                    self.showLoading = false
                    console.log(err)
                    // self.$Message.error(err.response.data.detail);
                })
        },
        pageChange: function (pageIndex) {
            // console.log(pageIndex)
            this.page = pageIndex
            this.fetchAllProjects()
        },
        page_sizeChange: function (page_size) {
            this.page_size = page_size
            this.page = 1
            // console.log(page_size)
            this.fetchAllProjects()
        }
    },
    props: {}
}
</script>

<style scoped>
.Management {
    margin: 20px 50px
}

.Management-tools {
    display: flex;
    justify-content: center;
    align-items: center
}

.Management-tools-create {
    margin-left: 20px
}

.Management-cards {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-wrap: wrap;
    margin: 10px 5px;
    background-color: #F4F7F9;
    min-height: 500px;
    over-flow: auto
}

.Management-card {
    padding: 5px;
    margin: 10px 10px;
    min-height: 100px
}

.Management-card-in {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-content: space-around
}

.Management-cards-footer {
    display: flex;
    font-size: 0.9rem;
    justify-content: center;
    align-items: flex-end
}

.Management-cards-footer-timestamp {
    margin: auto 5px;
    font-weight: bold;
    font-style: italic
}

.Management-input-project {
    display: flex;
    align-items: center
}

.Management-input-project-title {
    width: 200px;
    font-size: 1.1rem;
    font-weight: bold;
    overflow: auto;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: left
}

.Management-input-project-title-main {
    color: #212891
}

.demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
}

.demo-spin-col {
    height: 400px;
    position: relative;

}

.ivu-form-item {
    margin-bottom: 0px
}

.middle{
    border-top: 1px solid #dbdee2;
    border-bottom: 1px solid #dbdee2;
    height: 80px;
    text-align: center;
    vertical-align: middle;
    color: #488e1d
}

.index {
    color: #212891 !important;
    margin-right: 5px
    }
</style>
