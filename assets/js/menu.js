(function() {
  "use strict";
  const media=window.matchMedia("(min-width: 48rem)"),button=document.querySelector(".menu-button"),menu=document.querySelector("#mobile-menu");
  if(!button||!menu)return;
  const links=Array.from(menu.querySelectorAll("a[href]")),first=links[0],last=links.at(-1),open=()=>!menu.hidden;
  function state(value, {
    returnFocus=false,moveFocus=false
  }
  = {
  }  ) {
    menu.hidden=!value;
    button.setAttribute("aria-expanded",String(value));
    button.setAttribute("aria-label",value?"Fechar menu":"Abrir menu");
    document.body.classList.toggle("menu-open",value);
    if(value&&moveFocus)first?.focus();
    if(!value&&returnFocus)button.focus()
  }
  button.addEventListener("click",()=>state(!open(), {
    moveFocus:!open(),returnFocus:open()
  }  ));
  menu.addEventListener("click",e=> {
    if(e.target.closest("a[href]"))state(false)
  }  );
  document.addEventListener("keydown",e=> {
    if(!open())return;
    if(e.key==="Escape") {
      e.preventDefault();
      state(false, {
        returnFocus:true
      }      );
      return
    }
    if(e.key!=="Tab"||!first||!last)return;
    if(e.shiftKey) {
      if(document.activeElement===first) {
        e.preventDefault();
        button.focus()
      } else if(document.activeElement===button) {
        e.preventDefault();
        last.focus()
      }
    } else if(document.activeElement===last) {
      e.preventDefault();
      button.focus()
    } else if(document.activeElement===button) {
      e.preventDefault();
      first.focus()
    }
  }  );
  media.addEventListener("change",e=> {
    if(e.matches&&open())state(false)
  }  );
  state(false)
})();
