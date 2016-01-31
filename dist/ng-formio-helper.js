angular.module("ngFormioHelper",["formio","ui.router"]).filter("capitalize",[function(){return _.capitalize}]).filter("truncate",[function(){return function(e,r){return _.isNumber(r)&&(r={length:r}),_.truncate(e,r)}}]).directive("fileread",[function(){return{scope:{fileread:"="},link:function(e,r){r.bind("change",function(r){var t=new FileReader;t.onloadend=function(r){e.$apply(function(){e.fileread=jQuery(r.target.result)})},t.readAsText(r.target.files[0])})}}}]).provider("FormioResource",["$stateProvider",function(e){var r={};return{register:function(t,o,n){r[t]=t;var a=n&&n.parent?n.parent:null,s=t+"Id",i=function(e){var r={};return r[s]=e._id,r},u=function(e){return["$scope","$rootScope","$state","$stateParams","Formio","FormioUtils","$controller",e]},l=n&&n.templates?n.templates:{};e.state(t+"Index",{url:"/"+t,parent:a?a:null,params:n.params&&n.params.index,templateUrl:l.index?l.index:"views/resource/index.html",controller:u(function(e,r,a,u,l,c,m){e.currentResource={name:t,queryId:s,formUrl:o},e.$on("submissionView",function(e,r){a.go(t+".view",i(r))}),e.$on("submissionEdit",function(e,r){a.go(t+".edit",i(r))}),e.$on("submissionDelete",function(e,r){a.go(t+".delete",i(r))}),n&&n.index&&m(n.index,{$scope:e})})}).state(t+"Create",{url:"/create/"+t,parent:a?a:null,params:n.params&&n.params.create,templateUrl:l.create?l.create:"views/resource/create.html",controller:u(function(e,r,a,u,l,c,m){e.currentResource={name:t,queryId:s,formUrl:o},e.submission={data:{}};var f=!1;if(n&&n.create){var p=m(n.create,{$scope:e});f=p.handle||!1}f||e.$on("formSubmission",function(e,r){a.go(t+".view",i(r))})})}).state(t,{"abstract":!0,url:"/"+t+"/:"+s,parent:a?a:null,templateUrl:"views/resource.html",controller:u(function(e,r,i,u,l,c,m){var f=o+"/submission/"+u[s];e.currentResource=e[t]={name:t,queryId:s,formUrl:o,submissionUrl:f,formio:new l(f),resource:{},form:{},href:"/#/"+t+"/"+u[s]+"/",parent:a?e[a]:{href:"/#/",name:"home"}},e.currentResource.loadFormPromise=e.currentResource.formio.loadForm().then(function(r){e.currentResource.form=e[t].form=r}),e.currentResource.loadSubmissionPromise=e.currentResource.formio.loadSubmission().then(function(r){e.currentResource.resource=e[t].submission=r}),n&&n["abstract"]&&m(n["abstract"],{$scope:e})})}).state(t+".view",{url:"/",parent:t,params:n.params&&n.params.view,templateUrl:l.view?l.view:"views/resource/view.html",controller:u(function(e,r,t,o,a,s,i){n&&n.view&&i(n.view,{$scope:e})})}).state(t+".edit",{url:"/edit",parent:t,params:n.params&&n.params.edit,templateUrl:l.edit?l.edit:"views/resource/edit.html",controller:u(function(e,r,o,a,s,u,l){var c=!1;if(n&&n.edit){var m=l(n.edit,{$scope:e});c=m.handle||!1}c||e.$on("formSubmission",function(e,r){o.go(t+".view",i(r))})})}).state(t+".delete",{url:"/delete",parent:t,params:n.params&&n.params["delete"],templateUrl:l["delete"]?l["delete"]:"views/resource/delete.html",controller:u(function(e,r,t,o,s,i,u){var l=!1;if(n&&n["delete"]){var c=u(n["delete"],{$scope:e});l=c.handle||!1}l||e.$on("delete",function(){a&&"home"!==a?t.go(a+".view"):t.go("home",null,{reload:!0})})})})},$get:function(){return r}}}]).provider("FormioAuth",["$stateProvider",function(e){var r="auth.login",t="home",o=!1;return e.state("auth",{"abstract":!0,url:"/auth",templateUrl:"views/user/auth.html"}),{setForceAuth:function(e){o=e},setStates:function(e,o){r=e,t=o},register:function(r,o,n){e.state("auth."+r,{url:"/"+n,parent:"auth",templateUrl:"views/user/"+r.toLowerCase()+".html",controller:["$scope","$state","$rootScope",function(e,r,n){e.$on("formSubmission",function(e,a){a&&(n.setUser(a,o),r.go(t))})}]})},$get:["Formio","FormioAlerts","$rootScope","$state","$stateParams",function(e,t,n,a,s){return{init:function(){n.user={},n.isRole=function(e){return n.role===e.toLowerCase()},n.setUser=function(r,t){r?(n.user=r,localStorage.setItem("formioAppUser",angular.toJson(r))):(n.user=null,localStorage.removeItem("formioAppUser"),localStorage.removeItem("formioUser"),localStorage.removeItem("formioToken")),t?(n.role=t.toLowerCase(),localStorage.setItem("formioAppRole",t)):(n.role=null,localStorage.removeItem("formioAppRole")),n.authenticated=!!e.getToken()};var i=localStorage.getItem("formioAppUser");n.setUser(i?angular.fromJson(i):null,localStorage.getItem("formioAppRole")),n.user||e.currentUser().then(function(e){n.setUser(e,localStorage.getItem("formioRole"))});var u=function(){a.go(r),t.addAlert({type:"danger",message:"Your session has expired. Please log in again."})};n.$on("formio.sessionExpired",u),n.logout=function(){n.setUser(null,null),e.logout().then(function(){a.go(r)})["catch"](u)},n.$on("$stateChangeStart",function(t,s){if(n.authenticated=!!e.getToken(),o){if("auth"===s.name.substr(0,4))return;n.authenticated||(t.preventDefault(),a.go(r))}}),n.$on("$stateChangeSuccess",function(){n.breadcrumbs=[];for(var e in a.$current.path){var r=a.$current.path[e];r["abstract"]&&n.breadcrumbs.push({name:r.name,state:r.name+".view({"+r.name+'Id:"'+s[r.name+"Id"]+'"})'})}n.alerts=t.getAlerts()})}}}]}}]).factory("FormioAlerts",["$rootScope",function(e){var r=[];return{addAlert:function(t){e.alerts.push(t),t.element?angular.element("#form-group-"+t.element).addClass("has-error"):r.push(t)},getAlerts:function(){var e=angular.copy(r);return r.length=0,r=[],e},onError:function t(e){if(e.message)this.addAlert({type:"danger",message:e.message,element:e.path});else{var r=e.hasOwnProperty("errors")?e.errors:e.data.errors;angular.forEach(r,t.bind(this))}}}}]);