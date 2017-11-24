<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 乘车管理</el-breadcrumb-item>
                <el-breadcrumb-item>员工管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">
            <el-button type="success" icon="el-icon-edit"  @click="addStaff">增加人员</el-button>
            <el-button type="danger" :disabled="isDel" icon="el-icon-delete" class="del-staff" @click="delStaff">删除人员</el-button>
            
            <el-input placeholder="请输入人员关键字" class="handle-input"></el-input>
            <el-button type="primary" @click="search" icon="el-icon-search">搜索</el-button>
        </div>
        <!-- 人员乘车信息列表 -->
        <el-table :data="staffData" border style="width: 100%" 
            max-height="800"
            @selection-change="handleSelectionChange"
            ref="tStaff">
            <el-table-column type="selection"></el-table-column>
            <el-table-column prop="id" label="工号"></el-table-column>
            <el-table-column prop="name" label="姓名"></el-table-column>
            <el-table-column prop="department" label="部门"></el-table-column>
            <el-table-column prop="contact" label="联系方式"></el-table-column>
            <el-table-column prop="busline" label="班线"></el-table-column>
            <el-table-column prop="balance" label="余额"></el-table-column>

            <el-table-column label="操作" fixed="right">
                <template slot-scope="scope">
                    <el-button size="small" @click="manageStaffInfo(scope.$index, scope.row, scope.store)">信息管理</el-button>
                    <el-button size="small" @click="manageBalance(scope.$index, scope.row, scope.store)">余额管理</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 增加人员弹窗 -->
        <el-dialog 
            title="上传人员表"
            :visible.sync="addStaffDialog"
            width="30%"
            :before-close="handleClose">
            <el-upload
                class="upload-demo"
                drag
                action="https://jsonplaceholder.typicode.com/posts/"
                multiple>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">请上传人员excel表，支持xlsx格式，excel模板请在右侧下载</div>
            </el-upload>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addStaffDialog = false">取 消</el-button>
                <el-button type="primary" @click="addStaffDialog = false">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 余额管理 -->
        <!-- <el-dialog 
            title="余额管理"
            :visible.sync="balanceDialog"
            width="30%"
            :before-close="handleClose">
            公司账户余额：179900
            <el-form ref="balanceForm" :model="balanceForm" label-width="80px">
                <el-form-item label="发放金额">
                    <el-input v-model="balanceForm.name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="balanceDialog = false">取 消</el-button>
                <el-button type="primary" @click="balanceDialog = false">确 定</el-button>
            </span>
        </el-dialog> -->

        <!-- 员工信息修改 -->
        <!-- <el-dialog 
            title="员工信息修改"
            :visible.sync="staffDialog"
            width="30%"
            :before-close="handleClose">
            <el-form ref="form" :model="staffForm" label-width="80px">
                <el-form-item label="员工姓名">
                    <el-input v-model="staffForm.name"></el-input>
                </el-form-item>
                <el-form-item label="员工班线">
                    <el-input type="textarea" v-model="staffForm.busline"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="staffDialog = false">取 消</el-button>
                <el-button type="primary" @click="staffDialog = false">确 定</el-button>
            </span>
        </el-dialog> -->
    </div>

    
</template>

<script>
    export default {
        data() {
            return {
                staffData: [],
                pageNo: 1,
                pageSize: 10,
                pageTotal: 10,
                staffSelections: [],
                del_list: [],   
                // 对话框
                balanceDialog: false,
                staffDialog: false,
                addStaffDialog: false,
                staffForm: {},
                balanceForm: {}
            }
        },
        created(){
            this.getStaffData();
        },
        computed: {
            isDel() {
                return this.staffSelections.length ? false : true;
            }
        },
        methods: {
            handleCurrentChange(val){
                this.cur_page = val;
                this.getStaffData();
            },
            getStaffData() {
                this.$axios.get('/api/getStaff').then((res) => {
                    this.staffData = res.data.data; 
                })
            },
            search(){
                this.getStaffData();
            },
            addStaff() {
                this.addStaffDialog = true;
                // this.getStaffData();
            },
            delStaff() {
                this.$message({
                    message: '删除成功',
                    type: 'success'
                });
                const self = this,
                    length = self.staffSelections.length;
                let str = '';
                self.del_list = self.del_list.concat(self.staffSelections);
                for (let i = 0; i < length; i++) {
                    str += self.staffSelections[i].name + ' ';
                }
                self.staffSelections = [];
                this.getStaffData(); 
            },
            handleSelectionChange(val) {
                this.staffSelections = val;
            },
            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {});
            },
        }
    }
</script>

<style scoped>
.upload-demo {
    text-align: center;
}
.del-staff {
    margin-right: 15px;
}
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
</style>