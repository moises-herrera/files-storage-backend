import{a as u,b as W,c as X}from"./chunk-ZVK2ZGMN.js";import{b as K,c as Q}from"./chunk-RHXMEZGY.js";import{a as D}from"./chunk-QZ54JNXH.js";import{a as H,b as J}from"./chunk-42LHFYUJ.js";import{Ba as L,Da as A,Ea as V,Ga as U,Ha as n,Ka as k,La as O,Ma as G,Na as d,Pa as q,Qa as $,Ra as B,Sa as j,Ta as z,ja as R,pa as M}from"./chunk-5OWMNN74.js";import{$ as f,Db as N,Eb as h,Fb as _,Lc as T,Qb as r,R as y,Rb as I,Sa as a,a as g,bb as F,fa as v,ga as S,gb as w,j as C,ob as m,sc as P,tb as E,ua as b,xb as t,yb as e,zb as p}from"./chunk-CLJZXXJK.js";function Z(s,l){s&1&&(t(0,"p",18),r(1,"Sugerencias"),e(),t(2,"ul",19)(3,"li"),r(4,"Al menos una letra min\xFAscula"),e(),t(5,"li"),r(6,"Al menos una letra may\xFAscula"),e(),t(7,"li"),r(8,"Al menos un n\xFAmero"),e(),t(9,"li"),r(10,"M\xEDnimo 8 car\xE1cteres"),e()())}function ee(s,l){if(s&1&&(t(0,"span",14),r(1),e()),s&2){let o=_();a(),I(o.passwordErrorMessage)}}var c=class s{destroy$=new C;userService=f(D);alertService=f(V);strongPasswordRegex=u.strongPasswordPattern;mediumPasswordRegex=u.mediumPasswordPattern;settingsForm=new G({firstName:new d("",{nonNullable:!0,validators:[n.required,n.minLength(2)]}),lastName:new d("",{nonNullable:!0,validators:[n.required,n.minLength(2)]}),email:new d("",{nonNullable:!0,validators:[n.required,n.pattern(u.emailPattern)]}),password:new d("",{nonNullable:!0,validators:[n.minLength(8),n.pattern(u.mediumPasswordPattern)]})});canSave=b(!1);isSaving=b(!1);constructor(){P(()=>{this.settingsForm.patchValue(g({},this.userService.user()))})}ngOnInit(){this.settingsForm.valueChanges.pipe(y(this.destroy$)).subscribe(()=>{if(this.settingsForm.controls.password.value.trim()&&this.settingsForm.controls.password.valid)this.canSave.set(!0);else{let l=Object.keys(this.settingsForm.controls).some(o=>o!=="password"&&this.userService.user()[o]!==this.settingsForm.controls[o].value);this.canSave.set(l)}})}get password(){return this.settingsForm.get("password")}get isPasswordInvalid(){return this.password!==null&&this.password.touched&&this.password.invalid}get passwordErrorMessage(){return this.password?.hasError("required")?"El campo es requerido":this.password?.hasError("minlength")?"El campo debe tener m\xEDnimo 8 car\xE1cteres":this.password?.hasError("pattern")?"La contrase\xF1a debe contener al menos letras may\xFAsculas, min\xFAsculas y n\xFAmeros":""}saveUserInfo(){this.isSaving.set(!0),this.userService.updateUserProfile(this.settingsForm.value).subscribe({next:()=>{this.isSaving.set(!1),this.alertService.displaySuccess("Informaci\xF3n guardada correctamente")},error:()=>{this.isSaving.set(!1),this.alertService.displayError("No se pudieron guardar los cambios")}})}cancelChanges(){this.settingsForm.patchValue(g({},this.userService.user()))}ngOnDestroy(){this.destroy$.next(),this.destroy$.complete()}static \u0275fac=function(o){return new(o||s)};static \u0275cmp=F({type:s,selectors:[["app-settings"]],decls:26,vars:12,consts:[["password",""],[1,"section-container"],[1,"section-title"],[1,"min-w-[400px]","max-w-[40%]","flex","flex-col","gap-5","mx-4",3,"ngSubmit","formGroup"],[1,"form-control"],["for","firstName"],["pInputText","","id","firstName","type","text","formControlName","firstName"],["for","lastName"],["pInputText","","id","lastName","type","text","formControlName","lastName"],["for","email"],["pInputText","","id","email","type","email","formControlName","email"],["for","password"],["id","password","autocomplete","off","formControlName","password",3,"strongRegex","mediumRegex","toggleMask","weakLabel","mediumLabel","strongLabel","promptLabel"],["pTemplate","footer"],[1,"control-error"],[1,"flex","space-x-4"],["type","submit","pButton","","label","Guardar",1,"w-[200px]",3,"loading","disabled"],["type","button","pButton","","label","Cancelar","outlined","",1,"w-[200px]",3,"click","disabled"],[1,"mt-2"],[1,"pl-2","ml-2","mt-0","leading-6","list-disc"]],template:function(o,i){if(o&1){let x=N();t(0,"section",1)(1,"h1",2),r(2,"Informaci\xF3n personal"),e(),t(3,"form",3),h("ngSubmit",function(){return v(x),S(i.saveUserInfo())}),t(4,"div",4)(5,"label",5),r(6,"Nombre"),e(),p(7,"input",6),e(),t(8,"div",4)(9,"label",7),r(10,"Apellido"),e(),p(11,"input",8),e(),t(12,"div",4)(13,"label",9),r(14,"Email"),e(),p(15,"input",10),e(),t(16,"div",4)(17,"label",11),r(18,"Contrase\xF1a"),e(),t(19,"p-password",12,0),w(21,Z,11,0,"ng-template",13),e(),w(22,ee,2,1,"span",14),e(),t(23,"div",15),p(24,"button",16),t(25,"button",17),h("click",function(){return v(x),S(i.cancelChanges())}),e()()()()}o&2&&(a(3),m("formGroup",i.settingsForm),a(16),m("strongRegex",i.strongPasswordRegex)("mediumRegex",i.mediumPasswordRegex)("toggleMask",!0)("weakLabel","D\xE9bil")("mediumLabel","Medio")("strongLabel","Fuerte")("promptLabel","Ingresa una contrase\xF1a"),a(3),E(i.isPasswordInvalid?22:-1),a(2),m("loading",i.isSaving())("disabled",!i.canSave()||i.settingsForm.invalid||i.isSaving()),a(),m("disabled",i.isSaving()))},dependencies:[T,j,q,U,k,O,z,$,B,J,H,X,W,R,A,L,Q,K],encapsulation:2})};var Ie=[{path:"",title:`${M.appName} - Configuraci\xF3n`,component:c}];export{Ie as settingsRoutes};
