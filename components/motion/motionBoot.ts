// Inline in <head> before first paint. Hides [data-reveal] content only when
// motion is allowed, and un-hides everything if the app script never arrives.
export const motionBootScript = `(function(){try{var d=document.documentElement;if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;d.classList.add('js-motion');setTimeout(function(){if(!d.classList.contains('motion-ready'))d.classList.remove('js-motion')},3500)}catch(e){}})();`;
