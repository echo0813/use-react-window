/**
 * 公用常量
 * **/
const constants = {
  SQL_FOLDER_TYPE:1,//对应后台参数 belongto 1：sql
  DATASOURCE_FOLDER_TYPE:4, //对应后台参数 belongto 2数据源
  CHART_FOLDER_TYPE:2,
  DASHBOARD_FOLDER_TYPE:3,
  MODEL_MARKET_FOLDER_TYPE:5,
  CHART_MODAL_FOLDER_TYPE: 6,
  MODEL_MARKET_TIMERUN_FOLDER_TYPE: 7,
  PAGE_SIZE:12,
  TABLE_NAME_LIMIT_MSG:'表名格式错误！表名只能包含字母、数字、汉字、下划线，且首字符不能是数字或下划线，表名长度5-50个字符',
  SYNCHRONIZE_TABLE_NAME_LIMIT_MSG:'表名格式错误！表名只能包含字母、数字、汉字、下划线，且首字符不能是数字或下划线，表名长度5-50个字符',
  PWD_MSG:'密码必须包含至少8个字符, 至少1个数字, 至少1个小写字母, 至少1个大写字母, 至少要有1个特殊字符(!@#$%^&)',
  INPUT:'input',
  SELECT:'select',
  DATE:'date',
  DELETE:'delete'
}
//“表名格式错误！表名只能包含字母、数字、汉字、下划线，且首字符不能是数字或下划线，表名长度5-63个字符”
export default constants;