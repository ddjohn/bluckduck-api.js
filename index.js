import debug from 'debug';
const log = debug('index.js');

log('loading...');

import got from 'got';

export class BlackDuckAPI {

	constructor(api, token)  {
		this._api    = api;
		this._token  = token;
		this._bearer = '';
	}

	async getBearer() {
		try {
			const result = await got.post(this._api + '/tokens/authenticate', {
				headers: {
					Authorization: 'token ' + this._token,
					Accept: 'application/vnd.blackducksoftware.user-4+json'
				},
				https: {
					rejectUnauthorized: false 
				}
			});

			const json = JSON.parse(result.body);

			log('bearer', json);
			this._bearer = json.bearerToken;

			return json;
		}
		catch(error) {
			log('error', error);
		}
    }
    
    async getProjects(query) {
		try {
			const result = await got.get(this._api + '/projects?limit=9999&q=' + query, {
				headers: {
					Authorization: 'Bearer ' + this._bearer,
					Accept: 'application/vnd.blackducksoftware.project-detail-4+json'
				},
				https: {
					rejectUnauthorized: false 
				}
			});

			const json = JSON.parse(result.body);
			log('projects', json.totalCount);

			return json.items;
		}
		catch(error) {
			log('error', error);
		}
    }
}

export class BlackDuckReports {
	
	static projectReports(projects) {
		projects.forEach((project) => {
			this.projectReport(project);
		});
	}

	static projectReport(project) {
		console.log('project>', project.name.padEnd(60), project.createdAt.padEnd(30), project.createdBy.padEnd(10));
	}
}
