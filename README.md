This README provides a comprehensive guide to building and integrating a custom AI Chat Agent using the **MirrorFly AI-RAG** platform.

---

# MirrorFly AI Chat Agent Integration

Build and integrate fully customizable AI Chat agents for the web using the MirrorFly AI-RAG dashboard and SDK. This solution supports real-time audio streaming, external knowledge base training (RAG), and a no-code workflow builder.

## 🚀 Overview

The implementation is divided into two primary phases:

1. **Agent Creation:** Configuring the agent's personality, training it with datasets, and designing conversational flows in the MirrorFly dashboard.


2. **Agent Integration:** Embedding the agent into your web application using the MirrorFly AI SDK.



---

## 🛠 Part I: Agent Creation

### 1. Initial Setup

* **Access:** Obtain developer credentials from the MirrorFly team and log into the [MirrorFly AI Dashboard](https://ragchat.contus.us/).
  ![MirrorFly Dashboard](./images/AI%20Voice%20Agent-Product-01.png)

* **Create Agent:** Click **'Create Agents'** and select **'Chat Agent'**.

![MirrorFly Dashboard](./images/AI%20Voice%20Agent-Product-02.png)
* **Configuration:** Provide an agent name, description, and define the initial **System Prompt** to set core behavior.

![MirrorFly Dashboard](./images/AI%20Voice%20Agent-Product-03.png)

### 2. Personality & Model Settings

* **Personality:** Set the welcome message, fallback responses, and adjust the formality and tone.


* **Model Selection:** Choose from multiple available AI models to power your agent.

![MirrorFly Dashboard](./images/AI%20Voice%20Agent-Product-04.png)

### 3. Training with RAG (Retrieval-Augmented Generation)

* **Datasets:** Upload knowledge bases in **PDF** or **CSV** format (Max 5MB/10 files) to provide the agent with specific domain knowledge.


* **Website Sync:** Alternatively, sync information directly from a URL to keep the agent updated with your website content.

![MirrorFly Dashboard](./images/AI%20Voice%20Agent-Product-06.png)

### 4. Workflow Builder

Use the visual drag-and-drop canvas to define:

* Conversational paths and decision logic.


* API calls and form collection.


* Email triggers and message nodes.

---

## 💻 Part II: Agent Integration

### Prerequisites

* Valid **Agent ID** from the dashboard.


* Website must run on **HTTPS** for microphone access.


* Supported Browsers: Latest versions of Chrome, Edge, and Safari.



### 1. Install the SDK





### 2. Initialize the Agent

Define a container element and initialize the SDK:

```javascript
// HTML Container
<div className="content" id="chatbot-root"></div>

// Initialization
    const script = document.createElement("script");
    script.src =
      "./build/chatbot_sdk.js?key=GY4GKNDGMM4GMNZXHBRTEOJRG43DQNZWGE3TANQ=&apiUrl=https://ragqa-chat.contus.us/rag-api";
    script.async = true;

    script.onload = () => {
      if (window.MirrorFlyAi) {
        // Initialize SDK once into a single shared container
        window.MirrorFlyAi.init({
          container: "#chatbot-root",
          ...getSdkOptions(),
        });
      }
    };
    document.body.appendChild(script);

```






### 4. Dynamic Agent Switching

If your platform uses multiple agents (e.g., Sales vs. Support), use the following to switch contexts:

```javascript
function switchAgent(newAgentId) {
  MirrorFlyAi.destroy();
  document.querySelector("#widget").innerHTML = "";
  MirrorFlyAi.init({
    container: "#widget",
    agentId: newAgentId,
    triggerStartCall: true
  });
}

```



---

## 🛡 Security & Permissions

The browser will prompt the user for microphone permission upon initialization. Ensure you handle potential errors via the `onError` callback, such as permission denials or network issues.


## **🤹 Key Product Offerings**

* [Conversational AI Agents](https://www.mirrorfly.com/conversational-ai/)  
* [White-label AI Chat agents](https://www.mirrorfly.com/conversational-ai/chat-agent/)  
* [Custom Chatbots](https://www.mirrorfly.com/conversational-ai/chatbot/)  
* [500+ AI Features](https://www.mirrorfly.com/conversational-ai/features/)  
* [Real-time Chat](https://www.mirrorfly.com/chat-api-solution.php)  
* [HD Video Call](https://www.mirrorfly.com/video-call-solution.php)   


## **☁️ Deployment Models \- Self-hosted and Cloud**

MirrorFly offers full freedom with the hosting options:

**Self-hosted:** Deploy your client on your own data centers, private cloud or third-party servers.  
[Check out our multi-tenant cloud hosting](https://www.mirrorfly.com/self-hosted-chat-solution.php)  

**Cloud:** Host your client on MirrorFly’s multi-tenant cloud servers.   
[Check out our multi-tenant cloud hosting](https://www.mirrorfly.com/multi-tenant-chat-for-saas.php)


# **📚 Learn More**

* [MirrorFly AI Chat Agents](https://www.mirrorfly.com/conversational-ai/chat-agent/)  
* [MirrorFly AI Chatbots](https://www.mirrorfly.com/conversational-ai/chatbot/)  
* [MirrorFly SDKs](https://www.mirrorfly.com/chat/sdk/)  
* [MirrorFly API Documentation](https://www.mirrorfly.com/docs/)  
* [Product Tutorials](https://www.mirrorfly.com/tutorials/)  
* [See who's using MirrorFly](https://www.mirrorfly.com/chat-use-cases.php)

# **🧑‍💻 Hire Experts**

Need a tech team to build your AI Chat agents and chatbots? [Hire a full team of experts](https://www.mirrorfly.com/hire-video-chat-developer.php). Let our team handle every step of the development process. Get a high-quality, fully-built Ai agents ready to launch, carefully built by industry experts

# **⏱️ Round-the-clock Support**

If you’d like to take help when working with our solution, feel free to [contact our experts](https://www.mirrorfly.com/contact-sales.php) who will be available to help you anytime of the day or night. 

## **💼 Become a Part of our amazing team**

We're always on the lookout for talented developers, support specialists, and product managers. Visit our [careers page](https://www.contus.com/careers.php) to explore current opportunities.

## **🗞️ Get the Latest Updates**

* [Blog](https://www.mirrorfly.com/blog/)  
* [Facebook](https://www.facebook.com/MirrorFlyofficial/)  
* [Twitter](https://twitter.com/mirrorflyteam)  
* [LinkedIn](https://www.linkedin.com/showcase/mirrorfly-official/)  
* [Youtube](https://www.youtube.com/@mirrorflyofficial)  
* [Instagram](https://www.instagram.com/mirrorflyofficial/)