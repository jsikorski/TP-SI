window.onload = function() {
	
	var previousArticle = ArticleContext.read()
	
	if (previousArticle != null) {
		alert('Poprzednia strona: ' + previousArticle + '.');
		ArticleContext.clear();
	};
};