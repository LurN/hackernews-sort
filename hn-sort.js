/*
 * For: ycombinator.com/news
 *
 * Press "Shift + C" to sort list by comments
 * Press "Shift + R" to sort list by points
 * Press the previously pressed command to reverse the sort order
*/

(() => {
	if(!/ycombinator\.com(\/$|\/news|$)/.test(location.href)) return;
	let attrName = 'sortorder';
	let isReversedKey = 'isReversed';
	let lastSortKey = 'lastSort';
	let isReversed = (localStorage[isReversedKey] === 'false');
	let lastSort = localStorage[lastSortKey] | 0;
	let indexToParse;

	window.addEventListener('keypress', reorderList);

	let interval = setInterval(() => {
		let elements = Array.from(document.getElementsByClassName('athing'));
		if(elements.length < 30) return;
		clearInterval(interval);
		reorderList(lastSort);
	}, 10);

	function reorderList(e) {
		let html = '';
		let keyCode = e.keyCode || e;

		switch(keyCode) {
			case 67: // C
				indexToParse = 5;
				break;

			case 82: // R
				indexToParse = 0;
				break;

			default:
				return;
		}

		if(lastSort === keyCode) {
			setIsReversed(!isReversed);
		} else {
			setIsReversed(false);
		}

		setLastSort(keyCode);

		getAndSortElements().forEach(el => {
			html += el.outerHTML + (el.nextSibling || {}).outerHTML || '';
		});

		document.querySelector('.itemlist').firstElementChild.innerHTML = html;
	}

	function setLastSort(value) {
		lastSort = value;
		localStorage[lastSortKey] = value;
	}

	function setIsReversed(value) {
		isReversed = value;
		localStorage[isReversedKey] = value;
	}
	
	function getAndSortElements() {
		let elements = Array.from(document.getElementsByClassName('athing'));

		elements.forEach(setOrderAttribute);
		elements.sort((a, b) => {
			return isReversed
				? a.getAttribute(attrName) - b.getAttribute(attrName)
				: b.getAttribute(attrName) - a.getAttribute(attrName);
		});

		return elements;
	}

	function setOrderAttribute(el) {
		let elToParse = el.nextSibling.children[1].children[indexToParse];
		let value;

		if(elToParse) {
			value = parseInt(elToParse.innerHTML);
		}

		value = value | 0;

		el.setAttribute(attrName, value);
	}
})();
