<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 充值中心</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-card class="box-card assets-balance">
            <div class="assets-head">账户余额</div>
            <div class="assets-body">
                <span class="amount-wrap"><strong class="amount">{{this.balance}}</strong>元</span>
                <el-button type="primary" icon="add" class="recharge mr10" @click="recharge">充值</el-button>
            </div>
        </el-card>  
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                充值记录
                <div class="search-wrapper">
                    <el-input v-model="keyword" placeholder="筛选关键词" class="handle-input"></el-input>
                    <el-button type="primary" icon="search" @click="search">搜索</el-button>
                </div>
            </div>
            <el-table :data="staffData" border style="width: 100%" 
                max-height="800"
                ref="rechargeTable">
                <el-table-column type="selection"></el-table-column>
                <el-table-column prop="order_time" label="充值日期"></el-table-column>
                <el-table-column prop="order_num" label="充值流水号"></el-table-column>
                <el-table-column prop="order_amount" label="充值金额"></el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    @current-change ="handleCurrentChange"
                    layout="prev, pager, next"
                    :total="pageTotal">
                </el-pagination>
            </div>
        </el-card>


        <!-- 点击查看站点的弹出框 -->
        <!-- <el-dialog 
            title="余额管理"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleClose">
            <el-table :data="stationData" border style="width: 100%" ref="banlanceTable">
                <el-table-column type="selection"></el-table-column>
                <el-table-column prop="id" label="站点id" sortable></el-table-column>
                <el-table-column prop="name" label="站点名称"></el-table-column>
                <el-table-column prop="locDesc" label="站点描述"></el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog> -->
    </div>

    
</template>

<script>
    import api from 'api/http';
    
    export default {
        data() {
            return {
                company_id: 'c_1',
                rechargeData: [],
                pageNo: 1,
                pageSize: 10,
                pageTotal: 10,
                money: 100,
                keyword: '',
                balance: 27000.00,
                // 对话框
                balanceDialogVisible: false
            }
        },
        created(){
            this.getRechargeData();
        },
        mounted() {
            this.money < 200 && this.$notify({
                title: '警告',
                message: '这是一条警告的提示消息',
                type: 'warning'
            });
        },
        computed: {
            // staffData(){
            //     const self = this;
            //     // return self.tableData.filter(function(d){
            //     //     console.log(d)
            //     //     let is_del = false;
            //     //     for (let i = 0; i < self.del_list.length; i++) {
            //     //         if(d.name === self.del_list[i].name){
            //     //             is_del = true;
            //     //             break;
            //     //         }
            //     //     }
            //     //     if(!is_del){
            //     //         if(d.address.indexOf(self.select_cate) > -1 && 
            //     //             (d.name.indexOf(self.select_word) > -1 ||
            //     //             d.address.indexOf(self.select_word) > -1)
            //     //         ){
            //     //             return d;
            //     //         }
            //     //     }
            //     // })
            //     if(process.env.NODE_ENV === 'development'){
            //         self.staffUrl = './static/staff.json';
            //     };
            //     this.$axios.get(self.staffUrl, {company: this.company_id}).then((res) => {
            //         return res.data.list; 
            //     })
            // }
        },
        methods: {
            // 分页切换
            handleCurrentChange(val){
                this.cur_page = val;
                this.getRechargeData();
            },
            getRechargeData(company_id) {
                let self = this;
                api.getRechargeData({id: company_id}).then((res) => {
                    self.rechargeData = res.data.list; 
                })
            },
            search(){
                api.getRechargeData({id: company_id, keyword: this.keyword}).then((res) => {
                    self.rechargeData = res.data.list; 
                })
            },
            handleDelete(index, row) {
                this.$message.error('删除第'+(index+1)+'行');
            },
            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {});
            }
        }
    }
</script>

<style scoped>
.handle-box{
    margin-bottom: 20px;
}
.search-wrapper {
    float: right;
    margin-top: -8px;
}
.handle-input{
    width: 300px;
    display: inline-block;
}
.assets-balance {
    margin-bottom: 20px;   
    color: #666;     
}
.assets-balance .assets-head {
    margin-bottom: 20px;
    font-size: 18px;
}
.assets-balance .assets-body .amount-wrap {
    /* float: left; */
    display: inline-block;
    
}
.assets-balance .assets-body .amount {
    margin-left: 2px;
    font-size: 24px;
    
    font-weight: 400;
    margin-right: 5px;
}
.assets-balance .assets-body .recharge {
    margin-left: 20px;
    vertical-align: 6px;
}
</style>