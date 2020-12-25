<template>
  <i-row>
    <i-col span="18">
      <i-input v-model="video_title" placeholder="请输入标题">
        <span slot="prepend">标题</span>
      </i-input>
      <br />
      <i-input v-model="video_imageUrl" placeholder="请输入封面链接">
        <span slot="prepend">封面</span>
      </i-input>
      <br />
      <i-select v-model="tags" placeholder="请选择标签" filterable multiple allow-create>
        <i-option v-for="tag in allTags" :value="tag" :key="tag">{{
          tag
        }}</i-option>
      </i-select>
      <video style="width:100%;height:700px;margin-top:8px" id="my-video"  class="video-js vjs-default-skin" controls>
      </video>
    </i-col>
    <i-col span="6">
      <i-row>
        <i-col span="24">
          <i-radioGroup v-model="status" vertical size="large">
            <i-radio label="待定" border>
              <span>待定</span>
            </i-radio>
            <i-radio label="已编辑" border>
              <span>已编辑</span>
            </i-radio>
            <i-radio label="已审核" border>
              <span>已审核</span>
            </i-radio>
            <i-radio label="废弃" border>
              <span>废弃</span>
            </i-radio>
          </i-radioGroup></i-col
        >
        <i-col span="24" style="margin-top:15px">
          <label>发布日期：</label>
          <i-datePicker
            type="date"
            placeholder="请选择发布日期"
            v-model="publish"
          ></i-datePicker>
        </i-col>
        <i-col span="24" style="margin-top:15px"
          ><i-button type="success" size="large" @click="submit"
            >提交</i-button
          ></i-col
        >
      </i-row>
    </i-col>
  </i-row>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import videojs from "video.js";
import "videojs-contrib-hls";
// import currentPath from "@/components/currentPath.vue";
export default {
  name: "videoEdit",
  data() {
    return {
      video_imageUrl: "",
      video_title: "",
      tags: "",
      allTags: [],
      status: "",
      publish: "",
      video_source_url: "",
      player: undefined
    };
  },
  computed: {
    ...mapState(["baseurl", "currentProject"]),
  },
  mounted() {
    const self = this;
    let videoId = this.$route.params.id;
    self.videoId = videoId;
    let Params = {
      idFilter: videoId,
      project: self.currentProject,
    };
    self.fetchItem(Params);
    self.getAllTags();
  },
  beforeDestroy() {
    const self = this
    try {
      self.player.dispose()
    } catch (e) {
      console.log(e)
    }
  },
  created() {
    this.changeCurrentProject(this.$route.params.project);
  },
  updated() {
    //console.log('upadated')
    //this.xmetadata = JSON.parse(JSON.stringify(this.title))
    //this.editorData = JSON.parse(JSON.stringify(this.editorData2))
  },
  methods: {
    ...mapMutations(["changeCurrentProject"]),
    fetchItem: function (getParams) {
      let self = this;
      let Params = getParams;
      self.loading = true;
      //console.log('Params',Params)
      self
        .axios({
          method: "get",
          url: self.baseurl + "videos",
          params: Params,
        })
        .then((res) => {
          let temp = res.data.data;

          self.videoData = temp[0];
          self.video_title = self.videoData.video_title;
          self.video_imageUrl = self.videoData.video_imageUrl;
          self.tags = self.videoData.tags;
          self.status = self.videoData.status;
          self.video_source_url = self.videoData.video_source_url;
          let publish = "";
          if (self.videoData.publish) {
            publish = new Date(self.videoData.publish * 1000);
          }
          self.publish = publish;
          self.loading = false;
          self.player = videojs('my-video', {
            poster:self.video_imageUrl,
            autoplay: false,
  
          })
          self.player.src([{
            type: "application/x-mpegURL",
            src: self.video_source_url
          }])
          // var playPromise = self.player.play();

          // if (playPromise !== undefined) {
          //   playPromise.then(_ => {
          //     console.log(_)
          //     // Automatic playback started!
          //     // Show playing UI.
          //   })
          //   .catch(error => {
          //     console.log(error)
          //     // Auto-play was prevented
          //     // Show paused UI.
          //   });
          // }
        })
        .catch(() => {
          self.loading = false;
          //console.log(err)
          // self.$Message.error(err.response.data.detail);
        });
    },
    getAllTags: function () {
      const self = this;
      let Params = {
        project: self.currentProject,
      };
      self
        .axios({
          method: "get",
          url: self.baseurl + "tags",
          params: Params,
        })
        .then((res) => {
          for (let ele in res.data.data) {
            self.allTags.push(res.data.data[ele]["name"]);
          }
          self.loading = false;
        })
        .catch(() => {
          self.loading = false;
          //console.log(err)
          // self.$Message.error(err.response.data.detail);
        });
    },
    submit: function () {
      const self = this;
      let publish;
      if (self.publish) {
        publish = Date.parse(self.publish) / 1000;
      }
      let params = {
        project: self.currentProject,
        video_id: self.videoId,
        detail: {
          video_title: self.video_title,
          video_imageUrl: self.video_imageUrl,
          video_source_url: self.video_source_url,
          tags: JSON.parse(JSON.stringify(self.tags)),
          status: self.status,
          publish: publish,
        },
      };
      self
        .axios({
          method: "put",
          url: self.baseurl + "videos",
          data: params,
        })
        .then(() => {
          self.$Message.success("提交成功");
        })
        .catch(() => {
          self.$Message.error("提交失败");
        });
    },
  },
};
</script>
.ck { height: 800px; }
<style scoped>
.box {
  width: 100%;
  height: 700px;
  border: 20px solid;
}
</style>
