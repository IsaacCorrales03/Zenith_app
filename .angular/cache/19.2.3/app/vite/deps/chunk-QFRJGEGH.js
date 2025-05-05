import {
  createAnimation,
  getIonPageElement
} from "./chunk-BON5ZH5T.js";

// node_modules/@ionic/core/dist/esm-es5/md.transition-3d0d3730.js
var mdTransitionAnimation = function(a, i) {
  var n, e, t;
  var r = "40px";
  var o = "0px";
  var m = i.direction === "back";
  var s = i.enteringEl;
  var c = i.leavingEl;
  var l = getIonPageElement(s);
  var v = l.querySelector("ion-toolbar");
  var p = createAnimation();
  p.addElement(l).fill("both").beforeRemoveClass("ion-page-invisible");
  if (m) {
    p.duration(((n = i.duration) !== null && n !== void 0 ? n : 0) || 200).easing("cubic-bezier(0.47,0,0.745,0.715)");
  } else {
    p.duration(((e = i.duration) !== null && e !== void 0 ? e : 0) || 280).easing("cubic-bezier(0.36,0.66,0.04,1)").fromTo("transform", "translateY(".concat(r, ")"), "translateY(".concat(o, ")")).fromTo("opacity", 0.01, 1);
  }
  if (v) {
    var b = createAnimation();
    b.addElement(v);
    p.addAnimation(b);
  }
  if (c && m) {
    p.duration(((t = i.duration) !== null && t !== void 0 ? t : 0) || 200).easing("cubic-bezier(0.47,0,0.745,0.715)");
    var d = createAnimation();
    d.addElement(getIonPageElement(c)).onFinish(function(a2) {
      if (a2 === 1 && d.elements.length > 0) {
        d.elements[0].style.setProperty("display", "none");
      }
    }).fromTo("transform", "translateY(".concat(o, ")"), "translateY(".concat(r, ")")).fromTo("opacity", 1, 0);
    p.addAnimation(d);
  }
  return p;
};

export {
  mdTransitionAnimation
};
/*! Bundled license information:

@ionic/core/dist/esm-es5/md.transition-3d0d3730.js:
  (*!
   * (C) Ionic http://ionicframework.com - MIT License
   *)
*/
//# sourceMappingURL=chunk-QFRJGEGH.js.map
