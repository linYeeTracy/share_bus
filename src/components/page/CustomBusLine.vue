<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 班线管理</el-breadcrumb-item>
                <el-breadcrumb-item>定制班线</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">
            <el-button type="primary" icon="delete" class="handle-del mr10" @click="beginCustom">开始定制</el-button>
            <el-select v-model="select_cate" placeholder="筛选省份" class="handle-select mr10">
                <el-option key="1" label="广东省" value="广东省"></el-option>
                <el-option key="2" label="湖南省" value="湖南省"></el-option>
                
            </el-select>
            <el-input v-model="keyword" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
            
        </div>
        <div class="map-container">
            <div class="custom-wrap">
                <div style="">
                    <el-table :data="stations" border style="width: 100%" ref="stationtable">
                        <el-table-column type="selection"></el-table-column>
                        <el-table-column prop="name" label="站点名称">
                        </el-table-column>
                        <el-table-column prop="desc" label="站点备注">
                        </el-table-column>

                        <el-table-column label="操作" width="180">
                            <template slot-scope="scope">
                                <el-button size="small"
                                        @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                                <el-button size="small" type="danger"
                                        @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <baidu-map class="bm-view" :center="center" :zoom="zoom" :location="location" :scroll-wheel-zoom="scrollZoom" @ready="handler">
                <bm-local-search 
                    :selectFirstResult='true'
                    :panel='false'
                    :keyword="keyword" 
                    :auto-viewport="true" 
                    :location="location" 
                    class="search-cont"
                    @markersset="markersset"
                    @infohtmlset="infohtmlset"
                    @resultshtmlset="resultshtmlset"
                    @searchcomplete="searchcomplete"></bm-local-search>
                <bm-scale anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-scale>
                <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>

                <bm-marker v-for="(station, index) in stations" :key="index" index="index" :position="station.pointer" :dragging="true" 
                    @dragend="dragend">
                    <bm-label :content="station.name" :labelStyle="{color: 'red', fontSize : '18px'}" :offset="{width: -35, height: 30}"/>
                </bm-marker>
                 <bm-polyline :path="linePath" stroke-color="blue" :stroke-opacity="0.5" :stroke-weight="2" :editing="true"></bm-polyline>
                <!-- <bm-marker :position="{lng: 116.404, lat: 39.915}" :dragging="true">
                    <bm-context-menu>
                        <bm-context-menu-item :callback="createStation" text="在此处创建站点"></bm-context-menu-item>
                    </bm-context-menu>
                </bm-marker> -->
                <bm-context-menu>
                    <bm-context-menu-item :callback="createStation" text="在此处创建站点"></bm-context-menu-item>
                </bm-context-menu>
            </baidu-map>
        </div>
        
        <el-dialog 
            title="新增站点"
            :visible.sync="newStationDialog"
            width="30%"
            :before-close="handleClose">
            
            <div class="form-box">
                <el-form ref="form" :model="form" label-width="80px">
                    <el-form-item label="站点名称">
                        <el-input :value="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="站点描述">
                        <el-input :value="form.desc"></el-input>
                    </el-form-item>
                    <el-form-item label="站点经度">
                        <el-input :value="form.pointer.lng"></el-input>
                    </el-form-item>
                    <el-form-item label="站点维度">
                        <el-input :value="form.pointer.lat"></el-input>
                    </el-form-item>
                    <el-form-item label="选择项">
                        <el-select :value="form.chooce" placeholder="请选择">
                            <el-option key="bbk" label="选项1" value="option1"></el-option>
                            <el-option key="xtc" label="选项2" value="option2"></el-option>
                            <el-option key="imoo" label="选项3" value="option3"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>

            <span slot="footer" class="dialog-footer">
                <el-button @click="newStationDialog = false">取 消</el-button>
                <el-button type="primary" @click="newStationReady">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
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
 
                newStationDialog: false,
                center: '南京市新街口',
                zoom: 15,
                scrollZoom: true,
                location: '南京',
                keyword: '',
                ak: 'WB3qq0MsfpF51nZNa296By4IXfkr71z6',
                form: {
                    name: '',
                    desc: '',
                    pointer: {}
                }
            }
        },
        created(){
            this.getData();
        },
        computed: {
            data(){
                const self = this;
                return self.tableData.filter(function(d){
                    console.log(d);
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

                console.log(self.stations)
                this.$lodash.each(self.stations, (n, i) => {
                    console.log(n, i)
                    linePathArr.push(n.pointer);
                })
                console.log(linePathArr)
                return linePathArr;
            }
        },
        methods: {
            handleCurrentChange(val){
                this.cur_page = val;
                this.getData();
            },
            getData(){
                let self = this;
                if(process.env.NODE_ENV === 'development'){
                    self.url = '/ms/table/list';
                };
                self.$axios.post(self.url, {page:self.cur_page}).then((res) => {
                    self.tableData = res.data.list;
                })
            },
            search(){
                this.is_search = true;
            },
            formatter(row, column) {
                return row.address;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            handleEdit(index, row) {
                this.$message('编辑第'+(index+1)+'行');
            },
            handleDelete(index, row) {
                this.$message.error('删除第'+(index+1)+'行');
            },
            beginCustom() {

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
            // 地图相关
            handler ({BMap, map}) {
                console.log(BMap, map)
                this.center = '南京市新街口'
                this.zoom = 15
            },
            infoWindowClose () {
                this.show = false
            },
            infoWindowOpen () {
                this.show = true
            },
            markersset(e) {
                var self = this;
                console.log(e)
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
                console.log(e.marker.Cb.content);
                
            },
            resultshtmlset() {
                console.log(arguments);
            },
            searchcomplete() {
                console.log(arguments);
            },
            createStation(e) {
                this.newStationDialog = true;
                this.form.pointer = {
                    lng: e.point.lng,
                    lat: e.point.lat
                }
            },
            dragend(e) {
                console.log(e.target)
                let currPos = e.point;
                // let getLocUrl = `/baidu-api/geocoder/v2/?callback=renderReverse&location=${currPos.lat},${currPos.lng}&output=json&pois=1&ak=${this.ak}`
                // this.$axios.get(getLocUrl).then((res) => {
                //     console.log(res)
                // })

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
            newStationReady(e) {
                let station = this.$refs.form.model;
                this.stations.push(station);
                this.$refs.form.resetFields();
                this.newStationDialog = false;

            }
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
}
.custom-wrap {
    width: 400px;
    float: right;
    padding: 10px;
    height: 100%;
}
.search-cont {
    position: absolute;
    top: 160px;
    left: 48px;
    width: 270px;
}
</style>