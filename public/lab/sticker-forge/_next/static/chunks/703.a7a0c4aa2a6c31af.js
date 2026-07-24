"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[703],{4703:(e,t,i)=>{i.r(t),i.d(t,{TouchVisualizer:()=>o});var r=i(5155),n=i(2115);function o(){let[e,t]=(0,n.useState)([]),i=(0,n.useRef)(new Map);return(0,n.useEffect)(()=>{let e=i.current,r=i=>{if("touch"!==i.pointerType)return;let r=e.get(i.pointerId);r&&clearTimeout(r),e.delete(i.pointerId),t(e=>[...e.filter(e=>e.id!==i.pointerId),{id:i.pointerId,x:i.clientX,y:i.clientY,released:!1}])},n=e=>{"touch"===e.pointerType&&t(t=>{let i=t.findIndex(t=>t.id===e.pointerId&&!t.released);if(i<0)return t;let r=[...t];return r[i]={...r[i],x:e.clientX,y:e.clientY},r})},o=i=>{if("touch"!==i.pointerType)return;t(e=>e.map(e=>e.id===i.pointerId?{...e,x:i.clientX,y:i.clientY,released:!0}:e));let r=e.get(i.pointerId);r&&clearTimeout(r),e.set(i.pointerId,setTimeout(()=>{e.delete(i.pointerId),t(e=>e.filter(e=>e.id!==i.pointerId))},360))},a={capture:!0,passive:!0};return window.addEventListener("pointerdown",r,a),window.addEventListener("pointermove",n,a),window.addEventListener("pointerup",o,a),window.addEventListener("pointercancel",o,a),()=>{for(let t of(window.removeEventListener("pointerdown",r,!0),window.removeEventListener("pointermove",n,!0),window.removeEventListener("pointerup",o,!0),window.removeEventListener("pointercancel",o,!0),e.values()))clearTimeout(t);e.clear()}},[]),(0,r.jsxs)("div",{className:"touch-visualizer-layer","aria-hidden":"true",children:[(0,r.jsx)("style",{children:`
        .touch-visualizer-layer {
          position: fixed;
          inset: 0;
          z-index: 2147483647;
          overflow: hidden;
          pointer-events: none;
          contain: strict;
        }

        .touch-visualizer-point {
          position: absolute;
          width: 46px;
          height: 46px;
          margin: -23px 0 0 -23px;
          border: 2px solid rgba(255, 255, 255, 0.98);
          border-radius: 999px;
          background: rgba(12, 14, 18, 0.2);
          box-shadow:
            0 0 0 2px rgba(255, 255, 255, 0.2),
            0 0 18px rgba(255, 255, 255, 0.72),
            inset 0 0 10px rgba(255, 255, 255, 0.28);
          transform: scale(1);
          opacity: 1;
          will-change: left, top, transform, opacity;
          animation: touch-visualizer-press 140ms ease-out;
        }

        .touch-visualizer-point[data-released="true"] {
          animation: touch-visualizer-release 360ms ease-out
            forwards;
        }

        @keyframes touch-visualizer-press {
          from {
            transform: scale(0.72);
            opacity: 0.35;
          }
        }

        @keyframes touch-visualizer-release {
          to {
            transform: scale(1.45);
            opacity: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .touch-visualizer-point,
          .touch-visualizer-point[data-released="true"] {
            animation-duration: 1ms;
          }
        }
      `}),e.map(e=>(0,r.jsx)("span",{className:"touch-visualizer-point","data-released":e.released,style:{left:e.x,top:e.y}},e.id))]})}}}]);