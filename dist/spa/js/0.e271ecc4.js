(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[0],{"713b":function(t,e,n){"use strict";n.r(e);var a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("q-layout",{attrs:{view:"lHh Lpr lFf"}},[n("q-header",{attrs:{elevated:""}},[n("q-toolbar",{staticClass:"bg-scarlet"},[n("q-btn",{attrs:{flat:"",dense:"",round:"",icon:"menu","aria-label":"Menu"},on:{click:function(e){t.leftDrawerOpen=!t.leftDrawerOpen}}}),n("q-toolbar-title",[t._v("Covid-19 Statistics")])],1)],1),n("q-drawer",{attrs:{"show-if-above":"",bordered:"","content-style":{backgroundColor:"#b6cdbd"}},model:{value:t.leftDrawerOpen,callback:function(e){t.leftDrawerOpen=e},expression:"leftDrawerOpen"}},[n("q-list",[n("q-item-label",{staticClass:"text-grey-8",attrs:{header:""}},[t._v(" Menu ")]),t._l(t.menuLinks,(function(e){return n("Menu",t._b({key:e.title},"Menu",e,!1))}))],2)],1),n("q-page-container",[n("router-view")],1)],1)},i=[],o=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("q-item",{attrs:{clickable:"",to:t.to}},[t.icon?n("q-item-section",{attrs:{avatar:""}},[n("q-icon",{attrs:{name:t.icon}})],1):t._e(),n("q-item-section",[n("q-item-label",[t._v(t._s(t.title))]),n("q-item-label",{attrs:{caption:""}},[t._v(t._s(t.caption))])],1)],1)},r=[],l={name:"Menu",props:{title:{type:String,required:!0},caption:{type:String,default:""},to:{type:String,default:"#"},icon:{type:String,default:""}}},c=l,s=n("2877"),u=Object(s["a"])(c,o,r,!1,null,null,null),p=u.exports;const b=[{title:"Home",caption:"Globale Statistics",icon:"home",to:"/home"},{title:"Maps",caption:"Coming Soon",icon:"public",to:"/home"},{title:"Table",caption:"Statistics by country",icon:"table_rows",to:"/table"},{title:"Top 10",caption:"Highest number of cases & deaths",icon:"leaderboard",to:"/top10"},{title:"Timeline",caption:"Historical of positive, active & deaths cases ",icon:"show_chart",to:"/timeline"},{title:"About",caption:"Data Source",icon:"info",to:"/about"}];var f={name:"MainLayout",components:{Menu:p},data(){return{leftDrawerOpen:!1,menuLinks:b}}},d=f,m=(n("f03a"),Object(s["a"])(d,a,i,!1,null,"3f7405ec",null));e["default"]=m.exports},ec5b:function(t,e,n){},f03a:function(t,e,n){"use strict";n("ec5b")}}]);