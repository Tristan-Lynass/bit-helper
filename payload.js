const BASE_URI = chrome.extension.getURL('');
let loaded = false;

let comments;
let ii = -1;
let currDisp;
let totalDisp;
let container;
let upBtn;
let downBtn;
let homeBtn;

function createHome() {
	const img = document.createElement('img');
	img.src = BASE_URI + 'icon/home.svg';
	img.style = 'width: 21px;';
	return img;
}

function createArrow(dir) {
	const img = document.createElement('img');
	img.src = BASE_URI + 'icon/navigate-up-arrow.svg';
	let style ='width: 21px;';
	if (dir) {
		style += 'transform: rotate(180deg);margin-top: 3px;';
	}
	img.style = style;
	return img;
}

function addButton(c, childFactory) {	
	const b = document.createElement('button');
	b.setAttribute('class', 'execute click aui-button aui-button-light sbs');
	b.setAttribute('style', 'margin: 5px !important;');
	b.setAttribute('disabled', '');
	b.appendChild(childFactory());
	c.appendChild(b);
	
	return b;
}

function prevComment() {
	if (ii === -1) { 
		ii = comments.length - 1;
	} else {
		ii > 0 ? ii -= 1 : ii = comments.length - 1;
	}
	currDisp.innerHTML = ii + 1;
	comments[ii].scrollIntoView();
	totalDisp.innerHTML = ' / ' + comments.length;
}

function nextComment() {
	if (ii === -1) { 
		ii = 0;
	} else {
		ii < comments.length - 1 ? ii += 1 : ii = 0;
	}
	currDisp.innerHTML = ii + 1;
	comments[ii].scrollIntoView();
	totalDisp.innerHTML = ' / ' + comments.length;
}

function toTop() {
	ii = -1;
	currDisp.innerHTML = '-';
	document.body.scrollIntoView();
}

function onLoaded() {
	comments = document.getElementsByClassName("comment-thread-container");
	
	if (comments !== null && comments !== undefined && comments.length > 0) {
		upBtn.removeAttribute('disabled');
		downBtn.removeAttribute('disabled');
		homeBtn.removeAttribute('disabled');
		totalDisp.innerHTML = ' / ' + comments.length;
	}
}

function constructor() {
	outerContainer = document.createElement('div');
	outerContainer.setAttribute('class', 'toolbar-container');
	
	container = document.createElement('div');
	container.setAttribute('class', 'nav-container');

	currDisp = document.createElement('span');
	currDisp.innerHTML = '-';
	totalDisp = document.createElement('span');
	totalDisp.innerHTML = ' / -';

	const positionContainer = document.createElement('div');
	positionContainer.appendChild(currDisp);
	positionContainer.appendChild(totalDisp);
	positionContainer.setAttribute('style', 'font-weight: 400;');

	upBtn = addButton(container, createArrow);
	container.appendChild(positionContainer);
	downBtn = addButton(container, () => createArrow(true));
	homeBtn = addButton(container, createHome);

	upBtn.onclick = prevComment;
	downBtn.onclick = nextComment;
	homeBtn.onclick = toTop;

	const tb = document.getElementById('pr-toolbar');
	if (!!tb) {
		outerContainer.appendChild(tb);
	}
	
	outerContainer.appendChild(container);
	document.body.appendChild(outerContainer);

	const timerId = setInterval(() => {
		let x = document.getElementById('pullrequest-diff');
		if (x !== null && x !== undefined) {
			clearInterval(timerId);
			onLoaded();
		}
	}, 300);
	loaded = true;
}

function destructor() {
	container.remove();

	comments = null;
	ii = -1;
	currDisp = null;
	totalDisp = null;
	container = null;
	loaded = false;
}

function isValidState(url) {
	return !loaded && url.match('https://bitbucket.org/.*/pull-requests/.*/diff');
}

(function() {
	console.log('BitHelper Loaded');
	chrome.runtime.onMessage.addListener((request) => {
		if (isValidState(request.url)) {
			constructor();
		} else if (loaded) {
			destructor();
		}
	});
	if (isValidState(document.location.href)) {
		constructor();
	}
}());