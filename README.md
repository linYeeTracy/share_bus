# 企业管理端需求
### 简介
-----------------------

### 注册、登录
---------------

| 参数 | 说明 | 
|--------------------------------------|------------------------------------|

### 定制班线
-----------


##### 班线表

| 参数 | 说明 | 类型 |
|--------------------------------------|------------------------------------|------------------------------------|
| id | 班线id | string |
| name | 班线名称 | string |
| initiator | 发起企业名称 | string |
| isShare | 是否共享 | boolean |
| loadPerson | 可载人数 | int |
| busType | 车型（定制班线时是否需要指定) | string |
| stations | 站点集合 | object[] |
| carries | 承运人集合 | object[] |
| startStation | 起始站点 | object |
| endStation | 终止站点 | object |
| startTime | 发车时间 | 是否集合待确定 |


##### 站点表

| 参数 | 说明 | 类型 |
|------|-----|------|
| id | 站点id | string |
| name | 站点名称 | string |
| stationLon | 站点经度 | float |
| stationLat | 站点维度 | float |
| locDesc | 站点描述 | string |

##### 承运人表

| 参数 | 说明 | 类型 |
|------|-----|------|
| id | 承运人id | string |
| name | 承运人名称 | string |
|         | 出生日期 | string |
|         | 性别 | string |
|         | 联系方式 | string |
|         | 所属汽旅公司 | string |
|         | 身份证号 | string |
|         | 驾驶证件信息 | string |
| carType | 承运车型 | string |
| carColor | 承运车颜色 | string |
| carPlate | 承运车牌 | string |


