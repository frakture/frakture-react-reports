/* eslint-disable */
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc)

//Deep extend
//Sourced from jQuery
export function extend() {
    var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deep = false,
        toString = Object.prototype.toString,
        hasOwn = Object.prototype.hasOwnProperty,
        push = Array.prototype.push,
        slice = Array.prototype.slice,
        trim = String.prototype.trim,
        indexOf = Array.prototype.indexOf,
        class2type = {
          "[object Boolean]": "boolean",
          "[object Number]": "number",
          "[object String]": "string",
          "[object Function]": "function",
          "[object Array]": "array",
          "[object Date]": "date",
          "[object RegExp]": "regexp",
          "[object Object]": "object"
        },
        jQuery = {
          isFunction: function (obj) {
            return jQuery.type(obj) === "function"
          },
          isArray: Array.isArray ||
          function (obj) {
            return jQuery.type(obj) === "array"
          },
          isWindow: function (obj) {
            return obj != null && obj == obj.window
          },
          isNumeric: function (obj) {
            return !isNaN(parseFloat(obj)) && isFinite(obj)
          },
          type: function (obj) {
            return obj == null ? String(obj) : class2type[toString.call(obj)] || "object"
          },
          isPlainObject: function (obj) {
            if (!obj || jQuery.type(obj) !== "object" || obj.nodeType) {
              return false
            }
            try {
              if (obj.constructor && !hasOwn.call(obj, "constructor") && !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
                return false
              }
            } catch (e) {
              return false
            }
            var key;
            for (key in obj) {}
            return key === undefined || hasOwn.call(obj, key)
          }
        };
      if (typeof target === "boolean") {
        deep = target;
        target = arguments[1] || {};
        i = 2;
      }
      if (typeof target !== "object" && !jQuery.isFunction(target)) {
        target = {}
      }
      if (length === i) {
        target = this;
        --i;
      }
      for (i; i < length; i++) {
        if ((options = arguments[i]) != null) {
          for (name in options) {
            src = target[name];
            copy = options[name];
            if (target === copy) {
              continue
            }
            if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))) {
              if (copyIsArray) {
                copyIsArray = false;
                clone = src && jQuery.isArray(src) ? src : []
              } else {
                clone = src && jQuery.isPlainObject(src) ? src : {};
              }
              // WARNING: RECURSION
              target[name] = exports.extend(deep, clone, copy);
            } else if (copy !== undefined) {
              target[name] = copy;
            }
          }
        }
      }
      return target;
    }


const humanizeDate=function(_d){
	if (!_d) return "";
	let d=dayjs(_d);
	if (dayjs().diff(d)<(24*60*60*1000)) return d.fromNow();
	return d.format("MMM DD, h:mm A");s;
};

function abbrNum(number, decPlaces) {
	if (!Number(number)) return 0;
	if (number<1 && number>0){return Number(number).toFixed(1);}

	// 2 decimal places => 100, 3 => 1000, etc
	decPlaces = Math.pow(10,decPlaces);

	// Enumerate number abbreviations
	let abbrev = ["", "k", "m", "b", "t" ];

	// Go through the array backwards, so we do the largest first
	for (let i=abbrev.length-1; i>=0; i--) {

		// Convert array index to "1000", "1000000", etc
		let size = Math.pow(10,(i)*3);

		// If the number is bigger or equal do the abbreviation
		if(size <= number) {
			// Here, we multiply by decPlaces, round, and then divide by decPlaces.
			// This gives us nice rounding to a particular decimal place.
			number = Math.round(number*decPlaces/size)/decPlaces;

			// Handle special case where we round up to the next abbreviation
			if((number == 1000) && (i < abbrev.length - 1)) {
				number = 1;
				i++;
			}

			// Add the letter for the abbreviation
			number += abbrev[i];

			// We are done... stop
			break;
		}
	}
	return number;
}


//turn numbers into abbreviated numbers, strings to shortened strings, etc
const humanize=function(o,chars){
	if (o===null || o===undefined || o===Infinity) return "";
	try{
		chars=chars || 200;
		switch (typeof o){
		case 'function':
			return "[Function]";
		case 'boolean':
			return o;
		case 'string':
			if (o.length>chars){return o.slice(0,chars)+"...";}
			else return o;
		case 'NaN': return "n/a";
		case 'number': return abbrNum(o,1);
		case 'object':
			let n={};
			for (i in o){
				if (i.slice(-3)!="_id"){
					n[i]=exports.humanize(o[i],chars);
				}else{
					n[i]=o[i];
				}
			}
			return n;
		default:
			return o;
		}
	}catch(e){
		console.error(e);
		console.error("Could not humanize object:",o);
		return "err!";
	}
};


const formatValue=function(v,format,emptyValue=""){
	if (v===undefined) return emptyValue;
	if (v==null) return emptyValue;
	switch(format){
	case "percent": return (100*v).toFixed(v>.1?1:2)+"%";
	case "currency": return "$"+(v>10000?humanize(v):v.toFixed(v>1000?0:2));
	case "date": return dayjs(v).format("MMM DD, 'YY"); //local date
	case "utcdate": return dayjs(v).utc().format("MMM DD, 'YY");
	case "month": return dayjs(v).format("MMM YYYY");
	default: return humanize(v);
	}
};
function getCronLabel(s){
	return (getCronMapping().filter(m=>m.cron==s)[0]||{label:"Custom ("+s+")"}).label;

}

function getCronMapping() {
	return [
		{cron: "", label: "Manual"},
		{cron: "0 0 3 * * *", label: "Every morning at 10 PM EST"},
		{cron: "0 0 4 * * *", label: "Every morning at 11 PM EST"},
		{cron: "0 0 5 * * *", label: "Every morning at 12 AM EST"},
		{cron: "0 0 6 * * *", label: "Every morning at 1 AM EST"},
		{cron: "0 0 7 * * *", label: "Every morning at 2 AM EST"},
		{cron: "0 0 8 * * *", label: "Every morning at 3 AM EST"},
		{cron: "0 0 9 * * *", label: "Every morning at 4 AM EST"},
		{cron: "0 0 10 * * *", label: "Every morning at 5 AM EST"},
		{cron: "0 0 11 * * *", label: "Every morning at 6 AM EST"},
		{cron: "0 0 12 * * *", label: "Every morning at 7 AM EST"},
		{cron: "0 0 13 * * *", label: "Every morning at 8 AM EST"},
		{cron: "0 0 14 * * *", label: "Every morning at 9 AM EST"},
		{cron: "0 0 15 * * *", label: "Every morning at 10 AM EST"},
		{cron: "0 0 16 * * *", label: "Every morning at 11 AM EST"},
		{cron: "0 0 17 * * *", label: "Every morning at 12 AM EST"},
		{cron: "0 0 11 * * 1", label: "Every Monday morning at 6AM"},
		{cron: "0 20 */12 * * *", label: "Every twelve hours"},
		{cron: "0 10 */8 * * *", label: "Every eight hours"},
		{cron: "0 0 */4 * * *", label: "Every four hours"},
		{cron: "0 0 * * * *", label: "Every hour"},
		{cron: "0 50 * * * *", label: "Every hour at x:50"},
		{cron: "0 */30 * * * *", label: "Every 30 minutes"},
		{cron: "0 */15 * * * *", label: "Every 15 minutes"},
		{cron: "0 */10 * * * *", label: "Every 10 minutes"},
		{cron: "0 */5 * * * *", label: "Every 5 minutes"}
	];
}

function getStringArray(s,nonZeroLength){
	let a=s || [];
	if (typeof a=='number') a=String(a);
	if (typeof a=='string') a=[a];

	if (typeof s=='string') a=s.split(",");
	a=a.map(s=>s.toString().trim()).filter(Boolean);
	if (nonZeroLength && a.length==0) a=[0];
	return a;
}

/*
	Function that supports relative date calculations, like "-3d" for 3 days ago, etc
*/
function relativeDate(s,initialDate){
	if (!s || s=="none") return null;
	if (typeof s.getMonth === 'function') return s;

	if (parseInt(s)==s){
		let r= new Date(parseInt(s));
		if (r=='Invalid Date') throw 'Invalid Date:'+s;
		return r;
	}

	if (initialDate){
		initialDate=new Date(initialDate);
	}else{
		initialDate=new Date();
	}

	let r=s.match(/^([+-]{1})([0-9]+)([YyMwdhms]{1})([.a-z]*)$/);

	if (r){
		let period=null;
		switch(r[3]){
		case "Y":
		case "y": period="years"; break;

		case "M": period="months"; break;
		case "w": period="weeks"; break;
		case "d": period="days"; break;
		case "h": period="hours"; break;
		case "m": period="minutes"; break;
		case "s": period="seconds"; break;
		}

		let d=dayjs(initialDate);

		if (r[1]=="+"){
			 d=d.add(parseInt(r[2]),period);
		}else{
			d=d.subtract(parseInt(r[2]),period);
		}
		if (d.toDate()=='Invalid Date') throw "Invalid date configuration:"+r;
		if (r[4]){
			let opts=r[4].split(".").filter(Boolean);
			if (opts[0]=="start") d=d.startOf(opts[1]||"day");
			else if (opts[0]=="end") d=d.endOf(opts[1]||"day");
			else throw "Invalid relative date,unknown options:"+r[4];
		}

		return d.toDate();
	}else if (s=="now"){
		let r=dayjs(new Date()).toDate();
		return r;
	}else{
		let r=dayjs(new Date(s)).toDate();
		if (r=='Invalid Date') throw "Invalid Date: "+s;
		return r;
	}
}

function parseRegExp(o,opts){
	if (o instanceof RegExp) return o;
	try{
		switch(typeof o){
		case 'object':
			for (i in o){
				o[i]=exports.parseRegExp(o[i],i,counter);
			}
			return o;

		case 'string':
			if (o.indexOf('/')==0 && o.lastIndexOf('/')>0){
				var r=o.slice(1,o.lastIndexOf('/'));
				var g=o.slice(o.lastIndexOf('/')+1);
				var flags=exports.getUnique((g+(opts||"")).split("")).join("");
				var re=new RegExp(r,flags);
				return re;
			}else{
				return new RegExp(o,opts||"i");
			}

		default:
			return o;
		}
	}catch(e){
		return o;
	}
}

export {humanize,humanizeDate,relativeDate,formatValue,getCronLabel,getCronMapping,getStringArray,parseRegExp};
