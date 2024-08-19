import { useState } from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
	MainContainer,
	ChatContainer,
	MessageList,
	Message,
	MessageInput,
	TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import axios from "axios";
import toast from "react-hot-toast";

const API_KEY =
	"123";
// "Explain things like you would to a 10 year old learning how to code."
const systemMessage = {
	//  Explain things like you're talking to a software professional with 5 years of experience.
	role: "system",
	content:
		"Explain things like you're talking to a software professional with 2 years of experience.",
};

function ChatGPT() {
	const [messages, setMessages] = useState([
		{
			message: "Hello, I'm ChatGPT! Ask me anything!",
			sentTime: "just now",
			sender: "ChatGPT",
		},
	]);
	const [isTyping, setIsTyping] = useState(false);

	const handleSend = async (message) => {
		const newMessage = {
			message,
			direction: "outgoing",
			sender: "assistant",
		};

		const newMessages = [...messages, newMessage];

		setMessages(newMessages);

		// Initial system message to determine ChatGPT functionality
		// How it responds, how it talks, etc.
		setIsTyping(true);
		await processMessageToChatGPT(newMessages);
	};

	async function processMessageToChatGPT(chatMessages) {
		// Format messages for ChatGPT API
		let apiMessages = chatMessages.map((messageObject) => {
			let role =
				messageObject.sender === "ChatGPT" ? "assistant" : "user";
			return { role: role, content: messageObject.message };
		});

		// Get the request body set up with the model we plan to use
		const apiRequestBody = {
			model: "gpt-4o-mini",
			messages: [
				systemMessage, // The system message defines the logic of our ChatGPT
				...apiMessages, // The messages from our chat with ChatGPT
			],
		};

		try {
			const response = await axios.post(
				"https://api.openai.com/v1/chat/completions",
				apiRequestBody,
				{
					headers: {
						Authorization: `Bearer ${API_KEY}`,
						"Content-Type": "application/json",
					},
				}
			);

			// Handle the response and update the chat
			setMessages((prevMessages) => [
				...prevMessages,
				{
					message: response.data.choices[0].message.content,
					sender: "ChatGPT",
				},
			]);
			setIsTyping(false);
		} catch (error) {
			if (
				error.response &&
				error.response.data &&
				error.response.data.error
			) {
				const apiError = error.response.data.error;
				if (apiError.code === "insufficient_quota") {
					toast.error(
						"You have exceeded your current quota. Please check your plan and billing details."
					);
				} else {
					toast.error("Failed to send message: " + apiError.message);
				}
			} else {
				toast.error("Failed to send message! Please try again later.");
			}
			console.error("Error sending message to ChatGPT:", error);
			setIsTyping(false);
		}
	}

	return (
		<div className="ChatGPT">
			<div
				style={{
					position: "relative",
					height: "85vh",
					width: "100%",
				}}
			>
				<MainContainer>
					<ChatContainer>
						<MessageList
							className="py-2"
							scrollBehavior="smooth"
							typingIndicator={
								isTyping ? (
									<TypingIndicator content="ChatGPT is typing" />
								) : null
							}
						>
							{messages.map((message, i) => {
								console.log(message);
								return <Message key={i} model={message} />;
							})}
						</MessageList>
						<MessageInput
							placeholder="Type message here"
							onSend={handleSend}
						/>
					</ChatContainer>
				</MainContainer>
			</div>
		</div>
	);
}

export default ChatGPT;
