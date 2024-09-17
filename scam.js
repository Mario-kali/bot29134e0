<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Chatbot with Knowledge Base</title>
  <script>
    // Load Montserrat Font
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css?family=Montserrat&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    // Create and Inject Styles
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      /* Chat Bubble */
      #chatBubble {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 60px;
        height: 60px;
        background-image: url('https://static.wixstatic.com/media/72b42b_a1df2d29ee6c4694b548e939ea730be0~mv2.png');
        background-size: cover;
        background-position: center;
        border-radius: 50%;
        cursor: pointer;
        z-index: 1000;
        box-shadow: 0 0 4px 2px teal;
      }

      /* Chat Box */
      #chatBox {
        display: none;
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 350px;
        max-width: 90%;
        height: 400px;
        background-color: white;
        border-radius: 15px;
        z-index: 1001;
        overflow: hidden;
        flex-direction: column;
      }

      /* PC View Only: Add a dark shadow around the chat box */
      @media (min-width: 769px) {
        #chatBox {
          box-shadow: 0 0 100px 30px rgba(0, 0, 0, 0.9);
        }
      }

      /* Fullscreen Chat Box for Mobile */
      #chatBox.mobileFullscreen {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        border-radius: 0;
      }

      /* Header */
      #chatHeader {
        background-color: #dafffe; /* Teal color at full opacity */
        padding: 10px 15px;
        position: relative;
        display: flex;
        align-items: center;
        color: black;
        border-top-left-radius: 15px;
        border-top-right-radius: 15px;
        height: 60px;
        box-shadow: 0 6px 15px rgba(0, 0, 0, 0.4);
      }

      /* Agent Info */
      #agentInfo {
        flex-grow: 1;
      }

      #agentName {
        font-family: 'Montserrat', sans-serif;
        font-size: 18px;
        margin: 0;
        text-shadow: none;
      }

      #liveIndicator {
        font-family: 'Montserrat', sans-serif;
        font-size: 12px;
        color: #90ee90;
        background-color: black;
        border-radius: 12px;
        padding: 2px 8px;
        display: inline-block;
        margin-top: 3px;
        animation: pulse 1.5s infinite ease-in-out;
      }

      @keyframes pulse {
        0% {
          opacity: 1;
        }
        50% {
          opacity: 0.7;
        }
        100% {
          opacity: 1;
        }
      }

      /* Header Buttons */
      #headerButtons {
        display: flex;
        align-items: center;
      }

      .headerButton {
        background: none;
        border: none;
        color: black;
        font-size: 18px;
        cursor: pointer;
        margin-left: 10px;
      }

      /* Close Button */
      #closeButton {
        position: absolute;
        top: 10px;
        right: 15px;
        background: none;
        border: none;
        color: black;
        font-size: 20px;
        cursor: pointer;
      }

      /* Call Button */
      #callButton {
        position: absolute;
        top: 10px;
        right: 50px;
        background: none;
        border: none;
        color: black;
        font-size: 18px;
        width: 22px;
        height: 22px;
        cursor: pointer;
      }

      /* Messages */
      #chatMessages {
        flex-grow: 1;
        padding: 10px;
        overflow-y: auto;
        font-family: 'Montserrat', sans-serif;
        background-color: #fff;
      }

      /* Message styling */
      .messageContainer {
        display: flex;
        align-items: flex-start;
        margin-bottom: 10px;
        width: 100%;
      }

      .userMessageContainer {
        justify-content: flex-end;
        flex-direction: row-reverse;
      }

      .botMessageContainer {
        justify-content: flex-start;
      }

      .message {
        max-width: 70%;
        word-wrap: break-word;
        padding: 10px;
        border-radius: 10px;
        font-size: 13px;
      }

      .userMessage {
        background-color: #f0f0f0;
        margin-left: auto;
        text-align: right;
      }

      .botMessage {
        background-color: #d0e6ff;
        margin-right: auto;
        text-align: left;
      }

      /* Profile Icon */
      .profileIcon {
        width: 30px;
        height: 30px;
        margin: 0 10px;
        background-size: cover;
        border-radius: 50%;
      }

      .userProfileIcon {
        content: url('https://img.icons8.com/ios-filled/50/9400D3/user-male-circle.png');
      }

      .botProfileIcon {
        background-image: url('https://static.wixstatic.com/media/72b42b_a1df2d29ee6c4694b548e939ea730be0~mv2.png');
      }

      /* Option Buttons */
      .option-buttons {
        display: flex;
        flex-wrap: wrap;
        padding: 10px;
        margin: 0 10px;
        justify-content: flex-end;
      }

      .option-button {
        background-color: #dafffe;
        border-radius: 10px;
        padding: 5px 10px;
        cursor: pointer;
        font-family: 'Montserrat', sans-serif;
        font-size: 12px;
        margin: 5px;
        text-align: center;
        flex-grow: 0;
      }

      /* Input Field */
      #chatInputArea {
        padding: 10px;
        display: flex;
        align-items: center;
        border-top: 1px solid #ccc;
        border-bottom-left-radius: 15px;
        border-bottom-right-radius: 15px;
      }

      #chatInput {
        flex-grow: 1;
        border: 1px solid #ccc;
        border-radius: 25px;
        padding: 10px;
        font-family: 'Montserrat', sans-serif;
        outline: none;
        margin-right: 10px;
      }

      #sendButton {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #007bff;
      }

      /* Typing Indicator */
      #typingIndicator {
        display: none;
        align-items: center;
        margin-bottom: 10px;
      }

      .dot {
        height: 8px;
        width: 8px;
        background-color: #bbb;
        border-radius: 50%;
        display: inline-block;
        animation: blink 1.4s infinite both;
        margin-right: 4px;
      }

      .dot:nth-child(2) {
        animation-delay: 0.2s;
      }

      .dot:nth-child(3) {
        animation-delay: 0.4s;
      }

      @keyframes blink {
        0% {
          opacity: .2;
        }
        20% {
          opacity: 1;
        }
        100% {
          opacity: .2;
        }
      }
    `;
    document.head.appendChild(styleElement);

    // Chat Box and Bubble HTML
    const chatHTML = `
      <div id="chatBubble"></div>
      <div id="chatBox">
        <div id="chatHeader">
          <div id="agentInfo">
            <p id="agentName">Mentor Support</p>
            <p id="liveIndicator">● Live</p>
          </div>
          <button class="headerButton" id="callButton">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="22px" height="22px">
              <path d="M6.62 10.79a15.91 15.91 0 006.6 6.6l2.2-2.2a1.56 1.56 0 011.56-.39c1.2.3 2.49.46 3.82.46a1.56 1.56 0 011.56 1.56V21a1.56 1.56 0 01-1.56 1.56A15.95 15.95 0 013 4.56 1.56 1.56 0 014.56 3h3.12a1.56 1.56 0 011.56 1.56c0 1.33.16 2.62.46 3.82a1.56 1.56 0 01-.39 1.56l-2.2 2.2z"/>
            </svg>
          </button>
          <button class="headerButton" id="closeButton">✖</button>
        </div>
        <div id="chatMessages">
          <div id="typingIndicator">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
        </div>
        <!-- Option Buttons -->
        <div id="optionButtons" class="option-buttons">
          <div class="option-button" id="getDemo">Get A Demo</div>
          <div class="option-button" id="whatMentorDoes">What Does Mentor Do</div>
          <div class="option-button" id="earlyAdopter">What is Early Adopter</div>
        </div>
        <div id="chatInputArea">
          <input type="text" id="chatInput" placeholder="Type your message...">
          <button id="sendButton">➤</button>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', chatHTML);

    // Chat Elements
    const chatBubble = document.getElementById('chatBubble');
    const chatBox = document.getElementById('chatBox');
    const closeButton = document.getElementById('closeButton');
    const callButton = document.getElementById('callButton');
    const sendButton = document.getElementById('sendButton');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    const typingIndicator = document.getElementById('typingIndicator');
    const optionButtons = document.getElementById('optionButtons');
    const getDemoButton = document.getElementById('getDemo');
    const whatMentorDoesButton = document.getElementById('whatMentorDoes');
    const earlyAdopterButton = document.getElementById('earlyAdopter');

    let initialMessagesShown = false;  // Flag to check if initial messages are shown

    // Detect mobile devices
    function isMobileDevice() {
      return window.innerWidth <= 768;
    }

    // Show Chat Box and display initial messages only once
    chatBubble.addEventListener('click', () => {
      if (isMobileDevice()) {
        chatBox.classList.add('mobileFullscreen'); // Fullscreen on mobile
      }
      chatBox.style.display = 'flex';
      if (!initialMessagesShown) {
        showTypingIndicator();
        initialMessagesShown = true;
      }
    });

    // Close Chat Box
    closeButton.addEventListener('click', () => {
      chatBox.style.display = 'none';
      chatBox.classList.remove('mobileFullscreen');
    });

    // Call Button
    callButton.addEventListener('click', () => {
      window.location.href = 'tel:+14256155569';
    });

    // Fetch the text file from GitHub
    async function fetchTextFile(url) {
      try {
        const response = await fetch(url);
        const text = await response.text();
        return text.split('\n');  // Split by lines or paragraphs depending on your data
      } catch (error) {
        console.error("Error fetching the text file:", error);
        return [];
      }
    }

    // URL of the raw text file from your GitHub repository
    const fileUrl = 'https://raw.githubusercontent.com/Mario-kali/B23155O82T82BRA87IN/8172e1941d982e004c2b93d8398dcb4bb5f3bb56/MASON%20DATA%20BASE.txt';

    // Fetch the text file and store it in textChunks
    let textChunks = [];
    fetchTextFile(fileUrl).then(chunks => {
      textChunks = chunks;
      console.log("Loaded text from the knowledge base:", textChunks);
    });

    // Show typing indicator and initial message
    function showTypingIndicator() {
      typingIndicator.style.display = 'flex';
      chatMessages.scrollTop = chatMessages.scrollHeight;

      setTimeout(() => {
        displayMessage("Hi, this is the Mentor Support AI chat. I can help you with booking a call, navigating the site, or getting more general information about Mentor!", 'botMessage', 'bot');
        typingIndicator.style.display = 'none';

        setTimeout(() => {
          displayMessage("How can I help you today?", 'botMessage', 'bot');
        }, 1000);
      }, 2000);
    }

    // Send Message
    sendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });

    // Option button actions
    getDemoButton.addEventListener('click', () => {
      handleOptionClick("I'd like to get a demo, please.");
    });

    whatMentorDoesButton.addEventListener('click', () => {
      handleOptionClick("What does Mentor do?");
    });

    earlyAdopterButton.addEventListener('click', () => {
      handleOptionClick("What is Early Adopter?");
    });

    function handleOptionClick(message) {
      displayMessage(message, 'userMessage', 'user');
      optionButtons.style.display = 'none'; // Hide the bubbles after a click
      getBotResponse(message);
    }

    function sendMessage() {
      const message = chatInput.value.trim();
      if (message === '') return;
      displayMessage(message, 'userMessage', 'user');
      chatInput.value = '';
      getBotResponse(message);
    }

    function displayMessage(message, className, senderType) {
      const messageContainer = document.createElement('div');
      const profileIcon = document.createElement('div');
      profileIcon.classList.add('profileIcon');

      if (senderType === 'user') {
        messageContainer.classList.add('messageContainer', 'userMessageContainer');
        profileIcon.classList.add('userProfileIcon');
      } else {
        messageContainer.classList.add('messageContainer', 'botMessageContainer');
        profileIcon.classList.add('botProfileIcon');
      }

      const messageElem = document.createElement('div');
      messageElem.className = `message ${className}`;
      messageElem.textContent = message;

      // Append profile icon and message
      messageContainer.appendChild(profileIcon);
      messageContainer.appendChild(messageElem);
      chatMessages.insertBefore(messageContainer, typingIndicator);

      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Get bot response based on the text from the knowledge base and OpenAI
    async function getBotResponse(userMessage) {
      typingIndicator.style.display = 'flex';

      try {
        // Filter text chunks to find relevant ones
        const relevantText = textChunks.filter(chunk => chunk.toLowerCase().includes(userMessage.toLowerCase()));

        // If relevant text is found, include it in the system message for ChatGPT
        const systemMessage = `
          You are Mentor Support, a friendly and professional assistant.
          Here is some useful information from the document to help answer the user's question:
          ${relevantText.join('\n')}
        `;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer YOUR_OPENAI_API_KEY',  // Replace with your OpenAI API key
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'gpt-4',
            messages: [
              { role: 'system', content: systemMessage },
              { role: 'user', content: userMessage }
            ],
            max_tokens: 150,
            temperature: 0.7
          })
        });

        const data = await response.json();
        typingIndicator.style.display = 'none';
        displayMessage(data.choices[0].message.content.trim(), 'botMessage', 'bot');
      } catch (error) {
        typingIndicator.style.display = 'none';
        displayMessage("Sorry, something went wrong.", 'botMessage', 'bot');
        console.error(error);
      }
    }
  </script>
</head>
<body>
</body>
</html>
