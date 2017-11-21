<template>
    <div> 
        <div class="add-new-busline" @click="confirmLine">
            确认添加
        </div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 班线管理</el-breadcrumb-item>
                <el-breadcrumb-item>定制班线</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">
            <el-select v-model="select_province" placeholder="筛选地区" @change="areaChange" class="handle-select mr10">
                <el-option key="1" label="南京市" value="南京市"></el-option>
                <el-option key="2" label="上海市" value="上海市"></el-option>     
            </el-select>
            <el-input v-model="keyword" placeholder="筛选关键词" class="handle-input mr10"></el-input>
            <el-button type="primary" icon="search" @click="search">搜索</el-button>
            
        </div>
        <div class="map-container">
            <div class="stations-wrapper">
                <div style="">
                    <el-table :data="stations" border style="width: 100%" ref="stationtable">
                        <el-table-column prop="name" label="站点名称">
                        </el-table-column>
                        <el-table-column prop="desc" label="站点备注">
                        </el-table-column>
                        <el-table-column label="操作" width="180">
                            <template slot-scope="scope">
                                <el-button size="small"
                                        @click="editStation(scope.$index, scope.row)">编辑</el-button>
                                <el-button size="small" type="danger"
                                        @click="delStation(scope.$index, scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <baidu-map class="bm-view" :center="center" :zoom="zoom" :location="location" :scroll-wheel-zoom="scrollZoom" @ready="handler">
                <bm-local-search class="search-cont"
                    :keyword="keyword" 
                    :auto-viewport="true" 
                    :location="location" 
                    @markersset="markersset"
                    @infohtmlset="infohtmlset"
                    @resultshtmlset="resultshtmlset"
                    @searchcomplete="searchcomplete"></bm-local-search>
                <bm-scale anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-scale>
                <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>

                <bm-marker v-for="(station, index) in stations" 
                    :key="index" :title="station.name" 
                    :icon="{url: './../../assets/station.png', size: {width: 30, height: 30}}" 
                    :position="station.pointer" 
                    :dragging="true" 
                    @dragging="dragging(index, $event)"
                    @dragend="dragend">
                    <bm-label :content="station.name" :labelStyle="{color: 'red', fontSize : '18px'}" :offset="{width: -35, height: 30}"/>
                    <!-- <bm-context-menu>
                        <bm-context-menu-item :callback="editStation(index)" text="编辑站点"></bm-context-menu-item>
                        <bm-context-menu-item :callback="delStation(index)" text="删除站点"></bm-context-menu-item>
                    </bm-context-menu> -->
                </bm-marker>
                 <bm-polyline :path="linePath" stroke-color="blue" :stroke-opacity="0.5" :stroke-weight="2"></bm-polyline>
                <bm-context-menu>
                    <bm-context-menu-item :callback="createStation" text="在此处创建站点"></bm-context-menu-item>
                </bm-context-menu>
                <!-- <bm-driving start="{lng:118.763733,lat:32.058028}" end="{lng:118.819212, lat:32.058824}" :auto-viewport="true" location="南京"></bm-driving> -->
                <!-- <bm-driving v-if="stations.length" start="startStation.name" end="endStation.name" :auto-viewport="true" location="location"></bm-driving> -->
            </baidu-map>
        </div>
        <!-- 编辑站点信息 -->
        <!-- <el-dialog 
            title="编辑站点信息"
            :visible.sync="editStationDialog"
            width="20%"
            :before-close="handleClose">
            <div class="form-box">
                <el-form ref="stationEditForm" :model="currStation" label-width="100px">
                    <el-form-item label="站点名称">
                        <el-input v-model="currStation.name"></el-input>
                    </el-form-item>
                    <el-form-item label="站点描述">
                        <el-input v-model="currStation.desc"></el-input>
                    </el-form-item>
                </el-form>
            </div>

            <span slot="footer" class="dialog-footer">
                <el-button @click="editStationDialog = false">取 消</el-button>
                <el-button type="primary" @click="editStationDialog = false">确 定</el-button>
            </span>
        </el-dialog> -->
        <!-- 新增站点 -->
        <el-dialog 
            title="新增站点"
            :visible.sync="addStationDialog"
            width="30%">
            <div class="form-box">
                <el-form ref="form" :model="form" label-width="80px">
                    <el-form-item label="站点名称">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="站点描述">
                        <el-input v-model="form.desc"></el-input>
                    </el-form-item>
                    <el-form-item label="站点经度">
                        <el-input v-model="form.pointer.lng"></el-input>
                    </el-form-item>
                    <el-form-item label="站点维度">
                        <el-input v-model="form.pointer.lat"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addStationDialog = false">取 消</el-button>
                <el-button type="primary" @click="addStation">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 填写班线属性 -->
        <!-- <el-dialog 
            title="填写班线属性"
            :visible.sync="busLineAttrDialog"
            width="30%"
            :before-close="handleClose">
            
            <div class="form-box">
                <el-form ref="busLineAttrForm" :model="busLineAttrForm" label-width="100px">
                    <el-form-item label="是否共享">
                        <el-input v-model="busLineAttrForm.isShare"></el-input>
                    </el-form-item>
                    <el-form-item label="最大载客人数">
                        <el-input v-model="busLineAttrForm.maxCarryNum"></el-input>
                    </el-form-item>
                </el-form>
            </div>

            <span slot="footer" class="dialog-footer">
                <el-button @click="busLineAttrDialog = false">取 消</el-button>
            </span>
        </el-dialog> -->
    </div>
</template>

<script>
    import img_station from "../../assets/station.png";

    export default {
        data() {
            return {
                select_province: '南京市',
                location: '南京',
                center: '南京市新街口',
                zoom: 15,
                url: './static/vuetable.json',
                tableData: [],
                cur_page: 1,
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                del_list: [],
                is_search: false,
                show_custom: false,
                stations: [],
 
                addStationDialog: false,
                
                scrollZoom: true,
                
                keyword: '',

                form: {
                    name: '',
                    desc: '',
                    pointer: {}
                },
                // 班线属性编辑弹窗
                busLineAttrDialog: false,
                busLineAttrForm: {
                    isShare: '',
                    maxCarryNum: ''
                },
                // 站点信息编辑
                editStationDialog: false,
                currStation: {
                    name: '',
                    desc: ''
                },
                currStation_index: 0
            }
        },
        created(){
            this.getData();
        },
        computed: {
            data(){
                const self = this;
                return self.tableData.filter(function(d){
                    let is_del = false;
                    for (let i = 0; i < self.del_list.length; i++) {
                        if(d.name === self.del_list[i].name){
                            is_del = true;
                            break;
                        }
                    }
                    if(!is_del){
                        if(d.address.indexOf(self.select_cate) > -1 && 
                            (d.name.indexOf(self.select_word) > -1 ||
                            d.address.indexOf(self.select_word) > -1)
                        ){
                            return d;
                        }
                    }
                })
            },
            linePath() {
                var self = this;
                var linePathArr = [];
                this.$lodash.each(self.stations, (n, i) => {
                    linePathArr.push(n.pointer);
                })
                console.log(linePathArr)
                return linePathArr;
            },
            startStation() {
                this.stations.length ? this.stations[0] : null;
            },
            endStation() {
                this.stations.length ? this.stations[this.stations - 1] : null;
            }
        },
        methods: {
             // 地图相关
            handler ({BMap, map}) {
                this.location = this.location;
                this.center = this.center;
                this.zoom = 15;
            },
            areaChange (area) {
                this.location = area;
                this.center = area;
            },
            addStation() {
                let station = {
                    name: this.$refs.form.model.name,
                    desc: this.$refs.form.model.desc,
                    pointer: {
                        lng: this.$refs.form.model.pointer.lng,
                        lat: this.$refs.form.model.pointer.lat,
                    }
                };
                this.stations.push(station);
                this.addStationDialog = false;
            },
            handleCurrentChange(val){
                this.cur_page = val;
                this.getData();
            },

            // 站点拖拽事件
            dragging(index, e) {
                console.log(e)
                this.stations[index].pointer = e.point;
            },
            getData(){
                // let self = this;
                // if(process.env.NODE_ENV === 'development'){
                //     self.url = '/ms/table/list';
                // };
                // self.$axios.post(self.url, {page:self.cur_page}).then((res) => {
                //     self.tableData = res.data.list;
                // })
            },
            search(){
                this.is_search = true;
            },
            // 确认班线
            confirmLine() {
                this.busLineAttr = true;
            },
            formatter(row, column) {
                return row.address;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            // 编辑站点信息
            editStation(index, row) {
                this.$message('编辑第'+(index+1)+'行');
            },
            delStation(index, row) {
                this.$message.error('删除第'+(index+1)+'行');
            },
            delAll(){
                const self = this,
                    length = self.multipleSelection.length;
                let str = '';
                self.del_list = self.del_list.concat(self.multipleSelection);
                for (let i = 0; i < length; i++) {
                    str += self.multipleSelection[i].name + ' ';
                }
                self.$message.error('删除了'+str);
                self.multipleSelection = [];
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
           
            infoWindowClose () {
                this.show = false
            },
            infoWindowOpen () {
                this.show = true
            },
            markersset(e) {
                var self = this;
                // for(let i =0;i<e.length;i++){
                // $(e[i].marker.U).click(function(){
                //     self.position.lng=e[i].point.lng;
                //     self.position.lat=e[i].point.lat;
                //     $('#bdcoordval').val(self.position.lng+","+self.position.lat);
                // });
                // }
            },
            infohtmlset(e) {
                e.marker.Cb.content = '嘻嘻';                
            },
            resultshtmlset() {

            },
            searchcomplete() {

            },
            createStation(e) {
                this.addStationDialog = true;
                this.form.pointer = {
                    lng: e.point.lng,
                    lat: e.point.lat
                }
            },
            dragend(e) {
                let currPos = e.point;
            },
            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {});
            },
            onSubmit() {
                this.$message.success('提交成功！');
            },
            addStation() {
                let station = {
                    name: this.$refs.form.model.name,
                    desc: this.$refs.form.model.desc,
                    pointer: {
                        lng: this.$refs.form.model.pointer.lng,
                        lat: this.$refs.form.model.pointer.lat,
                    }
                };
                this.stations.push(station);
                this.addStationDialog = false;
            },
            // editStation(index) {
            //     this.editStationDialog = true;
            //     this.currStation_index = index;
            //     this.currStation = this.stations[index];
            // },
            delStation(index) {
                this.stations.splice(this.index, 1);
            },

        },
        watch:{
            // linePath() {
            //     var self = this;
            //     var linePathArr = [];
            //     this.$lodash.each(self.stations, (n, i) => {
            //         linePathArr.push(n.pointer);
            //     })
            //     console.log(linePathArr)
            //     return linePathArr;
            // },
        }
    }
</script>

<style scoped>

.handle-box{
    margin-bottom: 20px;
}
.handle-select{
    width: 120px;
}
.handle-input{
    width: 300px;
    display: inline-block;
}
.bm-view {
  height: 600px;
  margin-right: 420px;
  box-shadow: 0 0 10px 3px #9cabb7;
}
.stations-wrapper {
    width: 400px;
    float: right;
    padding: 10px;
    padding-top: 0;
    height: 100%;
}
.search-cont {
    position: absolute;
    top: 140px;
    left: 48px;
    width: 270px;
}
.add-new-busline {
    cursor: pointer;
    width: 80px;
    height: 80px;
    line-height: 80px;
    border-radius: 50%;
    color: #fff;
    text-align: center;
    position: fixed;
    top: 90px;
    right: 50px;
    background: #20a0ff;
}
/* // .BMap_contextMenu {
//     >div {
//         padding: 6px!important;
//         &:hover {
//             background: rgb(32, 160, 255);
//         }
//     }  
// } */
</style>