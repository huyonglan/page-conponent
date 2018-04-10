#### vue分页插件 By Ryu 

	// css 样式
	@import 'base_pager';

	//js 部分
	require(['../vue/vue' '.pager'], function(Vue, modPager) {
		/*注册分页组件*/
		Vue.component('modPager', modPager);

		new Vue({
			el: '',
			data: {
				pageSize:10,
				total:100
				params:{
					page: 1
				}
			},

			components: {
				'mod-pager': modPager
			}
		});
	}

	//html
	<mod-pager :page-size="pageSize" :total="total" :params="params"></mod-pager>

