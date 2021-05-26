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
