/*
 * For: ycombinator.com/news
 *
 * Press "Shift + C" to sort list by comments
 * Press "Shift + R" to sort list by points
 * Press the previously pressed command to reverse the sort order
*/

!function() {
	'use strict';
	let attrName = 'sortorder';
	let isReversed;
	let lastSort;
	let indexToParse;

	window.addEventListener('keypress', reorderList);

	function reorderList(e) {
		if(location.href.search(/\.com\/(news)?$/) === -1) return;

		let html = '';

		switch(e.keyCode) {
			case 67: // C
				indexToParse = 5;
				break;

			case 82: // R
				indexToParse = 0;
				break;

			default:
				return;
		}

		if(lastSort === e.keyCode) {
			isReversed = !isReversed;
		} else {
			isReversed = false;
		}

		lastSort = e.keyCode;

		getAndSortElements().forEach(el => {
			html += el.outerHTML + (el.nextSibling || {}).outerHTML || '';
		});

		document.querySelector('.itemlist').firstElementChild.innerHTML = html;
	}
	
	function getAndSortElements() {
		let elements = [].slice.call(document.getElementsByClassName('athing'));

		elements.forEach(setValue);
		elements.sort((a, b) => {
			return isReversed
				? a.getAttribute(attrName) - b.getAttribute(attrName)
				: b.getAttribute(attrName) - a.getAttribute(attrName);
		});

		return elements;
	}

	function setValue(el) {
		let elToParse = el.nextSibling.children[1].children[indexToParse];
		let value;

		if(elToParse) {
			value = parseInt(elToParse.innerHTML);
		}

		value = value || 0;

		el.setAttribute(attrName, value);
	}
}();