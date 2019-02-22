;(function () {
	'use strict';

	/**
	 * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.
	 *
	 * @codingstandard ftlabs-jsv2
	 * @copyright The Financial Times Limited [All Rights Reserved]
	 * @license MIT License (see LICENSE.txt)
	 */

	/*jslint browser:true, node:true*/
	/*global define, Event, Node*/


	/**
	 * Instantiate fast-clicking listeners on the specified layer.
	 *
	 * @constructor
	 * @param {Element} layer The layer to listen on
	 * @param {Object} [options={}] The options to override the defaults
	 */
	function FastClick(layer, options) {
		var oldOnClick;

		options = options || {};

		/**
		 * Whether a click is currently being tracked.
		 *
		 * @type boolean
		 */
		this.trackingClick = false;


		/**
		 * Timestamp for when click tracking started.
		 *
		 * @type number
		 */
		this.trackingClickStart = 0;


		/**
		 * The element being tracked for a click.
		 *
		 * @type EventTarget
		 */
		this.targetElement = null;


		/**
		 * X-coordinate of touch start event.
		 *
		 * @type number
		 */
		this.touchStartX = 0;


		/**
		 * Y-coordinate of touch start event.
		 *
		 * @type number
		 */
		this.touchStartY = 0;


		/**
		 * ID of the last touch, retrieved from Touch.identifier.
		 *
		 * @type number
		 */
		this.lastTouchIdentifier = 0;


		/**
		 * Touchmove boundary, beyond which a click will be cancelled.
		 *
		 * @type number
		 */
		this.touchBoundary = options.touchBoundary || 10;


		/**
		 * The FastClick layer.
		 *
		 * @type Element
		 */
		this.layer = layer;

		/**
		 * The minimum time between tap(touchstart and touchend) events
		 *
		 * @type number
		 */
		this.tapDelay = options.tapDelay || 200;

		/**
		 * The maximum time for a tap
		 *
		 * @type number
		 */
		this.tapTimeout = options.tapTimeout || 700;

		if (FastClick.notNeeded(layer)) {
			return;
		}

		// Some old versions of Android don't have Function.prototype.bind
		function bind(method, context) {
			return function() { return method.apply(context, arguments); };
		}


		var methods = ['onMouse', 'onClick', 'onTouchStart', 'onTouchMove', 'onTouchEnd', 'onTouchCancel'];
		var context = this;
		for (var i = 0, l = methods.length; i < l; i++) {
			context[methods[i]] = bind(context[methods[i]], context);
		}

		// Set up event handlers as required
		if (deviceIsAndroid) {
			layer.addEventListener('mouseover', this.onMouse, true);
			layer.addEventListener('mousedown', this.onMouse, true);
			layer.addEventListener('mouseup', this.onMouse, true);
		}

		layer.addEventListener('click', this.onClick, true);
		layer.addEventListener('touchstart', this.onTouchStart, false);
		layer.addEventListener('touchmove', this.onTouchMove, false);
		layer.addEventListener('touchend', this.onTouchEnd, false);
		layer.addEventListener('touchcancel', this.onTouchCancel, false);

		// Hack is required for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
		// which is how FastClick normally stops click events bubbling to callbacks registered on the FastClick
		// layer when they are cancelled.
		if (!Event.prototype.stopImmediatePropagation) {
			layer.removeEventListener = function(type, callback, capture) {
				var rmv = Node.prototype.removeEventListener;
				if (type === 'click') {
					rmv.call(layer, type, callback.hijacked || callback, capture);
				} else {
					rmv.call(layer, type, callback, capture);
				}
			};

			layer.addEventListener = function(type, callback, capture) {
				var adv = Node.prototype.addEventListener;
				if (type === 'click') {
					adv.call(layer, type, callback.hijacked || (callback.hijacked = function(event) {
						if (!event.propagationStopped) {
							callback(event);
						}
					}), capture);
				} else {
					adv.call(layer, type, callback, capture);
				}
			};
		}

		// If a handler is already declared in the element's onclick attribute, it will be fired before
		// FastClick's onClick handler. Fix this by pulling out the user-defined handler function and
		// adding it as listener.
		if (typeof layer.onclick === 'function') {

			// Android browser on at least 3.2 requires a new reference to the function in layer.onclick
			// - the old one won't work if passed to addEventListener directly.
			oldOnClick = layer.onclick;
			layer.addEventListener('click', function(event) {
				oldOnClick(event);
			}, false);
			layer.onclick = null;
		}
	}

	/**
	* Windows Phone 8.1 fakes user agent string to look like Android and iPhone.
	*
	* @type boolean
	*/
	var deviceIsWindowsPhone = navigator.userAgent.indexOf("Windows Phone") >= 0;

	/**
	 * Android requires exceptions.
	 *
	 * @type boolean
	 */
	var deviceIsAndroid = navigator.userAgent.indexOf('Android') > 0 && !deviceIsWindowsPhone;


	/**
	 * iOS requires exceptions.
	 *
	 * @type boolean
	 */
	var deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent) && !deviceIsWindowsPhone;


	/**
	 * iOS 4 requires an exception for select elements.
	 *
	 * @type boolean
	 */
	var deviceIsIOS4 = deviceIsIOS && (/OS 4_\d(_\d)?/).test(navigator.userAgent);


	/**
	 * iOS 6.0-7.* requires the target element to be manually derived
	 *
	 * @type boolean
	 */
	var deviceIsIOSWithBadTarget = deviceIsIOS && (/OS [6-7]_\d/).test(navigator.userAgent);

	/**
	 * BlackBerry requires exceptions.
	 *
	 * @type boolean
	 */
	var deviceIsBlackBerry10 = navigator.userAgent.indexOf('BB10') > 0;

	/**
	 * Determine whether a given element requires a native click.
	 *
	 * @param {EventTarget|Element} target Target DOM element
	 * @returns {boolean} Returns true if the element needs a native click
	 */
	FastClick.prototype.needsClick = function(target) {
		switch (target.nodeName.toLowerCase()) {

		// Don't send a synthetic click to disabled inputs (issue #62)
		case 'button':
		case 'select':
		case 'textarea':
			if (target.disabled) {
				return true;
			}

			break;
		case 'input':

			// File inputs need real clicks on iOS 6 due to a browser bug (issue #68)
			if ((deviceIsIOS && target.type === 'file') || target.disabled) {
				return true;
			}

			break;
		case 'label':
		case 'iframe': // iOS8 homescreen apps can prevent events bubbling into frames
		case 'video':
			return true;
		}

		return (/\bneedsclick\b/).test(target.className);
	};


	/**
	 * Determine whether a given element requires a call to focus to simulate click into element.
	 *
	 * @param {EventTarget|Element} target Target DOM element
	 * @returns {boolean} Returns true if the element requires a call to focus to simulate native click.
	 */
	FastClick.prototype.needsFocus = function(target) {
		switch (target.nodeName.toLowerCase()) {
		case 'textarea':
			return true;
		case 'select':
			return !deviceIsAndroid;
		case 'input':
			switch (target.type) {
			case 'button':
			case 'checkbox':
			case 'file':
			case 'image':
			case 'radio':
			case 'submit':
				return false;
			}

			// No point in attempting to focus disabled inputs
			return !target.disabled && !target.readOnly;
		default:
			return (/\bneedsfocus\b/).test(target.className);
		}
	};


	/**
	 * Send a click event to the specified element.
	 *
	 * @param {EventTarget|Element} targetElement
	 * @param {Event} event
	 */
	FastClick.prototype.sendClick = function(targetElement, event) {
		var clickEvent, touch;

		// On some Android devices activeElement needs to be blurred otherwise the synthetic click will have no effect (#24)
		if (document.activeElement && document.activeElement !== targetElement) {
			document.activeElement.blur();
		}

		touch = event.changedTouches[0];

		// Synthesise a click event, with an extra attribute so it can be tracked
		clickEvent = document.createEvent('MouseEvents');
		clickEvent.initMouseEvent(this.determineEventType(targetElement), true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
		clickEvent.forwardedTouchEvent = true;
		targetElement.dispatchEvent(clickEvent);
	};

	FastClick.prototype.determineEventType = function(targetElement) {

		//Issue #159: Android Chrome Select Box does not open with a synthetic click event
		if (deviceIsAndroid && targetElement.tagName.toLowerCase() === 'select') {
			return 'mousedown';
		}

		return 'click';
	};


	/**
	 * @param {EventTarget|Element} targetElement
	 */
	FastClick.prototype.focus = function(targetElement) {
		var length;

		// Issue #160: on iOS 7, some input elements (e.g. date datetime month) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.
		if (deviceIsIOS && targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time' && targetElement.type !== 'month') {
			length = targetElement.value.length;
			targetElement.focus();
			targetElement.setSelectionRange(length, length);
		} else {
			targetElement.focus();
		}
	};


	/**
	 * Check whether the given target element is a child of a scrollable layer and if so, set a flag on it.
	 *
	 * @param {EventTarget|Element} targetElement
	 */
	FastClick.prototype.updateScrollParent = function(targetElement) {
		var scrollParent, parentElement;

		scrollParent = targetElement.fastClickScrollParent;

		// Attempt to discover whether the target element is contained within a scrollable layer. Re-check if the
		// target element was moved to another parent.
		if (!scrollParent || !scrollParent.contains(targetElement)) {
			parentElement = targetElement;
			do {
				if (parentElement.scrollHeight > parentElement.offsetHeight) {
					scrollParent = parentElement;
					targetElement.fastClickScrollParent = parentElement;
					break;
				}

				parentElement = parentElement.parentElement;
			} while (parentElement);
		}

		// Always update the scroll top tracker if possible.
		if (scrollParent) {
			scrollParent.fastClickLastScrollTop = scrollParent.scrollTop;
		}
	};


	/**
	 * @param {EventTarget} targetElement
	 * @returns {Element|EventTarget}
	 */
	FastClick.prototype.getTargetElementFromEventTarget = function(eventTarget) {

		// On some older browsers (notably Safari on iOS 4.1 - see issue #56) the event target may be a text node.
		if (eventTarget.nodeType === Node.TEXT_NODE) {
			return eventTarget.parentNode;
		}

		return eventTarget;
	};


	/**
	 * On touch start, record the position and scroll offset.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onTouchStart = function(event) {
		var targetElement, touch, selection;

		// Ignore multiple touches, otherwise pinch-to-zoom is prevented if both fingers are on the FastClick element (issue #111).
		if (event.targetTouches.length > 1) {
			return true;
		}

		targetElement = this.getTargetElementFromEventTarget(event.target);
		touch = event.targetTouches[0];

		if (deviceIsIOS) {

			// Only trusted events will deselect text on iOS (issue #49)
			selection = window.getSelection();
			if (selection.rangeCount && !selection.isCollapsed) {
				return true;
			}

			if (!deviceIsIOS4) {

				// Weird things happen on iOS when an alert or confirm dialog is opened from a click event callback (issue #23):
				// when the user next taps anywhere else on the page, new touchstart and touchend events are dispatched
				// with the same identifier as the touch event that previously triggered the click that triggered the alert.
				// Sadly, there is an issue on iOS 4 that causes some normal touch events to have the same identifier as an
				// immediately preceeding touch event (issue #52), so this fix is unavailable on that platform.
				// Issue 120: touch.identifier is 0 when Chrome dev tools 'Emulate touch events' is set with an iOS device UA string,
				// which causes all touch events to be ignored. As this block only applies to iOS, and iOS identifiers are always long,
				// random integers, it's safe to to continue if the identifier is 0 here.
				if (touch.identifier && touch.identifier === this.lastTouchIdentifier) {
					event.preventDefault();
					return false;
				}

				this.lastTouchIdentifier = touch.identifier;

				// If the target element is a child of a scrollable layer (using -webkit-overflow-scrolling: touch) and:
				// 1) the user does a fling scroll on the scrollable layer
				// 2) the user stops the fling scroll with another tap
				// then the event.target of the last 'touchend' event will be the element that was under the user's finger
				// when the fling scroll was started, causing FastClick to send a click event to that layer - unless a check
				// is made to ensure that a parent layer was not scrolled before sending a synthetic click (issue #42).
				this.updateScrollParent(targetElement);
			}
		}

		this.trackingClick = true;
		this.trackingClickStart = event.timeStamp;
		this.targetElement = targetElement;

		this.touchStartX = touch.pageX;
		this.touchStartY = touch.pageY;

		// Prevent phantom clicks on fast double-tap (issue #36)
		if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
			event.preventDefault();
		}

		return true;
	};


	/**
	 * Based on a touchmove event object, check whether the touch has moved past a boundary since it started.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.touchHasMoved = function(event) {
		var touch = event.changedTouches[0], boundary = this.touchBoundary;

		if (Math.abs(touch.pageX - this.touchStartX) > boundary || Math.abs(touch.pageY - this.touchStartY) > boundary) {
			return true;
		}

		return false;
	};


	/**
	 * Update the last position.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onTouchMove = function(event) {
		if (!this.trackingClick) {
			return true;
		}

		// If the touch has moved, cancel the click tracking
		if (this.targetElement !== this.getTargetElementFromEventTarget(event.target) || this.touchHasMoved(event)) {
			this.trackingClick = false;
			this.targetElement = null;
		}

		return true;
	};


	/**
	 * Attempt to find the labelled control for the given label element.
	 *
	 * @param {EventTarget|HTMLLabelElement} labelElement
	 * @returns {Element|null}
	 */
	FastClick.prototype.findControl = function(labelElement) {

		// Fast path for newer browsers supporting the HTML5 control attribute
		if (labelElement.control !== undefined) {
			return labelElement.control;
		}

		// All browsers under test that support touch events also support the HTML5 htmlFor attribute
		if (labelElement.htmlFor) {
			return document.getElementById(labelElement.htmlFor);
		}

		// If no for attribute exists, attempt to retrieve the first labellable descendant element
		// the list of which is defined here: http://www.w3.org/TR/html5/forms.html#category-label
		return labelElement.querySelector('button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea');
	};


	/**
	 * On touch end, determine whether to send a click event at once.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onTouchEnd = function(event) {
		var forElement, trackingClickStart, targetTagName, scrollParent, touch, targetElement = this.targetElement;

		if (!this.trackingClick) {
			return true;
		}

		// Prevent phantom clicks on fast double-tap (issue #36)
		if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
			this.cancelNextClick = true;
			return true;
		}

		if ((event.timeStamp - this.trackingClickStart) > this.tapTimeout) {
			return true;
		}

		// Reset to prevent wrong click cancel on input (issue #156).
		this.cancelNextClick = false;

		this.lastClickTime = event.timeStamp;

		trackingClickStart = this.trackingClickStart;
		this.trackingClick = false;
		this.trackingClickStart = 0;

		// On some iOS devices, the targetElement supplied with the event is invalid if the layer
		// is performing a transition or scroll, and has to be re-detected manually. Note that
		// for this to function correctly, it must be called *after* the event target is checked!
		// See issue #57; also filed as rdar://13048589 .
		if (deviceIsIOSWithBadTarget) {
			touch = event.changedTouches[0];

			// In certain cases arguments of elementFromPoint can be negative, so prevent setting targetElement to null
			targetElement = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset) || targetElement;
			targetElement.fastClickScrollParent = this.targetElement.fastClickScrollParent;
		}

		targetTagName = targetElement.tagName.toLowerCase();
		if (targetTagName === 'label') {
			forElement = this.findControl(targetElement);
			if (forElement) {
				this.focus(targetElement);
				if (deviceIsAndroid) {
					return false;
				}

				targetElement = forElement;
			}
		} else if (this.needsFocus(targetElement)) {

			// Case 1: If the touch started a while ago (best guess is 100ms based on tests for issue #36) then focus will be triggered anyway. Return early and unset the target element reference so that the subsequent click will be allowed through.
			// Case 2: Without this exception for input elements tapped when the document is contained in an iframe, then any inputted text won't be visible even though the value attribute is updated as the user types (issue #37).
			if ((event.timeStamp - trackingClickStart) > 100 || (deviceIsIOS && window.top !== window && targetTagName === 'input')) {
				this.targetElement = null;
				return false;
			}

			this.focus(targetElement);
			this.sendClick(targetElement, event);

			// Select elements need the event to go through on iOS 4, otherwise the selector menu won't open.
			// Also this breaks opening selects when VoiceOver is active on iOS6, iOS7 (and possibly others)
			if (!deviceIsIOS || targetTagName !== 'select') {
				this.targetElement = null;
				event.preventDefault();
			}

			return false;
		}

		if (deviceIsIOS && !deviceIsIOS4) {

			// Don't send a synthetic click event if the target element is contained within a parent layer that was scrolled
			// and this tap is being used to stop the scrolling (usually initiated by a fling - issue #42).
			scrollParent = targetElement.fastClickScrollParent;
			if (scrollParent && scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop) {
				return true;
			}
		}

		// Prevent the actual click from going though - unless the target node is marked as requiring
		// real clicks or if it is in the whitelist in which case only non-programmatic clicks are permitted.
		if (!this.needsClick(targetElement)) {
			event.preventDefault();
			this.sendClick(targetElement, event);
		}

		return false;
	};


	/**
	 * On touch cancel, stop tracking the click.
	 *
	 * @returns {void}
	 */
	FastClick.prototype.onTouchCancel = function() {
		this.trackingClick = false;
		this.targetElement = null;
	};


	/**
	 * Determine mouse events which should be permitted.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onMouse = function(event) {

		// If a target element was never set (because a touch event was never fired) allow the event
		if (!this.targetElement) {
			return true;
		}

		if (event.forwardedTouchEvent) {
			return true;
		}

		// Programmatically generated events targeting a specific element should be permitted
		if (!event.cancelable) {
			return true;
		}

		// Derive and check the target element to see whether the mouse event needs to be permitted;
		// unless explicitly enabled, prevent non-touch click events from triggering actions,
		// to prevent ghost/doubleclicks.
		if (!this.needsClick(this.targetElement) || this.cancelNextClick) {

			// Prevent any user-added listeners declared on FastClick element from being fired.
			if (event.stopImmediatePropagation) {
				event.stopImmediatePropagation();
			} else {

				// Part of the hack for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
				event.propagationStopped = true;
			}

			// Cancel the event
			event.stopPropagation();
			event.preventDefault();

			return false;
		}

		// If the mouse event is permitted, return true for the action to go through.
		return true;
	};


	/**
	 * On actual clicks, determine whether this is a touch-generated click, a click action occurring
	 * naturally after a delay after a touch (which needs to be cancelled to avoid duplication), or
	 * an actual click which should be permitted.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onClick = function(event) {
		var permitted;

		// It's possible for another FastClick-like library delivered with third-party code to fire a click event before FastClick does (issue #44). In that case, set the click-tracking flag back to false and return early. This will cause onTouchEnd to return early.
		if (this.trackingClick) {
			this.targetElement = null;
			this.trackingClick = false;
			return true;
		}

		// Very odd behaviour on iOS (issue #18): if a submit element is present inside a form and the user hits enter in the iOS simulator or clicks the Go button on the pop-up OS keyboard the a kind of 'fake' click event will be triggered with the submit-type input element as the target.
		if (event.target.type === 'submit' && event.detail === 0) {
			return true;
		}

		permitted = this.onMouse(event);

		// Only unset targetElement if the click is not permitted. This will ensure that the check for !targetElement in onMouse fails and the browser's click doesn't go through.
		if (!permitted) {
			this.targetElement = null;
		}

		// If clicks are permitted, return true for the action to go through.
		return permitted;
	};


	/**
	 * Remove all FastClick's event listeners.
	 *
	 * @returns {void}
	 */
	FastClick.prototype.destroy = function() {
		var layer = this.layer;

		if (deviceIsAndroid) {
			layer.removeEventListener('mouseover', this.onMouse, true);
			layer.removeEventListener('mousedown', this.onMouse, true);
			layer.removeEventListener('mouseup', this.onMouse, true);
		}

		layer.removeEventListener('click', this.onClick, true);
		layer.removeEventListener('touchstart', this.onTouchStart, false);
		layer.removeEventListener('touchmove', this.onTouchMove, false);
		layer.removeEventListener('touchend', this.onTouchEnd, false);
		layer.removeEventListener('touchcancel', this.onTouchCancel, false);
	};


	/**
	 * Check whether FastClick is needed.
	 *
	 * @param {Element} layer The layer to listen on
	 */
	FastClick.notNeeded = function(layer) {
		var metaViewport;
		var chromeVersion;
		var blackberryVersion;
		var firefoxVersion;

		// Devices that don't support touch don't need FastClick
		if (typeof window.ontouchstart === 'undefined') {
			return true;
		}

		// Chrome version - zero for other browsers
		chromeVersion = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];

		if (chromeVersion) {

			if (deviceIsAndroid) {
				metaViewport = document.querySelector('meta[name=viewport]');

				if (metaViewport) {
					// Chrome on Android with user-scalable="no" doesn't need FastClick (issue #89)
					if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
						return true;
					}
					// Chrome 32 and above with width=device-width or less don't need FastClick
					if (chromeVersion > 31 && document.documentElement.scrollWidth <= window.outerWidth) {
						return true;
					}
				}

			// Chrome desktop doesn't need FastClick (issue #15)
			} else {
				return true;
			}
		}

		if (deviceIsBlackBerry10) {
			blackberryVersion = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/);

			// BlackBerry 10.3+ does not require Fastclick library.
			// https://github.com/ftlabs/fastclick/issues/251
			if (blackberryVersion[1] >= 10 && blackberryVersion[2] >= 3) {
				metaViewport = document.querySelector('meta[name=viewport]');

				if (metaViewport) {
					// user-scalable=no eliminates click delay.
					if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
						return true;
					}
					// width=device-width (or less than device-width) eliminates click delay.
					if (document.documentElement.scrollWidth <= window.outerWidth) {
						return true;
					}
				}
			}
		}

		// IE10 with -ms-touch-action: none or manipulation, which disables double-tap-to-zoom (issue #97)
		if (layer.style.msTouchAction === 'none' || layer.style.touchAction === 'manipulation') {
			return true;
		}

		// Firefox version - zero for other browsers
		firefoxVersion = +(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];

		if (firefoxVersion >= 27) {
			// Firefox 27+ does not have tap delay if the content is not zoomable - https://bugzilla.mozilla.org/show_bug.cgi?id=922896

			metaViewport = document.querySelector('meta[name=viewport]');
			if (metaViewport && (metaViewport.content.indexOf('user-scalable=no') !== -1 || document.documentElement.scrollWidth <= window.outerWidth)) {
				return true;
			}
		}

		// IE11: prefixed -ms-touch-action is no longer supported and it's recomended to use non-prefixed version
		// http://msdn.microsoft.com/en-us/library/windows/apps/Hh767313.aspx
		if (layer.style.touchAction === 'none' || layer.style.touchAction === 'manipulation') {
			return true;
		}

		return false;
	};


	/**
	 * Factory method for creating a FastClick object
	 *
	 * @param {Element} layer The layer to listen on
	 * @param {Object} [options={}] The options to override the defaults
	 */
	FastClick.attach = function(layer, options) {
		return new FastClick(layer, options);
	};


	if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {

		// AMD. Register as an anonymous module.
		define(function() {
			return FastClick;
		});
	} else if (typeof module !== 'undefined' && module.exports) {
		module.exports = FastClick.attach;
		module.exports.FastClick = FastClick;
	} else {
		window.FastClick = FastClick;
	}

document.addEventListener('DOMContentLoaded', function() {
    FastClick.attach(document.body);
}, false);

}());
(function(w){
// 空函数
function shield(){
	return false;
}
document.addEventListener('touchstart',shield,false);//取消浏览器的所有事件，使得active的样式在手机上正常生效
document.oncontextmenu = shield;//屏蔽选择函数
// H5 plus事件处理
w.uuid = null;
var ws = null,as = 'pop-in';
function plusReady(){
	w.uuid = plus.storage.getItem("uuid");
	ws = plus.webview.currentWebview();
	// Android处理返回键
	plus.key.addEventListener('backbutton',function(){
		back();
	},false);
}
if(w.plus){
	plusReady();
}else{
	document.addEventListener('plusready',plusReady,false);
}
// DOMContentLoaded事件处理
var domready = false;
document.addEventListener('DOMContentLoaded',function(){
	domready = true;
	document.body.onselectstart=shield;
},false);
// 处理返回事件
w.back = function(hide){
	if(w.plus){
		ws||(ws=plus.webview.currentWebview());
		if(hide||ws.preate){
			ws.hide('auto');
		}else{
			ws.close('auto');
		}
	}else if(history.length>1){
		history.back();
	}else{
		w.close();
	}
};
var openw = null,waiting=null;
/**
 * 打开新窗口
 * @param {Object} id
 * @param {Object} extras
 */
w.openWebview = function(id,wa,ns,ws){
	if(openw){//避免多次打开同一个页面
		return null;
	}
	if(w.plus){
		wa&&(waiting=plus.nativeUI.showWaiting());
		ws = ws||{};
		ws.scrollIndicator||(ws.scrollIndicator='none');
		ws.scalable||(ws.scalable=false);
		openw = plus.webview.create(id,id,ws);
		ns||openw.addEventListener('loaded',function(){//页面加载完成后才显示
			setTimeout(function(){//延后显示可避免低端机上动画时白屏
				openw.show(as);
			},200);
		},false);
		openw.addEventListener('close',function(){//页面关闭后可再次打开
			openw = null;
		},false);
		return openw;
	}else{
		w.open(id);
	}
	return null;
};
/**
 * 原生导航栏
 * @param {Object} href
 */
w.openNativeTitle = function(href,extras,type){
	var titleType = type ? 'transparent' : 'default';
	//打开窗口的相关参数
	var options = {
		url:href,
		id:href,
		styles:{
			popGesture: "close",
			titleNView:{
				autoBackButton:true,
				backgroundColor:'#f47e13',
				titleColor:'#fff',
				type: titleType
			}
		},
		extras:extras || {}
	};	
	mui.openWindow(options);
}
/**
 * 关闭当前窗口返回上个窗口并刷新
 * @param {Object} page
 */
w.returnWindow = function(page){
    var ws = plus.webview.currentWebview();
    var wo = ws.opener();
    do {
    	if (wo.getURL().endsWith(page)) {
    		break;
    	}	
    	var temp = wo.opener();
    	wo.close("none");
    	wo = temp;
    } while (true);
	setTimeout(function() {
		wo.evalJS("dataRefresh()");
		ws.close();
	}, 300);
}

})(window);

$.plusReady = function(pageReady, pageRefresh, useRefresh) {
	if (!pageReady) {
		pageReady = function() {}
	}	
	var ws = null;
    if (window.plus) {
        pagePlusReady();
    } else {
        document.addEventListener('plusready', pagePlusReady, false);
    }
    function pagePlusReady() {
        ws = plus.webview.currentWebview();
    	// 处理沉浸式状态栏
	    var topoffset = 0;
	    var ms = (/Html5Plus\/.+\s\(.*(Immersed\/(\d+\.?\d*).*)\)/gi).exec(navigator.userAgent);
	    if (ms && ms.length >= 3) {
	        topoffset = parseFloat(ms[2]);
	    }
	    // 兼容沉浸式状态栏模式
        if (plus.navigator.isImmersedStatusbar()) {
            topoffset = Math.round(plus.navigator.getStatusbarHeight());
        } else {
            $('.header').removeClass('header-immersed');
        }              
        if (useRefresh || typeof useRefresh == "undefined") {
	        ws.setPullToRefresh({
	        	support: true,
	        	style: 'circle',
	        	offset: topoffset + 45 + 'px'
	        }, onRefresh);
        }       
        pageReady();
    }

    // 刷新页面
    function onRefresh(){
        console.log("### onRefresh ###");
        if (pageRefresh) {
        	pageRefresh();
        } else {
        	pageReady();
        }
        ws.endPullToRefresh();
    }
}
/**
 * 上拉刷新下拉加载
 * @param {Object} downCallback
 * @param {Object} upCallback
 */
var pullRefresh = function(downCallback,upCallback){
	mui.init({
    	pullRefresh: {
			container: '#J_refresh',
			down: {
				style:'circle',
				offset: '75px',
				callback: function() {
					mui('#J_refresh').pullRefresh().refresh(true);
					mui('#J_refresh').pullRefresh().endPulldownToRefresh();
					downCallback && downCallback();								
				}
			},
    		up: {
    			callback: function(){
    				setTimeout(function() {
    					upCallback && upCallback();	
    				}, 300);
    			}
    		}
    	}
    });
}
/**
 * 停止刷新数据
 * @param {Object} length
 * @param {Object} pageSize
 */
var stopRefresh = function(length,pageSize){
	if(length && pageSize){
		mui('#J_refresh').pullRefresh().endPullupToRefresh(length < pageSize);
	}else{
		mui('#J_refresh').pullRefresh().endPullupToRefresh(true);
	}	
}
/**
 * 启用刷新
 */
var enableRefresh = function(){
	mui('#J_refresh').pullRefresh().refresh(true);
}

//通过定位模块获取位置信息
function getCurrentPosition() {
    plus.geolocation.getCurrentPosition(geoInf, function (e) {
        console.log("获取定位位置信息失败:"+e.message)
    },{provider:'amap'});
}
/**
 * 获取位置具体信息
 * @param position
 */
function geoInf(position) {
    var addresses = position.addresses;
    var longitude = position.coords.longitude;
    var latitude = position.coords.latitude;
    var province = '', city = '';
    try{
    	province = position.address.province;
    	city = position.address.city;
    }catch(e){
    	
    }
    var geolocationGroup = {
    	"province":province,
    	"city":city,
    	"addresses":addresses,
    	"longitude":longitude,
    	"latitude":latitude      	
    }
    console.log("## geoInf ## 位置具体信息 : " + JSON.stringify(geolocationGroup));
    plus.storage.setItem("geolocationGroup", JSON.stringify(geolocationGroup));
}
function checkNumber(theObj) {
	var reg = /^[0-9]+.?[0-9]*$/;
	if(reg.test(theObj)) {
		return true;
	}
	return false;
}

Date.prototype.formatDate = function(fmt) {
	var o = {
		"M+": this.getMonth() + 1, //月份
		"d+": this.getDate(), //日
		"h+": this.getHours(), //小时
		"m+": this.getMinutes(), //分
		"s+": this.getSeconds(), //秒
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度
		"S": this.getMilliseconds() //毫秒
	};
	if(/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	for(var k in o) {
		if(new RegExp("(" + k + ")").test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		}
	}
	return fmt;
}

function getHeadImg(img) {
	return vaildeParam(img) ? img : "../img/user_profile/app_10.png";
}
/**
 * 参数校验
 */
function vaildeParam(param) {
    if(typeof param == 'undefined'){
        return false;
    }
    if(undefined == param){
        return false
    }
    if(null == param){
        return false;
    }
    if(param.length == 0){
        return false;
    }
    return true;
}
/**
 * 发送跨域请求
 * @param {Object} url 接口地址
 * @param {Object} data 参数连接的方式
 * @param {Object} callback 回调函数
 * @param {Boolean} isIcon  选填（是否显示loging）
 */
function postJSON(url, data, callback,isIcon){
	if (plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
		toast("网络异常，请检查网络设置！");
		return false;
	}
	url += "?"+jsonToParams(data);
	if(!isIcon){
		showLoading("数据加载中..."); 
	}
	var xhr = new plus.net.XMLHttpRequest();	
	xhr.onreadystatechange = function () {
	    switch ( xhr.readyState ) {
	        case 4:       	
	            if ( xhr.status == 200 ) {
            		var responseText = xhr.responseText;
            		console.log("## postJSON ## url : "+url)
            		console.log("## responseText: "+responseText)
            	 	var json = JSON.parse(responseText);
            	 	try{
						callback(json);
					}catch(e){						
						toast("页面异常，请稍后再试！");
						!isIcon &&  hideLoading();
						console.error(e)
					}        		
	            } else {
            		toast("系统服务异常，请稍后再试！");
            		console.log(url+"接口请求失败 :"+xhr.responseText)
	            }
	            !isIcon &&  hideLoading();
	            break;
	        default :
	            break;
	    }
    }
	xhr.open("POST", url);
	xhr.send(null);
}
// 格式化 post 传递的数据
function jsonToParams(obj) {
	if(typeof obj != "object") {
		alert("输入的参数必须是对象");
		return;
	}
	// 不支持FormData的浏览器的处理 
	var arr = new Array();
	var i = 0;
	for(var attr in obj) {
		arr[i] = encodeURIComponent(attr) + "=" + encodeURIComponent(obj[attr]);
		i++;
	}
	return arr.join("&");
}
function showLoading(msg){  
    plus.nativeUI.showWaiting(msg,{  
        padding:'20px',
        background:"rgba(0,0,0,.5)"
    });  
}  
function hideLoading(){  
    plus.nativeUI.closeWaiting();  
}
function toast(msg){
	$(".mui-toast-container").remove();
	mui.toast(msg,{type:'div'}); 
}
/**
 * 登录校验
 */
function checkLogin(page) {
	var userinfo = plus.storage.getItem("userinfo");
	var uuid = plus.storage.getItem("uuid");
	var loginDate = plus.storage.getItem("login_date");
	if(!vaildeParam(userinfo) || !vaildeParam(uuid) || !vaildeParam(loginDate)) {
		if(vaildeParam(page)) {
			openWebview(page, true, false);
		} else {
			openWebview('login.html', true, false);
		}
	}
}

/**
 * 保存登入数据
 * @param {Object} userID
 * @param {Object} mobile
 */
function setLoginData(userinfo) {
	var date = formatDate(new Date(userinfo.loginDate), "yyyy-mm-dd HH:mm:ss");
	plus.storage.setItem("uuid", userinfo.uuid);
	plus.storage.setItem("mobile", userinfo.mobile);
	plus.storage.setItem("login_date", date);
	plus.storage.setItem("userinfo", JSON.stringify(userinfo));
	console.log("## setLoginData ## 用户登录时间 : " + date);
	console.log("## setLoginData ## 用户基本信息 : " + JSON.stringify(userinfo))
}
function loginOut(){
	mui.confirm('', '确认退出登录吗？',['取消','确定'],function(event) {
		if (event.index == 1) {
			return;
		}
		plus.storage.clear();
        layer.msg("退出登录成功");
        setTimeout(function(){
            openWebview('login.html');
        },1000);
	}); 
}
function clearLogin() {
	plus.storage.clear();
}

/** 美化时间显示*/
function jsDateDiff(publishTime) {
	var d_minutes, d_hours, d_days;
	var timeNow = parseInt(new Date().getTime() / 1000);
	var d;
	d = timeNow - publishTime;
	d_days = parseInt(d / 86400);
	d_hours = parseInt(d / 3600);
	d_minutes = parseInt(d / 60);
	if(d_days > 0 && d_days < 4) {
		return d_days + "天前";
	} else if(d_days <= 0 && d_hours > 0) {
		return d_hours + "小时前";
	} else if(d_hours <= 0 && d_minutes > 0) {
		return d_minutes + "分钟前";
	} else if(d_days <= 0 && d_hours <= 0 && d_minutes <= 0) {
		return parseInt(d, 10) + "秒前";
	} else {
		var s = new Date(publishTime * 1000);
		return s.getFullYear() + "年" + (s.getMonth() + 1) + "月" + s.getDate() + "日";
	}
}

/**
 * 日期格式化
 * @param {Object} date
 * @param {Object} str
 */
function formatDate(date, str) {
	var mat = {};
	mat.M = date.getMonth() + 1; //月份记得加1
	mat.H = date.getHours();
	mat.s = date.getSeconds();
	mat.m = date.getMinutes();
	mat.Y = date.getFullYear();
	mat.D = date.getDate();
	mat.d = date.getDay(); //星期几
	mat.d = check(mat.d);
	mat.H = check(mat.H);
	mat.M = check(mat.M);
	mat.D = check(mat.D);
	mat.s = check(mat.s);
	mat.m = check(mat.m);
	if(str.indexOf(":") > -1) {　　　　　
		mat.Y = mat.Y.toString().substr(2, 2);　　　　
		return mat.Y + "/" + mat.M + "/" + mat.D + " " + mat.H + ":" + mat.m + ":" + mat.s;
	}
	if(str.indexOf("/") > -1) {
		return mat.Y + "/" + mat.M + "/" + mat.D + " " + mat.H + "/" + mat.m + "/" + mat.s;
	}
	if(str.indexOf("-") > -1) {
		return mat.Y + "-" + mat.M + "-" + mat.D + " " + mat.H + "-" + mat.m + "-" + mat.s;
	}
}

/**
 * 检查是不是两位数字，不足补全
 * @param {Object} str
 */
function check(str) {
	str = str.toString();
	if(str.length < 2) {
		str = '0' + str;
	}
	return str;
}

function getTimeDiffString(timeFiff) {
	console.log("## getTimeDiffString ## timeFiff:" + timeFiff)
	var days = Math.floor(timeFiff / (24 * 3600 * 1000));
	//计算出小时数
	var leave1 = timeFiff % (24 * 3600 * 1000) //计算天数后剩余的毫秒数
	var hours = Math.floor(leave1 / (3600 * 1000))
	console.log("## getTimeDiffString ## hours:" + hours)
	//计算相差分钟数
	var leave2 = leave1 % (3600 * 1000) //计算小时数后剩余的毫秒数
	var minutes = Math.floor(leave2 / (60 * 1000))
	console.log("## getTimeDiffString ## minutes:" + minutes)
	//计算相差秒数
	var leave3 = leave2 % (60 * 1000) //计算分钟数后剩余的毫秒数
	var seconds = Math.round(leave3 / 1000)
	console.log("## getTimeDiffString ## seconds:" + seconds)
	var res = '';
	if(seconds > 0) {
		res = seconds + " 秒" + res;
	}
	if(minutes > 0) {
		res = minutes + "分钟 " + res
	}
	if(hours > 0) {
		res = hours + "小时 " + res
	}
	if(days > 0) {
		res = days + "天 " + res
	}
	console.log("## getTimeDiffString ## res:" + res)
	return res;
}

function getTimeDiff(time) {
	console.log("## getTimeDiff ## time:" + time)
	var date2 = new Date();
	var date3 = date2.getTime() - time;
	return getTimeDiffString(date3);
}

function loadImage(url, callback) {
	console.log("## loadImage ## url:" + url)
	var img = new Image(); //创建一个Image对象，实现图片的预下载
	img.src = url;
	if(img.complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数
		console.log("## loadImage ## complete")
		callback.call(img);
		return; // 直接返回，不用再处理onload事件
	}
	img.onload = function() { //图片下载完毕时异步调用callback函数。
		console.log("## loadImage ## onload")
		callback.call(img); //将回调函数的this替换为Image对象
	};
}

function randomString(len) {
	len = len || 32;
	var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; 
	var maxPos = $chars.length;
	var pwd = '';
	for(i = 0; i < len; i++) {
		pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
	}
	return pwd;
}
function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r != null) return unescape(r[2]);
	return null;
}
/**
 * 上传用户登入信息,并且校验是否多台设备登入
 */
function uploadLoginInfo(loginPagePath) {
	checkLogin(loginPagePath);
	setInterval(function() {
		var uuid = plus.storage.getItem("uuid");
		if(vaildeParam(uuid)) {
			var osName = plus.os.name;
			var deviceModel = plus.device.model;
			var deviceUuid = plus.device.uuid;
			var clientInfo = plus.push.getClientInfo().clientid;
			console.log("## uploadLoginInfo ## uuid:" + uuid);
			console.log("## uploadLoginInfo ## osName:" + osName);
			console.log("## uploadLoginInfo ## deviceModel:" + deviceModel);
			console.log("## uploadLoginInfo ## deviceUuid:" + deviceUuid);
			console.log("## uploadLoginInfo ## clientInfo:" + JSON.stringify(plus.push.getClientInfo()));
			console.log("## uploadLoginInfo ## clientInfo:" + clientInfo);
			var data = {
				"uuid": uuid,
				"osName": osName,
				"deviceModel": deviceModel,
				"clientInfo": clientInfo,
				"deviceUuid": deviceUuid
			}
			postJSON(API_URL.updateLoginInfo, data, function(res) {
				if("0" == res.code) {
					console.log("上传用户登录信息成功")
				} else if('6003' == res.code) {
					toast('您的账号已在在另一设备登录，您强制下线,正在跳转登录页面...');
					setTimeout(function() {
						clearLogin();
						checkLogin(loginPagePath);
					}, 2000)
				} else {
					toast(res.msg);
				}
			},true)
		}
	}, 5000)
}
function checkVersion() {
    var osName = plus.os.name;
	postJSON(API_URL.AppVersionGetNewest,{ "appType" : osName },function (res) {
		if (res.code == '0' && vaildeParam(res.data)) {
			if (compareVersion(res.data.version)) {
    			openWebview('views/edition.html');
    		}
		}
    });
}
/**
 * wgt html/css/js
 * wgtu 差量更新,需要对照appStore或应用宝中的升级
 */
function heatUpdate(appType) {
	appType = appType + "HeatUpdate";
	postJSON(API_URL.AppVersionGetNewest, {'appType': appType}, function(res) {
		if('0' == res.code && vaildeParam(res.data)) {
			if(compareVersion(res.data.version)) {
				plus.nativeUI.confirm('检测到新版本,是否更新?', function(e) {
					if(e.index == 0) {
						console.log('检测到新版本更新');
						downloadWgt(res.data.url);
					}
				});
			}
		}
	},true);
}

function compareVersion(version) {
	if(!vaildeParam(version)) {
		console.log('版本号不能为空');
		return false;
	}
	if(!version.startsWith('v') || version.length == 1) {
		console.log('错误的版本号');
		return false;
	}
	var array1 = version.substr(1).split('.');
	var array2 = appVersion.substr(1).split('.');
	var len = Math.min(array1.length, array2.length);
	var index = 0,diff = 0;
	while(index < len && (diff = parseInt(array1[index]) - parseInt(array2[index])) == 0) {
		index++;
	}
	return diff == 0 ? array1.length - array2.length : diff > 0;
}

function downloadWgt(url) {
	var showLoading = plus.nativeUI.showWaiting(' 正在下载...... ');
	var downloadTask = plus.downloader.createDownload(url, {
		filename: '_doc/update/'
	}, function(d, status) {
		plus.nativeUI.closeWaiting();
		if(status == 200) {
			installWgt(d.filename);
		} else {
			plus.nativeUI.alert('下载升级文件失败！');
		}
	});
	downloadTask.start();
	var count = 0;
	downloadTask.addEventListener('statechanged', function(task, status) {
		switch(task.state) {
			case 1:
				break;
			case 2:
				showLoading.setTitle(" 已连接到服务器 ...... ");
				break;
			case 3:
				var prg = parseInt(parseFloat(task.downloadedSize) / parseFloat(task.totalSize) * 100);
				if(count < prg) {
					count = prg;
					showLoading.setTitle(' 正在下载 ' + count + '% ...... ');
				}
				break;
			case 4:
				break;
			default:
				break;
		}
	});
}

function installWgt(path) {
	plus.nativeUI.showWaiting('正在安装...');
	plus.runtime.install(path, {
		force: true
	}, function() {
		plus.nativeUI.closeWaiting();
		console.log('安装wgt文件成功！');
		plus.nativeUI.alert('应用资源更新完成！', function() {
			plus.runtime.restart();
		});
	}, function(e) {
		plus.nativeUI.closeWaiting();
		console.log('安装wgt文件失败[' + e.code + ']：' + e.message);
		plus.nativeUI.alert('应用资源更新失败' + e.message);
	});
}

var utils = {
    renderTemplate: function (tpl, data) {
        if (typeof template === 'function') {
            var render = template.compile(tpl);
            return render(data);
        }
        else {
            alert('请先加载: artTemplate');
        }
    }
};