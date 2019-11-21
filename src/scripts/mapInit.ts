
import { geo } from './geo.data';
// import { isElementOnScreen } from './scrollIntoView';
const defaultBehavior: string[] = ['drag', 'scrollZoom', 'dblClickZoom', 'multiTouch', 'rightMouseButtonMagnifier'];
const mapPlace: HTMLDivElement = <HTMLDivElement>document.querySelector('#map');
const baloon: HTMLElement = <HTMLElement>document.querySelector('#baloon');
const closeButton: HTMLElement = <HTMLElement>document.querySelector('#baloonClose');
//const meetingSection: HTMLDivElement = <HTMLDivElement>document.querySelector('#meeting');




export function initMap() {



const map = new ymaps.Map(
	mapPlace,
	{
		behaviors: defaultBehavior,
		center:    [55.76, 37.64],
		controls:  [],
		type:      'yandex#map',
		zoom:      13
	},
	{
		autoFitToViewport: 'always'
	});
	// check on scroll
	//isElementOnScreen(meetingSection);
	/*
	function isElementOnScreen( ) {
		const elem: HTMLDivElement = <HTMLDivElement>document.querySelector('#meeting');
		const elemBounding = elem.getBoundingClientRect();
		window.onscroll = function() {
			let scrolled = window.pageYOffset || document.documentElement.scrollTop;
			if(elemBounding.top === scrolled){
			}
			//document.getElementById(elem).innerHTML = scrolled + 'px';
			console.log(scrolled);
		  }
	}
	*/

	const elem: HTMLDivElement = <HTMLDivElement>document.querySelector('#meeting');
		const elemBounding = elem.getBoundingClientRect();
		
		
		window.addEventListener('scroll', ()=> { isMapOnScreen() });
		function isMapOnScreen() {
			let scrolled = window.pageYOffset || document.documentElement.scrollTop;
			//console.log(scrolled);
			//console.log(elemBounding.top);
			//console.log(elemBounding.top - scrolled < 100);
			if("geolocation" in navigator) 
				if( elemBounding.top - scrolled < 200 ){
					navigator.geolocation.getCurrentPosition(position => {
						map.panTo([position.coords.latitude, position.coords.longitude]);
						map.setZoom(13);
						//removeScrollListener();
					})
				}
		}
		/*
		function removeScrollListener() {
			window.removeEventListener('scroll', ()=> { isMapOnScreen() })
		}*/
	// console.log(ymaps.geolocation.city);


/*
function geoLocator() {
	let userPosition: number [];
		navigator.geolocation.getCurrentPosition(position => {
			userPosition = [position.coords.latitude, position.coords.longitude];
		})
		return userPosition;
}
*/
map.behaviors.disable(defaultBehavior);

const objectManager = new ymaps.ObjectManager({
	clusterize: true,
            // ObjectManager принимает те же опции, что и кластеризатор.
	gridSize: 32,
	geoObjectOpenBalloonOnClick: true
});

map.geoObjects.add(objectManager);
objectManager.objects.options.set('iconImageHref', 'https://rosbank.ru/static/images/map-pin.svg');
objectManager.objects.options.set('iconLayout', 'default#image');
objectManager.objects.options.set('iconImageSize', [50, 64]);


objectManager.clusters.options.set('preset', 'islands#greenClusterIcons');
objectManager.add(geo);

objectManager.objects.events.add(['mouseenter', 'mouseleave'], onObjectEvent);
objectManager.objects.events.add(['click'], onObjectEvent);

let selectedObjId = null;
function onObjectEvent (e) {
	if (e.get('type') == 'click') {
		if(selectedObjId !== null){
			unsetObj(selectedObjId);
		}
		selectedObjId = e.get('objectId');
		let coords = e.get('coords');
		objectManager.objects.setObjectOptions(selectedObjId, {
			iconImageHref: 'https://rosbank.ru/static/images/map-pin-active.svg'
		});
		map.panTo(coords, {flying: true});
		toggleBaloon(selectedObjId);
	}
}

closeButton.addEventListener('click', () => {
	unsetObj(selectedObjId);
	baloon.style.visibility = `hidden`;
} )

function unsetObj(objId){
	objectManager.objects.setObjectOptions(objId, {
		iconImageHref: 'https://rosbank.ru/static/images/map-pin.svg'
	});
}


function toggleBaloon(objId?){
	if(objId){
		console.log(objId); // id для загрузки данных в балун
	}
	baloon.style.visibility = `visible`;
}
}
