export const languages = [
  {
    id: 'english',
    name: 'English for Portuguese Speakers',
    flag: '🇺🇸',
    nativeName: 'Inglês para Brasileiros'
  }
];

export const lessons = {
  english: [
    {
      id: 1,
      title: 'Basic Greetings - Cumprimentos Básicos',
      description: 'Learn essential English greetings (Aprenda cumprimentos essenciais em inglês)',
      difficulty: 'beginner',
      xp: 10,
      exercises: [
        {
          id: 1,
          type: 'multiple-choice',
          question: 'How do you say "Olá" in English?',
          correctAnswer: 'Hello',
          options: ['Hello', 'Goodbye', 'Thank you', 'Please'],
          audio: null
        },
        {
          id: 2,
          type: 'multiple-choice',
          question: 'What does "Good morning" mean? (O que significa "Good morning"?)',
          correctAnswer: 'Bom dia',
          options: ['Bom dia', 'Boa tarde', 'Boa noite', 'Tchau'],
          audio: null
        },
        {
          id: 3,
          type: 'translation',
          question: 'Translate to English: "Obrigado"',
          correctAnswer: 'Thank you',
          options: ['Thank you', 'Please', 'Sorry', 'Excuse me'],
          audio: null
        },
        {
          id: 4,
          type: 'multiple-choice',
          question: 'How do you say "Tchau" in English?',
          correctAnswer: 'Goodbye',
          options: ['Hello', 'Goodbye', 'Please', 'Sorry'],
          audio: null
        },
        {
          id: 5,
          type: 'fill-blank',
          question: 'Complete the greeting: "Good ___!" (Boa tarde!)',
          correctAnswer: 'afternoon',
          options: ['morning', 'afternoon', 'evening', 'night'],
          audio: null
        },
        {
          id: 6,
          type: 'multiple-choice',
          question: 'What do you say when someone says "Thank you"? (O que você responde quando alguém diz "Thank you"?)',
          correctAnswer: "You're welcome",
          options: ["You're welcome", 'Hello', 'Goodbye', 'Please'],
          audio: null
        },
        {
          id: 7,
          type: 'translation',
          question: 'Translate to English: "Com licença"',
          correctAnswer: 'Excuse me',
          options: ['Excuse me', 'Sorry', 'Thank you', 'Please'],
          audio: null
        },
        {
          id: 8,
          type: 'typing',
          question: 'Type this greeting in English: "Como você está?" (How are you?)',
          correctAnswer: 'How are you',
          options: [],
          audio: null
        },
        {
          id: 9,
          type: 'drag-drop',
          question: 'Build the sentence: "Good morning, how are you?" (Bom dia, como você está?)',
          correctAnswer: 'Good morning, how are you?',
          words: ['Good', 'morning,', 'how', 'are', 'you?'],
          options: [],
          audio: null
        }
      ]
    },
    {
      id: 2,
      title: 'Personal Pronouns - Pronomes Pessoais',
      description: 'Learn I, you, he, she, it, we, they (Aprenda eu, você, ele, ela, etc.)',
      difficulty: 'beginner',
      xp: 12,
      exercises: [
        {
          id: 1,
          type: 'multiple-choice',
          question: 'How do you say "EU" in English?',
          correctAnswer: 'I',
          options: ['I', 'You', 'He', 'She'],
          audio: null
        },
        {
          id: 2,
          type: 'multiple-choice',
          question: 'What does "She" mean? (O que significa "She"?)',
          correctAnswer: 'Ela',
          options: ['Ele', 'Ela', 'Nós', 'Eles'],
          audio: null
        },
        {
          id: 3,
          type: 'fill-blank',
          question: 'Complete: "___ am Brazilian." (Eu sou brasileiro)',
          correctAnswer: 'I',
          options: ['I', 'You', 'He', 'She'],
          audio: null
        },
        {
          id: 4,
          type: 'multiple-choice',
          question: 'How do you say "NÓS" in English?',
          correctAnswer: 'We',
          options: ['We', 'They', 'You', 'It'],
          audio: null
        },
        {
          id: 5,
          type: 'fill-blank',
          question: 'Complete: "___ are from São Paulo." (Eles são de São Paulo)',
          correctAnswer: 'They',
          options: ['They', 'We', 'You', 'It'],
          audio: null
        },
        {
          id: 6,
          type: 'multiple-choice',
          question: 'What does "It" refer to? (A que se refere "It"?)',
          correctAnswer: 'Objects and animals',
          options: ['Objects and animals', 'Only people', 'Only women', 'Only men'],
          audio: null
        },
        {
          id: 7,
          type: 'translation',
          question: 'Choose the correct pronoun: "VOCÊ" in English is...',
          correctAnswer: 'You',
          options: ['You', 'I', 'We', 'They'],
          audio: null
        }
      ]
    },
    {
      id: 3,
      title: 'Verb TO BE - Verbo SER/ESTAR',
      description: 'Learn am, is, are (Aprenda am, is, are)',
      difficulty: 'beginner',
      xp: 15,
      exercises: [
        {
          id: 1,
          type: 'multiple-choice',
          question: 'Complete: "I ___ happy." (Eu estou feliz)',
          correctAnswer: 'am',
          options: ['am', 'is', 'are'],
          audio: null
        },
        {
          id: 2,
          type: 'multiple-choice',
          question: 'Complete: "She ___ a teacher." (Ela é professora)',
          correctAnswer: 'is',
          options: ['am', 'is', 'are'],
          audio: null
        },
        {
          id: 3,
          type: 'fill-blank',
          question: 'Complete: "We ___ students." (Nós somos estudantes)',
          correctAnswer: 'are',
          options: ['am', 'is', 'are'],
          audio: null
        },
        {
          id: 4,
          type: 'multiple-choice',
          question: 'Complete: "They ___ from Brazil." (Eles são do Brasil)',
          correctAnswer: 'are',
          options: ['am', 'is', 'are'],
          audio: null
        },
        {
          id: 5,
          type: 'fill-blank',
          question: 'Complete: "The book ___ on the table." (O livro está na mesa)',
          correctAnswer: 'is',
          options: ['am', 'is', 'are'],
          audio: null
        },
        {
          id: 6,
          type: 'multiple-choice',
          question: 'Choose the negative form: "I ___ not tired." (Eu não estou cansado)',
          correctAnswer: 'am',
          options: ['am', 'is', 'are'],
          audio: null
        },
        {
          id: 7,
          type: 'translation',
          question: 'Complete the question: "___ you ready?" (Você está pronto?)',
          correctAnswer: 'Are',
          options: ['Am', 'Is', 'Are'],
          audio: null
        },
        {
          id: 8,
          type: 'word-order',
          question: 'Put the words in correct order: "She is a teacher" (Ela é professora)',
          correctAnswer: 'She is a teacher',
          words: ['teacher', 'She', 'a', 'is'],
          options: [],
          audio: null
        }
      ]
    },
    {
      id: 4,
      title: 'Basic Vocabulary - Vocabulário Básico',
      description: 'Common words and objects (Palavras e objetos comuns)',
      difficulty: 'beginner',
      xp: 15,
      exercises: [
        {
          id: 1,
          type: 'image-match',
          question: 'What is this in English? (O que é isto em inglês?) 🏠',
          correctAnswer: 'house',
          options: [
            { id: 'house', text: '🏠', label: 'House' },
            { id: 'car', text: '🚗', label: 'Car' },
            { id: 'book', text: '📚', label: 'Book' },
            { id: 'phone', text: '📱', label: 'Phone' }
          ],
          audio: null
        },
        {
          id: 2,
          type: 'multiple-choice',
          question: 'How do you say "LIVRO" in English?',
          correctAnswer: 'Book',
          options: ['Book', 'Car', 'House', 'Phone'],
          audio: null
        },
        {
          id: 3,
          type: 'translation',
          question: 'Translate to English: "Carro"',
          correctAnswer: 'Car',
          options: ['Car', 'House', 'Book', 'Water'],
          audio: null
        },
        {
          id: 4,
          type: 'multiple-choice',
          question: 'What does "Water" mean? (O que significa "Water"?)',
          correctAnswer: 'Água',
          options: ['Água', 'Comida', 'Casa', 'Carro'],
          audio: null
        },
        {
          id: 5,
          type: 'image-match',
          question: 'What is this? (O que é isto?) 📱',
          correctAnswer: 'phone',
          options: [
            { id: 'phone', text: '📱', label: 'Phone' },
            { id: 'computer', text: '💻', label: 'Computer' },
            { id: 'table', text: '🪑', label: 'Chair' },
            { id: 'door', text: '🚪', label: 'Door' }
          ],
          audio: null
        },
        {
          id: 6,
          type: 'translation',
          question: 'Translate to English: "Mesa"',
          correctAnswer: 'Table',
          options: ['Table', 'Chair', 'Window', 'Door'],
          audio: null
        },
        {
          id: 7,
          type: 'multiple-choice',
          question: 'How do you say "JANELA" in English?',
          correctAnswer: 'Window',
          options: ['Window', 'Door', 'Wall', 'Floor'],
          audio: null
        }
      ]
    },
    {
      id: 5,
      title: 'Numbers 1-10 - Números 1-10',
      description: 'Learn basic numbers in English (Aprenda números básicos em inglês)',
      difficulty: 'beginner',
      xp: 12,
      exercises: [
        {
          id: 1,
          type: 'multiple-choice',
          question: 'How do you say "UM" in English?',
          correctAnswer: 'One',
          options: ['One', 'Two', 'Three', 'Four'],
          audio: null
        },
        {
          id: 2,
          type: 'multiple-choice',
          question: 'What number is "Five"? (Que número é "Five"?)',
          correctAnswer: '5',
          options: ['3', '4', '5', '6'],
          audio: null
        },
        {
          id: 3,
          type: 'fill-blank',
          question: 'Complete: "I have ___ hands." (Eu tenho duas mãos)',
          correctAnswer: 'two',
          options: ['one', 'two', 'three', 'four'],
          audio: null
        },
        {
          id: 4,
          type: 'translation',
          question: 'Translate to English: "Dez"',
          correctAnswer: 'Ten',
          options: ['Eight', 'Nine', 'Ten', 'Seven'],
          audio: null
        },
        {
          id: 5,
          type: 'fill-blank',
          question: 'Complete: "There are ___ days in a week." (Há sete dias em uma semana)',
          correctAnswer: 'seven',
          options: ['six', 'seven', 'eight', 'nine'],
          audio: null
        },
        {
          id: 6,
          type: 'multiple-choice',
          question: 'How do you say "ZERO" in English?',
          correctAnswer: 'Zero',
          options: ['Zero', 'One', 'Two', 'None'],
          audio: null
        },
        {
          id: 7,
          type: 'translation',
          question: 'What number comes after eight? (Que número vem depois de oito?)',
          correctAnswer: 'Nine',
          options: ['Seven', 'Eight', 'Nine', 'Ten'],
          audio: null
        }
      ]
    },
    {
      id: 6,
      title: 'Colors & Adjectives - Cores e Adjetivos',
      description: 'Learn basic colors and descriptive words (Aprenda cores básicas e palavras descritivas)',
      difficulty: 'beginner',
      xp: 14,
      exercises: [
        {
          id: 1,
          type: 'image-match',
          question: 'What color is this? (Que cor é esta?) 🔴',
          correctAnswer: 'red',
          options: [
            { id: 'red', text: '🔴', label: 'Red' },
            { id: 'blue', text: '🔵', label: 'Blue' },
            { id: 'green', text: '🟢', label: 'Green' },
            { id: 'yellow', text: '🟡', label: 'Yellow' }
          ],
          audio: null
        },
        {
          id: 2,
          type: 'multiple-choice',
          question: 'How do you say "AZUL" in English?',
          correctAnswer: 'Blue',
          options: ['Blue', 'Red', 'Green', 'Yellow'],
          audio: null
        },
        {
          id: 3,
          type: 'multiple-choice',
          question: 'Complete: "The car is ___." (O carro é grande)',
          correctAnswer: 'big',
          options: ['big', 'small', 'red', 'fast'],
          audio: null
        },
        {
          id: 4,
          type: 'translation',
          question: 'Translate to English: "Pequeno"',
          correctAnswer: 'Small',
          options: ['Small', 'Big', 'Beautiful', 'Old'],
          audio: null
        },
        {
          id: 5,
          type: 'image-match',
          question: 'What color is this? (Que cor é esta?) ⚫',
          correctAnswer: 'black',
          options: [
            { id: 'black', text: '⚫', label: 'Black' },
            { id: 'white', text: '⚪', label: 'White' },
            { id: 'purple', text: '🟣', label: 'Purple' },
            { id: 'orange', text: '🟠', label: 'Orange' }
          ],
          audio: null
        },
        {
          id: 6,
          type: 'multiple-choice',
          question: 'Complete: "The house is ___." (A casa é bonita)',
          correctAnswer: 'beautiful',
          options: ['beautiful', 'ugly', 'fast', 'slow'],
          audio: null
        },
        {
          id: 7,
          type: 'fill-blank',
          question: 'Complete: "My car is ___." (Meu carro é velho)',
          correctAnswer: 'old',
          options: ['old', 'new', 'fast', 'big'],
          audio: null
        }
      ]
    },
    {
      id: 7,
      title: 'Family Members - Membros da Família',
      description: 'Learn family relationships (Aprenda relações familiares)',
      difficulty: 'beginner',
      xp: 16,
      exercises: [
        {
          id: 1,
          type: 'multiple-choice',
          question: 'How do you say "MÃE" in English?',
          correctAnswer: 'Mother',
          options: ['Mother', 'Father', 'Sister', 'Brother'],
          audio: null
        },
        {
          id: 2,
          type: 'image-match',
          question: 'Who is this? (Quem é este?) 👨',
          correctAnswer: 'father',
          options: [
            { id: 'father', text: '👨', label: 'Father' },
            { id: 'mother', text: '👩', label: 'Mother' },
            { id: 'son', text: '👦', label: 'Son' },
            { id: 'daughter', text: '👧', label: 'Daughter' }
          ],
          audio: null
        },
        {
          id: 3,
          type: 'fill-blank',
          question: 'Complete: "My ___ is very kind." (Minha irmã é muito gentil)',
          correctAnswer: 'sister',
          options: ['sister', 'brother', 'mother', 'father'],
          audio: null
        },
        {
          id: 4,
          type: 'multiple-choice',
          question: 'What does "Grandmother" mean? (O que significa "Grandmother"?)',
          correctAnswer: 'Avó',
          options: ['Avó', 'Avô', 'Tia', 'Mãe'],
          audio: null
        },
        {
          id: 5,
          type: 'translation',
          question: 'Translate to English: "Avô"',
          correctAnswer: 'Grandfather',
          options: ['Grandfather', 'Uncle', 'Father', 'Brother'],
          audio: null
        },
        {
          id: 6,
          type: 'fill-blank',
          question: 'Complete: "My ___ has two children." (Meu tio tem dois filhos)',
          correctAnswer: 'uncle',
          options: ['uncle', 'aunt', 'cousin', 'nephew'],
          audio: null
        },
        {
          id: 7,
          type: 'image-match',
          question: 'Who is this? (Quem é esta?) 👧',
          correctAnswer: 'daughter',
          options: [
            { id: 'daughter', text: '👧', label: 'Daughter' },
            { id: 'son', text: '👦', label: 'Son' },
            { id: 'mother', text: '👩', label: 'Mother' },
            { id: 'aunt', text: '👱‍♀️', label: 'Aunt' }
          ],
          audio: null
        }
      ]
    },
    {
      id: 8,
      title: 'Food & Drinks - Comida e Bebidas',
      description: 'Learn basic food vocabulary (Aprenda vocabulário básico de comida)',
      difficulty: 'beginner',
      xp: 18,
      exercises: [
        {
          id: 1,
          type: 'image-match',
          question: 'What food is this? (Que comida é esta?) 🍎',
          correctAnswer: 'apple',
          options: [
            { id: 'apple', text: '🍎', label: 'Apple' },
            { id: 'banana', text: '🍌', label: 'Banana' },
            { id: 'bread', text: '🍞', label: 'Bread' },
            { id: 'milk', text: '🥛', label: 'Milk' }
          ],
          audio: null
        },
        {
          id: 2,
          type: 'multiple-choice',
          question: 'How do you say "ÁGUA" in English?',
          correctAnswer: 'Water',
          options: ['Water', 'Juice', 'Coffee', 'Tea'],
          audio: null
        },
        {
          id: 3,
          type: 'translation',
          question: 'Translate to English: "Pão"',
          correctAnswer: 'Bread',
          options: ['Bread', 'Rice', 'Meat', 'Fish'],
          audio: null
        },
        {
          id: 4,
          type: 'fill-blank',
          question: 'Complete: "I drink ___ every morning." (Eu bebo café toda manhã)',
          correctAnswer: 'coffee',
          options: ['coffee', 'water', 'juice', 'tea'],
          audio: null
        },
        {
          id: 5,
          type: 'multiple-choice',
          question: 'What does "Chicken" mean? (O que significa "Chicken"?)',
          correctAnswer: 'Frango',
          options: ['Frango', 'Peixe', 'Carne', 'Arroz'],
          audio: null
        },
        {
          id: 6,
          type: 'image-match',
          question: 'What drink is this? (Que bebida é esta?) 🥛',
          correctAnswer: 'milk',
          options: [
            { id: 'milk', text: '🥛', label: 'Milk' },
            { id: 'juice', text: '🧃', label: 'Juice' },
            { id: 'tea', text: '☕', label: 'Tea' },
            { id: 'soda', text: '🥤', label: 'Soda' }
          ],
          audio: null
        },
        {
          id: 7,
          type: 'translation',
          question: 'Translate to English: "Arroz"',
          correctAnswer: 'Rice',
          options: ['Rice', 'Beans', 'Pasta', 'Potato'],
          audio: null
        },
        {
          id: 8,
          type: 'fill-blank',
          question: 'Complete: "I eat ___ for breakfast." (Eu como ovos no café da manhã)',
          correctAnswer: 'eggs',
          options: ['eggs', 'meat', 'fish', 'soup'],
          audio: null
        },
        {
          id: 9,
          type: 'multiple-choice',
          question: 'How do you say "QUEIJO" in English?',
          correctAnswer: 'Cheese',
          options: ['Cheese', 'Butter', 'Yogurt', 'Cream'],
          audio: null
        },
        {
          id: 10,
          type: 'typing',
          question: 'Type the English word for "maçã" (apple)',
          correctAnswer: 'apple',
          options: [],
          audio: null
        },
        {
          id: 11,
          type: 'drag-drop',
          question: 'Build the sentence: "I eat breakfast every morning" (Eu tomo café da manhã toda manhã)',
          correctAnswer: 'I eat breakfast every morning',
          words: ['I', 'eat', 'breakfast', 'every', 'morning'],
          options: [],
          audio: null
        }
      ]
    }
  ]
};

export const getLessonsForLanguage = (languageId) => {
  return lessons[languageId] || [];
};

export const getLanguageById = (languageId) => {
  return languages.find(lang => lang.id === languageId);
}; 