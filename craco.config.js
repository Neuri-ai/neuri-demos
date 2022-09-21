const path = require("path");
module.exports = {
	webpack: {
		alias: {
			'@': path.resolve(__dirname, "src/"),
			'components': path.resolve(__dirname, "src/components/"),
			'pages': path.resolve(__dirname, "src/pages/"),
			'images': path.resolve(__dirname, "src/assets/images/"),
			'css': path.resolve(__dirname, "src/assets/css/")
		}
	}
}