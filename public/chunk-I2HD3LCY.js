import{f as ue,g as w,h as F,k as y}from"./chunk-TRTNSBED.js";import{a as g,b as he,c as be}from"./chunk-TEQC7FGX.js";import{b as U,c as j}from"./chunk-TV52FXP6.js";import{a as S}from"./chunk-JNHWCH6I.js";import{a as A,b as _}from"./chunk-44AI6HXG.js";import{Aa as E,Ba as N,Da as x,Ea as L,Ga as M,Ha as l,Ka as R,La as D,Ma as I,Na as u,Pa as T,Qa as P,Ra as k,Sa as z,Ta as B,b as pe,ja as ce,ka as ge,na as fe,pa as ve,qa as ye}from"./chunk-XZXG4RTI.js";import{$ as p,Db as ae,Eb as b,Fb as le,Gb as se,Hb as de,Lc as v,Qb as a,Rb as C,Sa as m,V as K,W as Q,Xb as me,bb as c,c as J,cb as Z,fa as W,fb as ee,ga as X,gb as H,ia as O,nb as te,ob as f,pb as ie,qb as re,sb as oe,tb as ne,xb as r,yb as i,zb as s}from"./chunk-CLJZXXJK.js";var V=class e{appName=ve.appName;static \u0275fac=function(o){return new(o||e)};static \u0275cmp=c({type:e,selectors:[["app-auth"]],decls:6,vars:1,consts:[[1,"auth-section"],[1,"w-full","flex","justify-start","items-center","gap-x-2"],[1,"pi","pi-cloud","text-3xl"],[1,"text-2xl","font-bold","text-primary"]],template:function(o,n){o&1&&(r(0,"section",0)(1,"header",1),s(2,"span",2),r(3,"p",3),a(4),i()(),s(5,"router-outlet"),i()),o&2&&(m(4),C(n.appName))},dependencies:[y,ue],encapsulation:2})};var Ee=["*"],Ne=({dt:e})=>`
.p-divider-horizontal {
    display: flex;
    width: 100%;
    position: relative;
    align-items: center;
    margin: ${e("divider.horizontal.margin")};
    padding: ${e("divider.horizontal.padding")};
}

.p-divider-horizontal:before {
    position: absolute;
    display: block;
    inset-block-start: 50%;
    inset-inline-start: 0;
    width: 100%;
    content: "";
    border-block-start: 1px solid ${e("divider.border.color")};
}

.p-divider-horizontal .p-divider-content {
    padding: ${e("divider.horizontal.content.padding")};
}

.p-divider-vertical {
    min-height: 100%;
    display: flex;
    position: relative;
    justify-content: center;
    margin: ${e("divider.vertical.margin")};
    padding: ${e("divider.vertical.padding")};
}

.p-divider-vertical:before {
    position: absolute;
    display: block;
    inset-block-start: 0;
    inset-inline-start: 50%;
    height: 100%;
    content: "";
    border-inline-start: 1px solid ${e("divider.border.color")};
}

.p-divider.p-divider-vertical .p-divider-content {
    padding: ${e("divider.vertical.content.padding")};
}

.p-divider-content {
    z-index: 1;
    background: ${e("divider.content.background")};
    color: ${e("divider.content.color")};
}

.p-divider-solid.p-divider-horizontal:before {
    border-block-start-style: solid;
}

.p-divider-solid.p-divider-vertical:before {
    border-inline-start-style: solid;
}

.p-divider-dashed.p-divider-horizontal:before {
    border-block-start-style: dashed;
}

.p-divider-dashed.p-divider-vertical:before {
    border-inline-start-style: dashed;
}

.p-divider-dotted.p-divider-horizontal:before {
    border-block-start-style: dotted;
}

.p-divider-dotted.p-divider-vertical:before {
    border-inline-start-style: dotted;
}

.p-divider-left:dir(rtl),
.p-divider-right:dir(rtl) {
    flex-direction: row-reverse;
}
`,xe={root:({props:e})=>({justifyContent:e.layout==="horizontal"?e.align==="center"||e.align===null?"center":e.align==="left"?"flex-start":e.align==="right"?"flex-end":null:null,alignItems:e.layout==="vertical"?e.align==="center"||e.align===null?"center":e.align==="top"?"flex-start":e.align==="bottom"?"flex-end":null:null})},Le={root:({props:e})=>["p-divider p-component","p-divider-"+e.layout,"p-divider-"+e.type,{"p-divider-left":e.layout==="horizontal"&&(!e.align||e.align==="left")},{"p-divider-center":e.layout==="horizontal"&&e.align==="center"},{"p-divider-right":e.layout==="horizontal"&&e.align==="right"},{"p-divider-top":e.layout==="vertical"&&e.align==="top"},{"p-divider-center":e.layout==="vertical"&&(!e.align||e.align==="center")},{"p-divider-bottom":e.layout==="vertical"&&e.align==="bottom"}],content:"p-divider-content"},Fe=(()=>{class e extends fe{name="divider";theme=Ne;classes=Le;inlineStyles=xe;static \u0275fac=(()=>{let o;return function(t){return(o||(o=O(e)))(t||e)}})();static \u0275prov=K({token:e,factory:e.\u0275fac})}return e})();var h=(()=>{class e extends ye{style;styleClass;layout="horizontal";type="solid";align;_componentStyle=p(Fe);get hostClass(){return this.styleClass}static \u0275fac=(()=>{let o;return function(t){return(o||(o=O(e)))(t||e)}})();static \u0275cmp=c({type:e,selectors:[["p-divider"]],hostVars:33,hostBindings:function(n,t){n&2&&(te("aria-orientation",t.layout)("data-pc-name","divider")("role","separator"),oe(t.hostClass),ie("justify-content",t.layout==="horizontal"?t.align==="center"||t.align===void 0?"center":t.align==="left"?"flex-start":t.align==="right"?"flex-end":null:null)("align-items",t.layout==="vertical"?t.align==="center"||t.align===void 0?"center":t.align==="top"?"flex-start":t.align==="bottom"?"flex-end":null:null),re("p-divider",!0)("p-component",!0)("p-divider-horizontal",t.layout==="horizontal")("p-divider-vertical",t.layout==="vertical")("p-divider-solid",t.type==="solid")("p-divider-dashed",t.type==="dashed")("p-divider-dotted",t.type==="dotted")("p-divider-left",t.layout==="horizontal"&&(!t.align||t.align==="left"))("p-divider-center",t.layout==="horizontal"&&t.align==="center"||t.layout==="vertical"&&(!t.align||t.align==="center"))("p-divider-right",t.layout==="horizontal"&&t.align==="right")("p-divider-top",t.layout==="vertical"&&t.align==="top")("p-divider-bottom",t.layout==="vertical"&&t.align==="bottom"))},inputs:{style:"style",styleClass:"styleClass",layout:"layout",type:"type",align:"align"},features:[me([Fe]),ee],ngContentSelectors:Ee,decls:2,vars:0,consts:[[1,"p-divider-content"]],template:function(n,t){n&1&&(se(),r(0,"div",0),de(1),i())},dependencies:[v,ge],encapsulation:2,changeDetection:0})}return e})(),G=(()=>{class e{static \u0275fac=function(n){return new(n||e)};static \u0275mod=Z({type:e});static \u0275inj=Q({imports:[h]})}return e})();var $=class e{userService=p(S);alertService=p(L);router=p(w);loginForm=new I({email:new u("",{nonNullable:!0,validators:[l.required,l.pattern(g.emailPattern)]}),password:new u("",{nonNullable:!0,validators:[l.required]})});isLoading=!1;loginUser(){this.isLoading=!0,this.userService.loginUser(this.loginForm.value).subscribe({next:()=>{this.isLoading=!1,this.router.navigateByUrl("/home",{replaceUrl:!0})},error:d=>{this.isLoading=!1;let o=d instanceof pe?d.status:0;this.alertService.displayError(o===400?"Usuario o contrase\xF1a incorrectos. Intente nuevamente.":"Error de conexi\xF3n. Intente nuevamente m\xE1s tarde.")}})}static \u0275fac=function(o){return new(o||e)};static \u0275cmp=c({type:e,selectors:[["app-login"]],decls:21,vars:3,consts:[[1,"auth-container"],[1,"auth-card"],[1,"auth-form",3,"ngSubmit","formGroup"],[1,"form-title"],[1,"form-control"],["for","email"],["pInputText","","id","email","type","email","formControlName","email"],["for","password"],["pInputText","","id","password","type","password","formControlName","password"],["pButton","","type","submit",1,"w-full","mt-2",3,"disabled","loading"],["pButtonLabel",""],[1,"my-3"],[1,"text-center"],["routerLink","/auth/register",1,"link"]],template:function(o,n){o&1&&(r(0,"section",0)(1,"section",1)(2,"form",2),b("ngSubmit",function(){return n.loginUser()}),r(3,"h2",3),a(4,"Iniciar sesi\xF3n"),i(),r(5,"div",4)(6,"label",5),a(7,"Email"),i(),s(8,"input",6),i(),r(9,"div",4)(10,"label",7),a(11,"Contrase\xF1a"),i(),s(12,"input",8),i(),r(13,"button",9)(14,"span",10),a(15,"Iniciar sesi\xF3n"),i()(),s(16,"p-divider",11),r(17,"p",12),a(18," \xBFNo tienes una cuenta? "),r(19,"a",13),a(20,"Reg\xEDstrate"),i()()()()()),o&2&&(m(2),f("formGroup",n.loginForm),m(11),f("disabled",n.loginForm.invalid||n.isLoading)("loading",n.isLoading))},dependencies:[v,y,F,z,T,M,R,D,B,P,k,_,A,x,N,E,G,h,j,U],encapsulation:2})};function Te(e,d){e&1&&(r(0,"p",23),a(1,"Sugerencias"),i(),r(2,"ul",24)(3,"li"),a(4,"Al menos una letra min\xFAscula"),i(),r(5,"li"),a(6,"Al menos una letra may\xFAscula"),i(),r(7,"li"),a(8,"Al menos un n\xFAmero"),i(),r(9,"li"),a(10,"M\xEDnimo 8 car\xE1cteres"),i()())}function Pe(e,d){if(e&1&&(r(0,"span",15),a(1),i()),e&2){let o=le();m(),C(o.passwordErrorMessage)}}var q=class e{userService=p(S);router=p(w);alertService=p(L);strongPasswordRegex=g.strongPasswordPattern;mediumPasswordRegex=g.mediumPasswordPattern;registerForm=new I({firstName:new u("",{nonNullable:!0,validators:[l.required,l.minLength(2)]}),lastName:new u("",{nonNullable:!0,validators:[l.required,l.minLength(2)]}),email:new u("",{nonNullable:!0,validators:[l.required,l.pattern(g.emailPattern)]}),password:new u("",{nonNullable:!0,validators:[l.required,l.minLength(8),l.pattern(g.mediumPasswordPattern)]}),confirmPassword:new u("",{nonNullable:!0,validators:[l.required,l.minLength(8)]})},{updateOn:"blur",validators:g.validatePasswordsMatch("password","confirmPassword")});isLoading=!1;registerUser(){this.isLoading=!0;let n=this.registerForm.value,{confirmPassword:d}=n,o=J(n,["confirmPassword"]);this.userService.registerUser(o).subscribe({next:()=>{this.isLoading=!1,this.alertService.displaySuccess("Registro exitoso"),this.router.navigateByUrl("/home",{replaceUrl:!0})},error:()=>{this.isLoading=!1,this.alertService.displayError("Error al crear la cuenta")}})}get password(){return this.registerForm.get("password")}get isPasswordInvalid(){return this.password!==null&&this.password.touched&&this.password.invalid}get passwordErrorMessage(){return this.password?.hasError("required")?"El campo es requerido":this.password?.hasError("minlength")?"El campo debe tener m\xEDnimo 8 car\xE1cteres":this.password?.hasError("pattern")?"La contrase\xF1a debe contener al menos letras may\xFAsculas, min\xFAsculas y n\xFAmeros":""}static \u0275fac=function(o){return new(o||e)};static \u0275cmp=c({type:e,selectors:[["app-register"]],decls:36,vars:11,consts:[["password",""],[1,"auth-container"],[1,"auth-card"],[1,"auth-form",3,"ngSubmit","formGroup"],[1,"form-title"],[1,"form-control"],["for","firstName"],["pInputText","","id","firstName","type","text","formControlName","firstName"],["for","lastName"],["pInputText","","id","lastName","type","text","formControlName","lastName"],["for","email"],["pInputText","","id","email","type","email","formControlName","email"],["for","password"],["id","password","autocomplete","off","formControlName","password",3,"strongRegex","mediumRegex","toggleMask","weakLabel","mediumLabel","strongLabel","promptLabel"],["pTemplate","footer"],[1,"control-error"],["for","confirmPassword"],["pInputText","","id","confirmPassword","type","password","formControlName","confirmPassword","autocomplete","off"],["pButton","","type","submit",1,"w-full","mt-2",3,"disabled","loading"],["pButtonLabel",""],[1,"my-3"],[1,"text-center"],["routerLink","/auth/login",1,"link"],[1,"mt-2"],[1,"pl-2","ml-2","mt-0","leading-6","list-disc"]],template:function(o,n){if(o&1){let t=ae();r(0,"section",1)(1,"section",2)(2,"form",3),b("ngSubmit",function(){return W(t),X(n.registerUser())}),r(3,"h2",4),a(4,"Registrarse"),i(),r(5,"div",5)(6,"label",6),a(7,"Nombre"),i(),s(8,"input",7),i(),r(9,"div",5)(10,"label",8),a(11,"Apellido"),i(),s(12,"input",9),i(),r(13,"div",5)(14,"label",10),a(15,"Email"),i(),s(16,"input",11),i(),r(17,"div",5)(18,"label",12),a(19,"Contrase\xF1a"),i(),r(20,"p-password",13,0),H(22,Te,11,0,"ng-template",14),i(),H(23,Pe,2,1,"span",15),i(),r(24,"div",5)(25,"label",16),a(26,"Confirmar contrase\xF1a"),i(),s(27,"input",17),i(),r(28,"button",18)(29,"span",19),a(30,"Registrarse"),i()(),s(31,"p-divider",20),r(32,"p",21),a(33," \xBFYa tienes una cuenta? "),r(34,"a",22),a(35,"Inicia sesi\xF3n"),i()()()()()}o&2&&(m(2),f("formGroup",n.registerForm),m(18),f("strongRegex",n.strongPasswordRegex)("mediumRegex",n.mediumPasswordRegex)("toggleMask",!0)("weakLabel","D\xE9bil")("mediumLabel","Medio")("strongLabel","Fuerte")("promptLabel","Ingresa una contrase\xF1a"),m(3),ne(n.isPasswordInvalid?23:-1),m(5),f("disabled",n.registerForm.invalid||n.isLoading)("loading",n.isLoading))},dependencies:[v,y,F,z,T,M,R,D,B,P,k,_,A,be,he,ce,x,N,E,G,h,j,U],encapsulation:2})};var Tt=[{path:"",component:V,children:[{path:"login",component:$},{path:"register",component:q},{path:"**",redirectTo:"login"}]}];export{Tt as authRoutes};
