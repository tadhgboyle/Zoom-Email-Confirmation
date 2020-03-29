const env = process.env.NODE_ENV || 'production'

const config = {
	development: {
		APIKey: '',
		APISecret: '',
		mail: {
			host: "",
			port: 465,
			secure: true,
			username: "",
			password: "",
			from: "",
			subject: ""
		}
	},
	production: {
		APIKey: '',
		APISecret: '',
		mail: {
			host: "",
			port: 465,
			secure: true,
			username: "",
			password: "",
			from: "",
			subject: ""
		}
	}
};

module.exports = config[env]
