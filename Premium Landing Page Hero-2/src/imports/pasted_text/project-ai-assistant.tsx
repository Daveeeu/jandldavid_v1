Turn the existing "AI Projekt Asszisztens" section into a production-ready interactive frontend.

Do NOT redesign the section from scratch.

Keep the existing visual style, layout, typography, colors and premium appearance.

The current component consists of:

* AI chat assistant on the left
* Project contact form on the right

The goal is to make the complete frontend logic functional now, so later only the backend / AI API endpoints need to be connected.

The component must no longer be a static mockup.

---

# 1. Form state

Create proper frontend state management for the form.

Fields:

Név

Email

Projekt rövid leírása

Optional choices:

AI segítsen pontosítani az igényeket

Szeretnék online konzultációt

Már van meglévő rendszerem

---

# 2. Existing system logic

When the user checks:

"Már van meglévő rendszerem"

dynamically reveal a new field underneath:

"Weboldal vagy rendszer címe"

Placeholder:

https://pelda.hu

The field should accept:

* website URLs
* application URLs
* domain names

If the checkbox is unchecked, hide the field again.

Use a smooth subtle animation when the field appears.

Do not create layout jumps.

---

# 3. AI assistant mode

When:

"AI segítsen pontosítani az igényeket"

is selected, the submitted project description should initialize the AI assistant.

Example:

User enters:

"Szeretnék egy előfizetéses sportplatformot."

The chat should automatically start with a contextual follow-up question.

Example:

"Milyen célközönségnek készülne a rendszer?"

The user can answer directly inside the chat.

The frontend must support a real multi-message conversation.

---

# 4. Chat architecture

Create reusable chat state.

Each message should contain:

id

role

content

timestamp

status

Possible roles:

user

assistant

system

The frontend should be ready for a backend endpoint such as:

POST /api/ai/project-assistant

Example request:

{
"messages": [...],
"project": {
"name": "",
"email": "",
"description": "",
"existingSystem": true,
"website": "",
"consultationRequested": false
}
}

Do not implement a fake AI algorithm.

Create a temporary mock service/interface that can later be replaced with the real backend API.

Clearly isolate the API layer from the UI components.

---

# 5. Conversation input

Add a real message input to the bottom of the AI chat.

Include:

text field

send button

Enter to send

Shift + Enter for newline

loading state

disabled state while the AI is responding

The chat should automatically scroll to the newest message.

---

# 6. AI loading state

When waiting for the backend response, show a subtle assistant typing indicator.

Example:

"Az asszisztens gondolkodik..."

Use animated dots.

Do not use fake instant responses in production architecture.

---

# 7. Error handling

Prepare proper UI states for:

network error

API unavailable

timeout

invalid response

Show friendly Hungarian messages.

Example:

"Most nem sikerült választ kérni az asszisztenstől. Próbáld újra néhány másodperc múlva."

Include a retry button.

---

# 8. Conversation logic

The future AI should be able to dynamically ask questions about:

* project goal
* target audience
* existing system
* current website
* required functionality
* authentication
* payments
* subscriptions
* admin system
* mobile application
* integrations
* expected traffic
* deadlines
* current technical stack
* existing problems
* hosting / infrastructure
* maintenance expectations

Do NOT hardcode these questions into the frontend.

The backend AI will decide which question is relevant.

The frontend should only render the conversation.

---

# 9. Project summary

The AI conversation should support a special response type:

project_summary

When received, render a premium summary card inside the chat.

Example structure:

Projekt célja

Célközönség

Fő funkciók

Meglévő rendszer

Technikai igények

Integrációk

Határidő

Egyéb megjegyzések

The summary card should match the existing dark AI interface.

At the bottom display:

"Összefoglaló kész"

and

"Küldésre kész"

---

# 10. Editing summary

Allow the user to continue the conversation even after the summary was created.

Example:

"Van még valami, amit hozzáadnál?"

The AI can regenerate/update the project summary based on later messages.

---

# 11. Lead submission

When the user presses:

"Küldd el az üzenetet"

collect:

name

email

project description

existing system status

existing system URL

consultation preference

complete AI conversation

generated project summary

UTM parameters if available

current page URL

Submit everything through one clean frontend service.

Prepare it for an endpoint such as:

POST /api/contact/project

---

# 12. Without AI

The form must also work without the AI assistant.

If the user does NOT enable:

"AI segítsen pontosítani az igényeket"

then simply submit the normal contact form.

The AI assistant should never be mandatory.

---

# 13. Existing system UX

If the user has an existing system, make this information especially useful for the future AI.

Example data:

existingSystem: true

existingSystemUrl: "https://example.hu"

The future backend may inspect this website, but DO NOT implement website scraping in the frontend.

Only collect and send the URL.

---

# 14. Form validation

Implement proper frontend validation.

Name:
required

Email:
required + valid email

Project description:
required

Existing system URL:
required only when "Már van meglévő rendszerem" is checked

Show inline validation messages in Hungarian.

Do not use browser alert dialogs.

---

# 15. Persistence

Prevent users from losing a partially completed project description accidentally.

Persist unfinished form/chat state locally using sessionStorage or localStorage.

If the visitor refreshes the page, restore the unfinished conversation.

After successful submission, clear the saved state.

---

# 16. Privacy

Do not store sensitive information unnecessarily.

Clearly separate analytics data from conversation content.

Do not send AI conversation text to Google Analytics.

Analytics should only receive anonymous interaction events.

---

# 17. Analytics events

Prepare events for the existing analytics layer:

project_form_start

project_existing_system_selected

project_ai_assistant_enabled

ai_chat_started

ai_message_sent

ai_summary_generated

consultation_selected

project_form_submit

project_form_success

project_form_error

Do not send:

names

email addresses

message contents

project descriptions

URLs entered by the user

or other personally identifiable information to GA4.

---

# 18. Component architecture

Refactor this section into reusable components.

Suggested structure:

ProjectContactSection

ProjectForm

ExistingSystemField

AIAssistant

ChatMessage

ChatInput

TypingIndicator

ProjectSummary

SubmissionStatus

Keep API/service logic separated from UI.

The frontend should be easy to connect later to a Go, Laravel, Node.js or other backend.

---

# 19. API abstraction

Create an API service abstraction.

For now use mock implementations.

Example:

aiProjectAssistant.sendMessage()

projectContact.submit()

Do not scatter fetch() calls across React components.

All networking should be centralized.

Later changing:

mock implementation

to

real production API

should require minimal changes.

---

# 20. Visual behavior

Keep the current premium interface.

Do not make it look like ChatGPT.

It should remain part of the Jandl Dávid – Technikai partner brand.

The AI assistant should feel like a professional project discovery tool, not a generic chatbot.

Use concise Hungarian interface text.

Maintain:

dark AI panel

green accent

light form card

existing border radius

existing shadows

existing typography

---

# Final goal

After this implementation the entire frontend should already work:

User enters project information

↓

Optional existing system URL appears

↓

Optional AI conversation starts

↓

User can really type messages

↓

Frontend sends messages through an isolated mock API service

↓

AI responses can be rendered

↓

Structured project summary can be displayed

↓

User submits the project

↓

Frontend sends one complete structured payload

The only missing component should be the real backend / AI implementation.

Do not leave static example conversation elements in the final production component unless they are clearly used as an initial onboarding demonstration.
