<template>
    <div class="customBusline-wapper"> 
        <div class="add-new-busline" @click="confirmLine">
            <i class="addline-icon"></i>
            <p>确认添加</p>
        </div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 班线管理</el-breadcrumb-item>
                <el-breadcrumb-item>定制班线</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">
            <el-cascader
                :options="options"
                v-model="selectedOptions">
            </el-cascader>
            <el-select v-model="selectCity" placeholder="筛选地区" @change="areaChange" class="handle-select">
                <el-option key="1" label="南京市" value="南京市"></el-option>
                <el-option key="2" label="上海市" value="上海市"></el-option>     
            </el-select>
            <el-input v-model="keyword" placeholder="请输入地点" class="handle-input"></el-input>
            <el-button type="success" :disabled="driveBtn" icon="el-icon-edit" class="busline-cus" @click="driveChange">{{driveBtnText}}</el-button>
        </div>
        <!-- 地图区域 -->
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
            <baidu-map class="bm-view" 
                :center="center" 
                :zoom="zoom" 
                :location="location" 
                :scroll-wheel-zoom="scrollZoom" 
                @ready="handler">
                <bm-local-search class="search-cont"
                    :keyword="keyword" 
                    :location="location"
                    :pageCapacity="pageCapacity"
                    :autoViewport="autoViewport"></bm-local-search>
                <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>

                <bm-marker v-for="(station, index) in stations"
                    :key="index" :title="station.name" 
                    :icon="{url: '../../../static/img/station.png', size: {width: 30, height: 30}}" 
                    :position="station.pointer" 
                    :dragging="true" 
                    @dragging="dragging(index, $event)"
                    @dragend="dragend">
                    <bm-label :content="station.name" 
                        :labelStyle="{fontSize:'14px',border:'0',background:'#324157',color:'#fff',fontWeight:'500',borderRadius:'5px',padding:'2px 10px'}" 
                        :offset="{height: 32}"/>
                </bm-marker>
                
                <bm-context-menu>
                    <bm-context-menu-item :callback="createStation" text="创建站点"></bm-context-menu-item>
                </bm-context-menu>

                <bm-driving v-if="showDriving" :start="startPointer" :end="endPointer" :auto-viewport="true" location="location"></bm-driving>
                <bm-polyline :path="linePath" stroke-color="blue" :stroke-opacity="0.5" :stroke-weight="3"></bm-polyline>
            </baidu-map>
        </div>
        <!-- 编辑站点信息 -->
        <el-dialog 
            title="编辑站点信息"
            :visible.sync="editStationDialog"
            width="50%"
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
        </el-dialog>
        <!-- 新增站点 -->
        <el-dialog 
            title="新增站点"
            :visible.sync="addStationDialog"
            width="50%">
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
        <el-dialog 
            title="填写班线属性"
            :visible.sync="busLineAttrDialog"
            width="50%"
            :before-close="handleClose">
            
            <div class="form-box">
                <el-form ref="busLineAttrForm" :model="busLineAttrForm" label-width="100px">
                    <el-form-item label="是否共享">
                        <el-radio-group v-model="busLineAttrForm.isShare">
                            <el-radio :label="1">共享</el-radio>
                            <el-radio :label="2">不共享</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="最大载客人数">
                        <el-input v-model="busLineAttrForm.maxCarryNum"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="busLineAttrDialog = false">取 消</el-button>
                <el-button type="primary" @click="submitBusline">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import api from 'api/http';

    export default {
        data() {
            return {
                Bmap: null,
                selectCity: '南京市',
                location: '南京',
                center: '南京市新街口',
                zoom: 15,
                scrollZoom: true,
                keyword: '', 
                showDriving: false,  
                driveBtnText: '展示驾车路线', 
                options: [{
                    value: 'zhinan',
                    label: '指南',
                    children: [{
                        value: 'shejiyuanze',
                        label: '设计原则',
                        children: [{
                            value: 'yizhi',
                            label: '一致'
                            }, {
                            value: 'fankui',
                            label: '反馈'
                            }, {
                            value: 'xiaolv',
                            label: '效率'
                            }, {
                            value: 'kekong',
                            label: '可控'
                        }]
                    }, {
                        value: 'daohang',
                        label: '导航',
                        children: [{
                            value: 'cexiangdaohang',
                            label: '侧向导航'
                            }, {
                            value: 'dingbudaohang',
                            label: '顶部导航'
                        }]
                    }]
                }], 
                pageCapacity: 5,
                autoViewport: true,
                selectedOptions: [],                      // 地点查询关键字
                stations: [                             // 新增站点集合
                    // {
                    //     name: '1',
                    //     desc: '1',
                    //     pointer: {
                    //         lng: 118.769338,
                    //         lat: 32.048112
                    //     }
                    // }
                ],
                addStationDialog: false,                // 新增站点窗口开关
                busLineAttrDialog: false,               // 班线属性编辑窗口开关
                editStationDialog: false,               // 站点信息编辑窗口开关
                form: {                                 // 新增站点窗口表单数据
                    name: '',
                    desc: '',
                    pointer: {}
                },
                busLineAttrForm: {                      // 班线属性编辑窗口开关
                    isShare: 2,
                    maxCarryNum: ''
                },                                              
                
                currStation: {
                    name: '',
                    desc: ''
                },
                currStation_index: 0,                    // 当前操作站点索引
                showRealRoute: false,
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
            driveBtn() {
                return this.stations.length < 1;
            },
            linePath() {
                var self = this;
                var linePathArr = [];
                this.$lodash.each(self.stations, (n, i) => {
                    linePathArr.push(n.pointer);
                })
                return linePathArr;
            },
            startStation() {
                this.stations.length ? this.stations[0] : null;
            },
            startPointer() {
                
                return this.stations.length ? new this.Bmap.Point(this.stations[0].pointer.lng, this.stations[0].pointer.lat) : null;
            },
            endPointer() {
                return this.stations.length ? new this.Bmap.Point(this.stations[this.stations.length - 1].pointer.lng, this.stations[this.stations.length - 1].pointer.lat) : null;
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
                this.Bmap = BMap;
            },
            areaChange (area) {
                this.location = area;
                this.center = area;
            },
            driveChange() {
                this.showDriving = !this.showDriving;
                this.driveBtnText = '展示驾车路线' ? '关闭驾车路线' : '展示驾车路线';
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
                this.busLineAttrDialog = true;
                
            },
            submitBusline() {
                this.busLineAttrDialog = false;

                api.addBusLine({cid: 1, busline: this.station}).then((res) => {

                })
                this.$Message.info('已成功提交');
                this.showRealRoute = true;
            },
            // 站点操作
            dragend(e) {
                let currPos = e.point;
                // 后续操作待定
            },
            dragging(index, e) {
                this.stations[index].pointer = e.point;
            },
            editStation(index, row) {
                this.editStationDialog = true;
                this.currStation = row;
            },
            delStation(index) {
                this.stations.splice(this.index, 1);
            },
            createStation(e) {
                console.log(e)
                this.addStationDialog = true;
                this.form.pointer = {
                    lng: e.point.lng,
                    lat: e.point.lat
                }
            },
            handleClose(done) {
                done();
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
        },
        watch:{
        }
    }
</script>

<style scopeds>
.customBusline-wapper {
    height: 100%;
}
.handle-box{
    margin-bottom: 20px;
}
.handle-select{
    width: 120px;
    margin-right: 10px;
}
.handle-input{
    width: 300px;
    display: inline-block;
}
.map-container {
    height: calc(100% - 145px);
}
.bm-view {
  height: 100%;
  margin-right: 420px;
  box-shadow: 0 0 5px 1px #9cabb7;
}
.stations-wrapper {
    width: 400px;
    float: right;
    padding: 10px;
    padding-top: 0;
    height: 100%;
    /* box-shadow: 0 0 4px 1px #9cabb7; */
}
.search-cont {
    position: absolute;
    top: 185px;
    left: 48px;
    width: 300px;
}
.add-new-busline {
    cursor: pointer;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    color: #fff;
    text-align: center;
    position: fixed;
    top: 90px;
    right: 50px;
    background: #20a0ff;
    box-shadow: 0 0 5px 3px #20a0ff;
    z-index: 999;
}
.add-new-busline .addline-icon {
    display: inline-block;
    width: 30px;
    height: 30px;
    background: url('../../../static/img/add-line.png') no-repeat;
    background-size: 100%;
    margin: 9px auto 0;
}

.BMap_contextMenu >div {
    padding: 6px!important; 
} 
</style>