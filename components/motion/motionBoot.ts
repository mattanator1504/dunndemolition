// Inline in <head> before first paint. Hides [data-reveal] content only when
// motion is allowed, and un-hides everything if the app script never arrives.
// js-pin: the home hero becomes a pinned demolition sequence, decided here (not after
// the 3D loads) so the hero's height never shifts. Same gates as HeroSceneMount's canRun3D.
export const motionBootScript = `(function(){try{var d=document.documentElement;if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;d.classList.add('js-motion');var n=navigator,f=/[?&]3d\\b/.test(location.search);if(matchMedia('(min-width: 1024px)').matches&&!(n.connection&&n.connection.saveData)&&(f||((n.hardwareConcurrency||8)>4&&!(n.deviceMemory<4))))d.classList.add('js-pin');setTimeout(function(){if(!d.classList.contains('motion-ready'))d.classList.remove('js-motion','js-pin')},3500)}catch(e){}})();`;
