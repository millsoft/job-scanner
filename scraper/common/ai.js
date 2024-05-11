const OpenAI = require('openai');

/**
 * Check the job with AI
 */
class Ai {


    async checkWithAi() {
        console.log("Checking job with AI: ....???");

        const openai = new OpenAI();

        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: "You are a helpful assistant. You will response with a compliment" }],
            model: "gpt-3.5-turbo",
            max_tokens: 50,
        });

        console.log("AI response: ", completion.choices[0].message.content);

    }

    async askAssistant(question) {
            console.log("Checking job with Assistant: ....???");
    
            const openai = new OpenAI();
            const thread = await openai.beta.threads.create();

            const message = await openai.beta.threads.messages.create(thread.id, {
                role: 'user',
                content: question,
            })
    
            const run = await openai.beta.threads.runs.create(thread.id, {
                assistant_id: "asst_qv4crCJDczCDGrF8qUFNpWWs"
            })
    
            const checkRun = async () => {
                return new Promise((resolve, reject) => {
                    const interval = setInterval(async () => {
                        const retrieveRun = await openai.beta.threads.runs.retrieve(
                            thread.id,
                            run.id
                        )
    
                        console.log('Run status: ', retrieveRun.status)
    
                        if (retrieveRun.status === 'completed') {
                            console.log('Run completed: ', retrieveRun)
    
                            clearInterval(interval)
                            resolve(retrieveRun)
                        }
                    }, 2000)
                })
            }
    
            await checkRun()
    
            const messages = await openai.beta.threads.messages.list(thread.id)
    
            const answer = (messages.data ?? []).find((m) => m?.role === 'assistant')
                ?.content?.[0];
    
                try {
                const result = JSON.parse(answer.text.value);
                return result;
            } catch (error) {
                console.log("Error parsing JSON: ", error);
                return null;
            }
    
    }

}

module.exports = Ai;