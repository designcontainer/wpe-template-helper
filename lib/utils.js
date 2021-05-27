module.exports = { getAuthanticatedUrl };

/**
 * Creates a url with authentication token in it
 *
 * @param  {String} token access token to GitHub
 * @param  {String} url repo URL
 * @returns  {String}
 */
function getAuthanticatedUrl(token, url) {
	const arr = url.split('//');
	return `https://${token}@${arr[arr.length - 1]}.git`;
}

/**
 * @param  {String} list names of values that can be separated by comma
 * @returns  {Array<String>} input names not separated by string but as separate array items
 */
 function parseCommaList(list) {
	return list.split(',').map(i => i.trim().replace(/['"]+/g, ''));
  }
  