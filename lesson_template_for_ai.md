# Lulearn Lesson Template for AI Generation

This template is designed for Google Gemini or other AI assistants to generate lesson content for the Lulearn language learning application.

## Instructions for AI

When generating lessons, follow this exact JSON structure and guidelines:

### Target Audience
- Brazilian Portuguese speakers learning English
- Beginner to intermediate level
- Focus on practical, everyday English

### Lesson Structure

```json
{
  "id": null,
  "title": "Lesson Title Here",
  "description": "Brief description of what students will learn",
  "difficulty": "beginner|intermediate|advanced",
  "xp": 10,
  "exercises": [
    // Array of 8-12 exercises (see exercise types below)
  ]
}
```

### Exercise Types

#### 1. Multiple Choice
```json
{
  "id": 1,
  "type": "multiple-choice",
  "question": "What does 'apple' mean in Portuguese?",
  "options": ["Maçã", "Banana", "Laranja", "Uva"],
  "correctAnswer": 0,
  "explanation": "Apple in Portuguese is 'maçã'"
}
```

#### 2. Translation (English to Portuguese)
```json
{
  "id": 2,
  "type": "translation",
  "sentence": "I like apples",
  "correctAnswer": "Eu gosto de maçãs",
  "alternatives": ["Gosto de maçãs", "Eu gosto maçãs"],
  "hint": "Remember to use 'de' after 'gosto'"
}
```

#### 3. Translation (Portuguese to English)
```json
{
  "id": 3,
  "type": "translation",
  "sentence": "Ela está feliz",
  "correctAnswer": "She is happy",
  "alternatives": ["She's happy"],
  "hint": "Present tense of 'to be'"
}
```

#### 4. Fill in the Blank
```json
{
  "id": 4,
  "type": "fill-blank",
  "sentence": "I ___ going to the store",
  "options": ["am", "is", "are", "be"],
  "correctAnswer": 0,
  "translation": "Eu estou indo para a loja"
}
```

#### 5. Image Match
```json
{
  "id": 5,
  "type": "image-match",
  "word": "apple",
  "options": ["🍎", "🍌", "🍊", "🍇"],
  "correctAnswer": 0,
  "translation": "maçã"
}
```

#### 6. Typing Exercise
```json
{
  "id": 6,
  "type": "typing",
  "prompt": "Type in English:",
  "sentence": "Eu como uma maçã",
  "correctAnswer": "I eat an apple",
  "alternatives": ["I am eating an apple"],
  "hint": "Simple present tense"
}
```

#### 7. Drag and Drop
```json
{
  "id": 7,
  "type": "drag-drop",
  "sentence": "She is reading a book",
  "words": ["She", "is", "reading", "a", "book"],
  "translation": "Ela está lendo um livro"
}
```

#### 8. Word Order
```json
{
  "id": 8,
  "type": "word-order",
  "words": ["I", "love", "chocolate"],
  "correctOrder": [0, 1, 2],
  "translation": "Eu amo chocolate"
}
```

### Content Guidelines

1. **Progression**: Each lesson should build on previous concepts
2. **Vocabulary**: Introduce 5-8 new words per lesson
3. **Grammar**: Focus on one main grammar concept per lesson
4. **Culture**: Include cultural context when relevant
5. **Practical**: Use real-world scenarios and common phrases

### Exercise Distribution per Lesson

- 2-3 multiple choice questions
- 2-3 translation exercises (both directions)
- 1-2 fill-in-the-blank
- 1-2 typing exercises
- 1-2 drag-and-drop or word order
- 0-1 image match (for vocabulary lessons)

### Example Request Format

"Generate a lesson about [TOPIC] for Lulearn. Include vocabulary about [SPECIFIC WORDS], focusing on [GRAMMAR CONCEPT]. Make it appropriate for [LEVEL] learners."

Example: "Generate a lesson about 'Days of the Week and Time' for Lulearn. Include vocabulary about weekdays, time expressions, focusing on present tense questions with 'What day is it?' and 'What time is it?'. Make it appropriate for beginner learners."

### Quality Checklist

- [ ] All exercises have correct Portuguese translations
- [ ] Grammar explanations are clear and simple
- [ ] Vocabulary is relevant and practical
- [ ] Difficulty progression is appropriate
- [ ] Cultural context is accurate
- [ ] No offensive or inappropriate content

---

Copy this template and use it with your AI assistant to generate lesson content. Once you have the generated lesson, paste it back and I'll integrate it into Lulearn with proper lesson IDs and formatting! 