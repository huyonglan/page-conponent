/*=============================================================================
#     FileName: pager.js
#         Desc:  Vue 分页组件  
#       Creator: Ryu
#        Email: ryu@imiku.com
#      Version: 1.0
#   LastChange: 2018-02-28 09:56:49
=============================================================================*/
define(['../vue/vue'], function(Vue) {
    var tpl = [
        '<div class="mod_pages">',
        '	<div class="pagelink">',
        '		<a href="javascript:;" class="index" :class="showFirst ? \'index\' : \'index disabled\'" title="首页" @click="goPage(1)">首页</a>',
        '		<a href="javascript:;" class="prev" :class="showFirst ? \'prev\' : \'index disabled\'" title="上一页" @click="goPage(page - 1)">上一页</a>',
        '		<a href="javascript:;" title="1" @click="goPage(1)" v-if="page > 1 && page <= displayPage">1</a>',
        '		<strong class="cur" v-if="page == 1">1</strong>',
        '		<span class="spe" v-if="showMore && showLeftMore">…</span>',

        '		<template v-for="index in indexs">',
        '			<a href="javascript:;" :title="index" @click="goPage(index)" v-if="index != page">{{ index }}</a>',
        '			<strong class="cur" v-else>{{ index }}</strong>',
        '		</template>',

        '		<span class="spe" v-if="showMore && showRightMore">…</span>',
        '		<a href="javascript:;" :title="pageCount" @click="goPage(pageCount)" v-if="page < pageCount && pageCount - page < displayPage">{{ pageCount }}</a>',
        '		<strong class="cur" v-show="pageCount > 1" v-if="page == pageCount">{{ pageCount }}</strong>',
        '		<a href="javascript:;" class="next" :class="showLast ? \'next\' : \'next disabled\'" title="下一页" @click="goPage(page + 1)">下一页</a>',
        '		<a href="javascript:;" class="last" :class="showLast ? \'next\' : \'next disabled\'"  title="末页" @click="goPage(pageCount)">末页</a>',

        '       <span class="pager_jump"><input type="text" v-model="jumpPageNum" @keyup.enter="jumpPage()" v-el:jump-input /> / {{pageCount}} 页</span>',
        '		<strong v-if="showTotal">共{{ pageCount }}页</strong>',
        '	</div>',
        '</div>'
    ].join('');

    var modPager = Vue.extend({ 
        name : 'modPager',
        template: tpl,
        /*声明 props*/
        props: {
            params: {
                type : Object,
                required : true
            },
            onJumpPage: {
                type: Function,
                default: null
            },
            isLoad: {
                type: Boolean
            },
            pageSize : {
                type : Number,
                default: function(){
                    return 20;
                }
            },
            total : {
                type : Number,
                required: true
            },
            displayPage : {
                type : Number,
                default: function(){
                    return 3;
                }
            },
            showMore: {
                type: Boolean,
                default: function(){
                    return false;
                }
            },
            showTotal: {
                type: Boolean,
                default: function(){
                    return false;
                }
            },
            showJump: {
                type: Boolean,
                default: function(){
                    return true;
                }
            },
            /*是否有路由*/
            hasRouter : {
                type : Boolean,
                default: function(){
                    return false;
                }
            }
        },
        data : function(){
            return {
                tmpJumpPageNum: ''
                // page : 2,
                // pageSize : 20,
                // total : 11100,
                // displayPage : 3
            };
        },
        computed : {
            page : function(){
                return Number(this.params.page);
            },
            /*计算显示的列表*/
            indexs : function(){
                var me = this,
                    left_index,
                    right_index,
                    arr = [];

                /*计算开始序列*/
                if(me.page > me.displayPage){
                    left_index = me.page - me.displayPage;
                }else {
                    left_index = 1;
                }

                /*计算结束序列*/
                if(me.displayPage < me.pageCount){
                    right_index = me.page + me.displayPage;

                    /*最大溢出处理*/
                    if(right_index > me.pageCount){
                        right_index = me.pageCount;
                    }
                }else{
                    right_index = me.pageCount;
                }

                /*最大值去重复*/
                if(left_index == 1){
                    left_index++;
                }
                if(right_index == me.pageCount ){
                    right_index--;
                }

                for (var i = left_index, len = right_index; i <= len; i++) {
                    arr.push(i);
                }

                return arr;
            },
            /*计算总页数*/
            pageCount : function(){
                var me = this;

                /*计算总页数*/
                return Math.ceil(me.total / me.pageSize);
            },
            showLeftMore : function(){
                var me = this;

                /*加1避免刚刚好连号*/
                if(me.page > me.displayPage + 1){
                    return true;
                }

                return false;
            },
            showRightMore : function(){
                var me = this;

                /*加1避免刚刚好连号*/
                if(me.page + me.displayPage + 1 < me.pageCount){
                    return true;
                }

                return false;
            },
            /*判断第一页*/
            showFirst : function(){
                var me = this;

                if(me.page == 1){
                    return false;
                }

                return true;
            },
            /*判断最后一页*/
            showLast : function(){
                var me = this;

                if(me.page == me.pageCount){
                    return false;
                }

                return true;
            },

            jumpPageNum: {
                get: function () {
                    return this.tmpJumpPageNum;
                },
                set: function (val) {
                    val = Number(parseInt(val, 10));

                    if(!isNaN(val)){
                        /* 判断是否超出最大值 */
                        if(val > this.pageCount){
                            val = this.pageCount;
                        } else if(val < 0){
                            val = 1;
                        }

                    } else {
                        val = '';
                    }

                    this.tmpJumpPageNum = val;
                }
            }
        },
        methods : {
            /*跳转页码*/
            goPage : function(page){
                var me = this;

                if(me.isLoad){
                    return;
                }

                /*判断页码*/
                if(page > me.pageCount){
                    page = me.pageCount;
                }else if(page <= 0){
                    page = 1;
                }

                me.params.page = Number(page);

                /* 如果设置 */
                this.onJumpPage && this.onJumpPage(page);

                // if(me.hasRouter){
                // 	/*跳转处理*/
                // 	me.$router.go({
                // 		name: me.params.name,
                // 		params: JSON.parse(JSON.stringify(me.params))
                // 	});
                // }
            },

            /* 跳转页码 */
            jumpPage: function() {
                var vm = this;

                /* 取消焦点 */
                vm.$els.jumpInput.blur();

                /* 如果不为空则跳转 */
                if(vm.jumpPageNum !== ''){
                    vm.goPage(vm.jumpPageNum);
                }
            }
        },
        watch : {
            page: function(newValue , oldValue){
                /*console.log(arguments);*/
            }
        }
    });

    return modPager;
});
