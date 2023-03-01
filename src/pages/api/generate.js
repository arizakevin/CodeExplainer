import * as dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config({ path:__dirname + '/.env' });

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// eslint-disable-next-line import/no-anonymous-default-export
export default async function(req, res) {
	if(!configuration.apiKey) {
		res.status(500).json({
			error: {
				message: "OpenAI API key not configured"
			}
		});
		return;
	}

	const code = req.body.code || '';
	if (code.trim().length === 0) {
		res.status(400).json({
			error: {
				message: "Please enter a valid code"
			}
		});
		return;
	};

	console.log(code);

	try {
		const response = await openai.createCompletion({
			// model: "code-davinci-002", //Explain code model
			model: "text-davinci-003",
			prompt: `Explain this code (Try to detect the programming language and/or framework used (E.g.: React.js) - If your level of certainty about the programming language is low, default to Javascript.): ${code}`,
			temperature: 0,
			max_tokens: 1500,
			top_p: 1,
			frequency_penalty: 0,
			presence_penalty: 0,
			stop: ["\"\"\""],
		});
		res.status(200).json({result: response.data.choices[0].text});
	} catch(error) {
		console.log(error);
		if(error.response) {
			// console.log(error(error.response.status, error.response.data));
			console.log(error.response.data);
			res.status(error.response.status).json(error.response.data);
		} else {
			console.error(`Error with OpenAI API request: ${error.message}`);
			res.status(500).json({
				error: {
					message: 'An error occured during your request'
				}
			});
		}
	}
};
