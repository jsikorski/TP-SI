ArticleContext = {};

ArticleContext.storageId = 'article';

ArticleContext.write = function(articleName) {
	localStorage.setItem(this.storageId, articleName)	
};

ArticleContext.read = function() {
	return localStorage.getItem(this.storageId);
};

ArticleContext.clear = function() {
	localStorage.removeItem(this.storageId)
};