(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[5],{"02a3":function(t,a,o){"use strict";o("4333")},3494:function(t,a,o){"use strict";o("96c0")},4333:function(t,a,o){},"96c0":function(t,a,o){},bc13:function(t,a,o){"use strict";o.r(a);var e=function(){var t=this,a=t.$createElement,o=t._self._c||a;return o("q-page",{staticClass:"flex flex-center bg-color"},[o("div",{staticClass:"q-pa-md mainbox"},[t._l(t.countryStatistics,(function(a){return o("Indicator",t._b({key:a.type,staticClass:"main-indicator"},"Indicator",a,!1))})),o("div",{staticClass:"box"},t._l(t.globalStatistics,(function(a){return o("Indicator",t._b({key:a.type},"Indicator",a,!1))})),1)],2)])},c=[],n=function(){var t=this,a=t.$createElement,o=t._self._c||a;return o("div",{staticClass:"minibox",style:t.backgroundColor},[o("p",{staticClass:"material-icons"},[t._v(t._s(t.icon))]),o("p",[t._v(t._s(t.type))]),o("p",[t._v(t._s(t.value.toLocaleString("en")))])])},r=[],i={name:"Indicator",props:{icon:{type:String},type:{type:String},value:{type:Number},backgroundColor:{type:String}}},s=i,l=(o("3494"),o("2877")),u=Object(l["a"])(s,n,r,!1,null,"5a51ef34",null),d=u.exports,b=o("bc3a"),p=o.n(b),g={name:"HomePage",components:{Indicator:d},data(){return{countryStatistics:[],globalStatistics:[]}},mounted(){var t=0,a=0,o=0,e=0,c=0;p.a.get("https://corona-api.com/countries").then((n=>{n.data.data.forEach((n=>{0!==n.latest_data.confirmed&&(t++,a+=n.latest_data.confirmed,o+=n.latest_data.recovered,e+=n.latest_data.critical,c+=n.latest_data.deaths)})),this.countryStatistics=[{icon:"travel_explore",type:"Countries",value:t,backgroundColor:"background-color:#4a5568"}],this.globalStatistics=[{icon:"coronavirus",type:"Confirmed",value:a,backgroundColor:"background-color:#8f9fb5"},{icon:"insert_emoticon",type:"Recovered",value:o,backgroundColor:"background-color:#42b57f"},{icon:"sick",type:"Critical",value:e,backgroundColor:"background-color:#e39342"},{icon:"clear",type:"Deaths",value:c,backgroundColor:"background-color:#e55e5e"}]}))}},f=g,v=(o("02a3"),Object(l["a"])(f,e,c,!1,null,"c9b2bc62",null));a["default"]=v.exports}}]);