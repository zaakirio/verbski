# Verbski: A Russian Verb Conjugation Game

## 🎮 Game Overview

Verbski presents you with a conjugated Russian verb and challenges you to select the correct personal pronoun (я, ты, он/она/оно, etc.) that matches it. The game tracks your score, keeps a history of your attempts, and provides immediate feedback to enhance the learning process.


## 💻 Installation and Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/zaakirio/verbski.git
   cd verbski
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```


## 📚 How It Works

The game displays a conjugated verb form (e.g. "делаю") and prompts you to choose which personal pronoun it corresponds to (in this case, "я"). Each correct answer increases your score and streak, while incorrect answers provide the correct solution.

The verb data is stored in a JSON file, currenlty supporting approx. 50 common Russian verbs, each with their full present tense conjugation patterns.

## 🛠️ Future Enhancements

- Difficulty levels (beginner, intermediate, advanced)
- Verb categories (motion verbs, reflexive verbs, etc.)
- Audio pronunciation
- Past and future tense conjugations
- User accounts to save progress
- Leaderboards and achievements

## 🙏 Acknowledgements

Special appreciation to [Slovarish](https://tabidots.github.io/slovarish) that inspired this project