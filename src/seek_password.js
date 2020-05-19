// refer from https://flowerpassword.com
function flower_password(pwd, key) {
	var md5one = md5(pwd, key);
	var md5two = md5(md5one, "sun");
	var md5three = md5(md5one, "moon");
	// to uppercase
	var rule = md5three.split("");
	var source = md5two.split("");
	console.assert(rule.length === source.length, "md5 output length not equal");
	for (var i = 0; i < source.length; ++i) {
		if (isNaN(source[i])) {
			var str = "starsintherain1995090127dream";
			if (str.search(rule[i]) > -1) {
				source[i] = source[i].toUpperCase();
			}
		}
	}
	var code32 = source.join("");
	var code1 = code32.slice(0, 1);
	if (isNaN(code1)) {
		var code16 = code32.slice(0, 16);
	} else {
		var code16 = "X" + code32.slice(1, 16);
	}
	return [code16, code32];
}

function seek_password(hash) {
	// generate alphabet
	var lower = "abcdefghijklmnopqrstuvwxyz".split("");
	var upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
	var number = "0123456789".split("");
	var punctuation = ",.-;!?".split("");
	var alphabet = lower.concat(upper).concat(number).concat(punctuation);
	// try to generate password
	for (var i = 0; i <= hash.length - 12; ++i) {
		var sub_hash = hash.slice(i, i + 12).split("");
		var count = 0;
		var map_index = sub_hash.map(function(c) {
			count = (count + c.charCodeAt()) % alphabet.length;
			return count;
		});
		var sk_pwd = map_index.map(function(k) { return alphabet[k]; });
		// validate password
		var matched = [false, false, false, false];
		sk_pwd.forEach(function(e) {
			matched[0] = matched[0] || lower.includes(e);
			matched[1] = matched[1] || upper.includes(e);
			matched[2] = matched[2] || number.includes(e);
			matched[3] = matched[3] || punctuation.includes(e);
		});
		if (!matched.includes(false)) {
			return sk_pwd.join("");
		}
	}
	return "";
}

function generate_password(pwd, key) {
	if (pwd && key) {
		var fl_pwd = flower_password(pwd, key);
		var hash = fl_pwd[1];
		console.assert(hash.length === 32, "flower_password output length not equal to 32");
		var sk_pwd = seek_password(hash);
        return sk_pwd;
	}
}
