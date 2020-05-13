require("./index.css");
import "./index.less";
// var a = function(){
//     console.log("执行成功dddd");
// }
import ff from "@/alia-test/test.js";
console.log("ssss", ff);
import imageUrl from "./timg.jpeg";
var img = new Image();
img.src = imageUrl;
img.height = 200;
img.width = 150;
document.body.appendChild(img);
var b = [4, 6];

function a() {
  console.log("====================", "es6", b);
}
// a = () => {
//     let flag = 1;
//     if (flag == true) {
//         console.log(0)
//     }
//     console.log(88)
// }
a();
if (module.hot) {
  module.hot.accept()
}
// debugger
// console.log('-----',process.env.NODE_ENV)