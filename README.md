# Project Philo - Simple AI Interview Platform

A clean, simple chat interface for AI model interviews where each user brings their own OpenRouter API key.

## Features

✨ **Simple**: Just paste your API key and start chatting  
🔑 **Secure**: Your API key stays in your browser  
💾 **Download**: Save conversations as JSON files  
🚀 **Fast**: No backend needed - direct to OpenRouter  
📱 **Responsive**: Works on desktop and mobile  

## How to Use

1. **Get a temporary OpenRouter API key**
   - Create a key with limited credits ($1-2 is plenty)
   - Share with your collaborators

2. **Open the website**
   - Go to the deployed site
   - Or open `index.html` locally

3. **Paste your API key**
   - Enter your OpenRouter key
   - It's saved in your browser for convenience

4. **Start interviewing!**
   - Chat with the AI model (qwen/qwen3-coder)
   - Download conversations when done

## Deploy Options

### Option 1: GitHub Pages (Recommended)
1. Fork or create a new repo with these files
2. Enable GitHub Pages in Settings
3. Share the URL with your team

### Option 2: Local File
1. Download the files
2. Open `index.html` in a browser
3. Works completely offline!

### Option 3: Any Static Host
- Vercel, Netlify, Surge.sh
- Or any web server

## For Collaborators

When you share with team members, they need:
1. The website URL (or files)
2. Their own OpenRouter API key

That's it! No passwords, no complex setup.

## Technical Details

- **Model**: qwen/qwen3-coder (via Fireworks provider)
- **No backend**: Direct browser-to-OpenRouter connection
- **Privacy**: API keys never leave the browser
- **Storage**: Conversations downloadable as JSON

## Files

- `index.html` - Main interface
- `app.js` - Application logic
- `styles.css` - Styling
- `README.md` - This file

## License

Free to use for research purposes.