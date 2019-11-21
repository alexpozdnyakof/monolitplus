import '../styles/main.scss';
import '../assets/fonts/index.css';
//import './node_modules/regenerator-runtime/runtime';
import { scroll } from './scrollIntoView';
import { initMap } from './mapInit';
declare global {
    const ymaps;
}
ymaps.ready(initMap);

const logoSrc = require('./../assets/images/logo.svg');
let logoContainer: any = <HTMLImageElement>document.querySelector('#logo');
logoContainer.src = logoSrc;

const datepickerZone: HTMLElement = <HTMLElement>document.querySelector('#datepicker');
const offceSelectButton: HTMLElement = <HTMLElement>document.querySelector('#selectBranch');

offceSelectButton.addEventListener('click', ()=>{
    scroll(datepickerZone);
})


/*
window.addEventListener("load", function() {
    // use slice for supporting IE 11
    Array.prototype.slice.call(document.querySelectorAll('.menu-item')).forEach(item => {
      const target = item.getAttribute('data-id');

      item.addEventListener('click', e => {
        e.preventDefault();
        scroll(document.getElementById(target));
      });
      
    })
  
    document.getElementById('back').addEventListener('click', e => {
      e.preventDefault();
      scroll();
    });
  });
  */