# 🦋 Duolingo Clone - Language Learning App

A modern language learning application inspired by Duolingo, built with React. Learn English with interactive exercises including multiple choice, fill-in-the-blank, typing, drag & drop, and word ordering.

## 🚀 Features

### 🎯 **Exercise Types**
- **Multiple Choice** - Select the correct answer from options
- **Fill-in-the-Blank** - Complete sentences with missing words
- **Translation** - Translate between Portuguese and English
- **Typing** - Practice spelling and word formation
- **Drag & Drop** - Build sentences by arranging words
- **Word Order** - Arrange words in correct sequence
- **Image Match** - Match images with corresponding words

### 📚 **Learning Content**
- **English Simple Present** module with 8 progressive lessons
- **Portuguese to English** translations
- **Grammar-focused** exercises (be verb, action verbs, third person)
- **Practical vocabulary** (greetings, family, food, daily routines)

### 🎮 **User Experience**
- **Interactive lesson map** with visual progress
- **Real-time feedback** on answers
- **XP points** and completion tracking
- **Responsive design** for mobile and desktop
- **Modern UI** with smooth animations

## 🛠️ Technologies Used

- **React 18** - Frontend framework
- **React Router** - Navigation and routing
- **Styled Components** - CSS-in-JS styling
- **React Context** - State management
- **React Confetti** - Celebration animations

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/gui/DuolingoDupe.git
   cd DuolingoDupe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser** and navigate to `http://localhost:3000`

## 🚀 Deployment

This project is configured for GitHub Pages deployment:

```bash
npm run deploy
```

## 📖 Usage

1. **Select Language** - Choose English from the language selection screen
2. **Choose Lesson** - Navigate through the lesson map
3. **Complete Exercises** - Answer questions using various interaction methods
4. **Track Progress** - Earn XP points and see your advancement

## 🏗️ Project Structure

```
src/
├── components/         # React components
│   ├── LanguageSelection.js
│   ├── LessonMap.js
│   ├── LessonInterface.js
│   ├── ResultsScreen.js
│   └── WelcomeScreen.js
├── context/           # React Context for state management
│   └── AppContext.js
├── data/              # Lesson data and content
│   └── lessonsData.js
├── App.js             # Main application component
└── index.js           # Application entry point
```

## 🎯 Current Lessons

### English Simple Present Module
1. **Greetings** - Basic introductions and hellos
2. **Family** - Family members and relationships  
3. **Be Verb** - Forms of "to be" (am, is, are)
4. **Action Verbs** - Common daily actions
5. **Questions** - Question formation with Simple Present
6. **Negatives** - Negative sentences
7. **Third Person** - He/she/it verb forms
8. **Food & Drinks** - Vocabulary and usage

## 🔜 Future Enhancements

- **Audio pronunciation** with speech synthesis
- **Listening exercises** with audio playback
- **Progress persistence** with local storage
- **More languages** (Spanish, French, German)
- **Advanced grammar** modules (Past Tense, Present Continuous)
- **User accounts** and cloud sync
- **Achievement system** and badges

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

Created by **gui** - A passionate developer building educational tools.

---

**🎓 Happy Learning!** Start your English journey today with interactive and engaging exercises! 