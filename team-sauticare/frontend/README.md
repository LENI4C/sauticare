# SautiCare Frontend

A modern, accessible mental health chatbot built with Next.js, React, and TailwindCSS.

## Features

-   🎨 **Calming Design**: Carefully crafted color palette and typography for mental health support
-   ♿ **Accessible**: WCAG compliant with screen reader support and keyboard navigation
-   📱 **Responsive**: Works seamlessly on desktop, tablet, and mobile devices
-   💬 **Real-time Chat**: Smooth message animations and typing indicators
-   🎤 **Voice Input**: Ready for voice recording integration (placeholder implemented)
-   🔒 **Privacy Focused**: Clear privacy indicators and secure messaging

## Getting Started

### Prerequisites

-   Node.js 18+
-   npm or yarn

### Installation

1. Navigate to the frontend directory:

    ```bash
    cd team-sauticare/frontend
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Start the development server:

    ```bash
    npm run dev
    ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
frontend/
├── app/                    # Next.js 13+ app directory
│   ├── globals.css        # Global styles and TailwindCSS
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Home page
├── components/            # Reusable React components
│   ├── ChatContainer.tsx  # Main chat interface
│   ├── ChatWindow.tsx     # Message display area
│   ├── Header.tsx         # App header with logo
│   ├── InputBox.tsx       # Message input and send
│   └── MessageBubble.tsx  # Individual message component
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # TailwindCSS configuration
├── tsconfig.json          # TypeScript configuration
└── next.config.js         # Next.js configuration
```

## Components

### ChatContainer

The main container that orchestrates the entire chat experience, managing message state and bot responses.

### ChatWindow

Displays the conversation history with smooth scrolling and welcome message for new users.

### MessageBubble

Individual message component with user/bot styling, timestamps, and typing indicators.

### InputBox

Message input with textarea auto-resize, voice recording button, and accessibility features.

### Header

App header with SautiCare branding and privacy indicators.

## Styling

The app uses a carefully designed color palette optimized for mental health applications:

-   **Primary**: Calming blues for trust and stability
-   **Secondary**: Neutral grays for readability
-   **Accent**: Soft purples for warmth and compassion
-   **Success/Warning**: Green and amber for positive feedback

## Accessibility Features

-   Screen reader support with proper ARIA labels
-   Keyboard navigation support
-   High contrast ratios for readability
-   Focus indicators for keyboard users
-   Semantic HTML structure
-   Alternative text for icons and images

## Future Enhancements

-   [ ] AI/ML integration for intelligent responses
-   [ ] Voice recording and speech-to-text
-   [ ] Mood tracking and analytics
-   [ ] Resource library integration
-   [ ] Multi-language support
-   [ ] Dark mode toggle
-   [ ] Message history persistence
-   [ ] Crisis intervention protocols

## Contributing

1. Follow the existing code style and component structure
2. Ensure accessibility standards are maintained
3. Test on multiple devices and screen sizes
4. Update documentation for new features

## License

This project is part of the SautiCare mental health initiative.
