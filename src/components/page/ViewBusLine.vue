<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 班线管理</el-breadcrumb-item>
                <el-breadcrumb-item>查看班线</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">
            <el-button type="primary" icon="plus" class="busline-cus" @click="cusBusLine">定制班线</el-button>
            <el-button type="primary" icon="delete" class="busline-del" @click="delBusLine">删除班线</el-button>
            <el-input v-model="queryBusline" placeholder="请输入要查询的班线" class="handle-input"></el-input>
            <el-button type="primary" icon="search" @click="searchBusLine">搜索</el-button>
        </div>
        <el-table style="width: 100%"
                :data="data" 
                v-loading="tBuslineLoading" 
                border  
                max-height="800"
                ref="tBusline" 
                @selection-change="handleSelectionChange">
            <el-table-column type="selection"></el-table-column>
            <el-table-column prop="id" label="班线id" sortable></el-table-column>
            <el-table-column prop="name" label="班线名称"></el-table-column>
            <el-table-column prop="carries" label="承运人"></el-table-column>
            <el-table-column prop="carriesContact" label="承运人联系方式" sortable></el-table-column>
            <el-table-column prop="busType" label="车型/颜色"></el-table-column>
            <el-table-column prop="startTime" label="发车时间"></el-table-column>
            <el-table-column prop="startStation" label="起始站点" sortable></el-table-column>
            <el-table-column prop="endStation" label="终止站点"></el-table-column>
            <el-table-column prop="stationNum" label="站点总数"></el-table-column>

            <el-table-column label="站点" fixed="right">
                <template slot-scope="scope">
                    <el-button type="primary" size="small" @click="checkStations(scope.$index, scope.row, scope.store)">查看站点信息</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
                    @current-change ="handleCurrentChange"
                    layout="prev, pager, next"
                    :total="pageTotal">
            </el-pagination>
        </div>

        <!-- 点击查看站点的弹出框 -->
        <el-dialog 
            title="查看站点"
            :visible.sync="stationDialogDis"
            width="50%"
            :before-close="handleClose">
            <el-table :data="stationData" border style="width: 100%" ref="stationTable2">
                <!-- <el-table-column type="selection"></el-table-column> -->
                <el-table-column prop="id" label="站点id" sortable></el-table-column>
                <el-table-column prop="name" label="站点名称"></el-table-column>
                <el-table-column prop="locDesc" label="站点描述"></el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button @click="stationDialogDis = false">取 消</el-button>
                <el-button type="primary" @click="stationDialogDis = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>

    
</template>

<script>
    import api from 'api/http';

    export default {
        data() {
            return {
                buslineData: [],            // 班线列表数据
                stationData: [],            // 站点信息数据
                queryBusline: '',           // 班线查询关键字
                pageNo: 1,
                pageSize: 10,
                pageTotal: 10,
                selectedLines: [],          // 已选班线集合
                del_list: [],               // 已删除班线集合
                tBuslineLoading: true,      // 班线列表加载loading
                stationDialogDis: false     // 站点弹窗标记
            }
        },
        created(){
            this.getData();
        },
        computed: {
            data(){
                const self = this;
                // 执行相关过滤
                return self.buslineData;
            }
        },
        methods: {
            handleCurrentChange(val){
                this.pageNo = val;
                this.getData();
            },
            getData(){
                let self = this;
                // if(process.env.NODE_ENV === 'development'){
                //     // self.url = '/ms/busline';
                //     self.lineUrl = './static/linetable.json';
                // };
                api.getBusLine({company_id: 1, page:self.pageNo, pageSize: self.pageSize}).then((res) => {
                    self.buslineData = res.data.list;
                    this.tBuslineLoading = false;
                })
            },
            getStationData(line_id) {
                let self = this;
                if(process.env.NODE_ENV === 'development'){
                    self.stationUrl = './static/stationtable.json';
                };
                this.$axios.get(self.stationUrl, {id: line_id}).then((res) => {
                    self.stationData = res.data.list; 
                })
            },
            searchBusLine(){
                api.getBusLine({query: this.queryBusline, company_id: 1, page:this.pageNo, pageSize: this.pageSize}).then((res) => {
                    self.buslineData = res.data.list;
                    this.tBuslineLoading = false;
                })
            },
            checkStations(index, row, store) {
                this.stationDialogDis = true;
                this.getStationData(row.id);
            },
            cusBusLine() {
                this.$router.push({path:'/customBusLine'});
            },
            delBusLine() {
                const self = this,
                    length = self.selectedLines.length;
                let delLines = [];
                self.del_list = self.del_list.concat(self.selectedLines);
                for (let i = 0; i < length; i++) {
                    delLines.push(self.selectedLines[i].id);
                }
                // 重置选择列表
                self.selectedLines = [];
                api.delBusLine({line_ids: delLines}).then((delRes) => {
                    api.getBusLine({line_ids: delLines}).then((getRes) => {
                        self.buslineData = getRes.data.list;
                        self.$message.error('删除成功');
                    })
                })
            },
            handleSelectionChange(selection) {
                this.selectedLines = selection;
            },
            handleClose(done) {
                done();
            }
        }
    }
</script>

<style scoped>
.handle-box{
    margin-bottom: 20px;
}
.handle-input{
    margin-left: 20px;
    width: 300px;
    display: inline-block;
}
</style>