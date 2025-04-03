import * as Phaser from 'phaser';

import { GameWord } from '../models';

interface WordScrambleConfig {
  words: GameWord[];
  timeLimit: number; // in seconds
  onComplete: (score: number) => void;
}

export default class WordScrambleScene extends Phaser.Scene {
  private words: GameWord[] = [];
  private timeLimit: number = 60;
  private onComplete: (score: number) => void;

  private currentRound: number = 0;
  private score: number = 0;
  private correctAnswers: number = 0;
  private timeRemaining: number = 0;

  private scrambledWord: string = '';
  private currentWord: GameWord | null = null;

  // UI Elements
  private scoreText?: Phaser.GameObjects.Text;
  private timeText?: Phaser.GameObjects.Text;
  private wordText?: Phaser.GameObjects.Text;
  private definitionText?: Phaser.GameObjects.Text;
  private feedbackText?: Phaser.GameObjects.Text;
  private letterTiles: Phaser.GameObjects.Container[] = [];
  private answerTiles: Phaser.GameObjects.Container[] = [];
  private submitButton?: Phaser.GameObjects.Container;
  private skipButton?: Phaser.GameObjects.Container;

  // Timer
  private timer?: Phaser.Time.TimerEvent;

  constructor(config: WordScrambleConfig) {
    super('WordScrambleScene');
    this.words = config.words || [];
    this.timeLimit = config.timeLimit || 60;
    this.onComplete = config.onComplete || (() => {});
  }

  preload() {
    // Load assets
    this.load.image(
      'tile',
      '/images/games/tiles/button_square_depth_gradient.png'
    );
    this.load.image(
      'button',
      '/images/games/buttons/button_rectangle_depth_gloss.png'
    );
    this.load.audio('correct', '/sounds/switch-a.ogg');
    this.load.audio('wrong', '/sounds/click-b.ogg');
    this.load.audio('select', '/sounds/click-a.ogg');
  }

  create() {
    // Initialize game
    this.currentRound = 0;
    this.score = 0;
    this.correctAnswers = 0;
    this.timeRemaining = this.timeLimit;

    // Create background
    this.add
      .rectangle(0, 0, this.scale.width, this.scale.height, 0xf7f9fc)
      .setOrigin(0);

    // Create UI
    this.createUI();

    // Start timer
    this.timer = this.time.addEvent({
      delay: 1000,
      callback: this.updateTimer,
      callbackScope: this,
      loop: true,
    });

    // Start the first round
    this.startNextRound();
  }

  private createUI() {
    const centerX = this.scale.width / 2;

    // Header with score and time
    const headerBg = this.add
      .rectangle(centerX, 40, this.scale.width, 80, 0x6366f1)
      .setOrigin(0.5, 0.5);

    this.scoreText = this.add
      .text(100, 40, 'Score: 0', {
        fontFamily: 'Arial',
        fontSize: '24px',
        color: '#ffffff',
      })
      .setOrigin(0, 0.5);

    this.timeText = this.add
      .text(this.scale.width - 100, 40, 'Time: 60', {
        fontFamily: 'Arial',
        fontSize: '24px',
        color: '#ffffff',
      })
      .setOrigin(1, 0.5);

    // Word display area
    this.wordText = this.add
      .text(centerX, 120, '', {
        fontFamily: 'Arial',
        fontSize: '32px',
        color: '#334155',
      })
      .setOrigin(0.5);

    // Definition
    this.definitionText = this.add
      .text(centerX, 170, '', {
        fontFamily: 'Arial',
        fontSize: '18px',
        color: '#64748b',
        align: 'center',
        wordWrap: { width: this.scale.width - 200 },
      })
      .setOrigin(0.5);

    // Feedback text
    this.feedbackText = this.add
      .text(centerX, 220, '', {
        fontFamily: 'Arial',
        fontSize: '24px',
        color: '#10b981',
      })
      .setOrigin(0.5);

    // Answer area - where tiles will be placed when selected
    const answerAreaBg = this.add
      .rectangle(centerX, 300, 500, 60, 0xe2e8f0)
      .setOrigin(0.5);

    // Create buttons
    this.createButtons();
  }

  private createButtons() {
    const centerX = this.scale.width / 2;

    // Submit button
    const submitBg = this.add.image(0, 0, 'button').setDisplaySize(180, 60);
    const submitText = this.add
      .text(0, 0, 'Submit', {
        fontFamily: 'Arial',
        fontSize: '20px',
        color: '#ffffff',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    this.submitButton = this.add.container(centerX - 120, 450, [
      submitBg,
      submitText,
    ]);
    submitBg
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', this.checkAnswer, this)
      .on('pointerover', () => submitBg.setTint(0x8890fa))
      .on('pointerout', () => submitBg.clearTint());

    // Skip button
    const skipBg = this.add
      .image(0, 0, 'button')
      .setDisplaySize(180, 60)
      .setTint(0xf43f5e);
    const skipText = this.add
      .text(0, 0, 'Skip', {
        fontFamily: 'Arial',
        fontSize: '20px',
        color: '#ffffff',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    this.skipButton = this.add.container(centerX + 120, 450, [
      skipBg,
      skipText,
    ]);
    skipBg
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', this.skipWord, this)
      .on('pointerover', () => skipBg.setTint(0xfb7185))
      .on('pointerout', () => skipBg.setTint(0xf43f5e));
  }

  private startNextRound() {
    // Clear previous round
    this.clearLetterTiles();
    this.clearAnswerTiles();
    this.feedbackText?.setText('');

    // Check if we've gone through all words
    if (this.currentRound >= this.words.length) {
      this.endGame();
      return;
    }

    // Get the next word
    this.currentWord = this.words[this.currentRound];
    this.currentRound++;

    // Scramble the word
    this.scrambledWord = this.scrambleWord(this.currentWord.word);

    // Update UI
    this.wordText?.setText(`Unscramble: ${this.scrambledWord}`);
    this.definitionText?.setText(this.currentWord.definition || '');

    // Create letter tiles
    this.createLetterTiles();
  }

  private createLetterTiles() {
    const centerX = this.scale.width / 2;
    const word = this.currentWord?.word || '';

    // Scramble the order of letters
    const letters = word.split('');
    Phaser.Utils.Array.Shuffle(letters);

    // Create tiles for each letter
    const tileWidth = 50;
    const spacing = 10;
    const totalWidth = letters.length * (tileWidth + spacing) - spacing;
    const startX = centerX - totalWidth / 2 + tileWidth / 2;

    // Clear previous letter tiles if any
    this.letterTiles = [];

    letters.forEach((letter, index) => {
      const x = startX + index * (tileWidth + spacing);

      // Create tile background
      const tileBackground = this.add
        .image(0, 0, 'tile')
        .setDisplaySize(tileWidth, tileWidth);

      // Create letter text
      const letterText = this.add
        .text(0, 0, letter.toUpperCase(), {
          fontFamily: 'Arial',
          fontSize: '24px',
          color: '#ffffff',
          fontStyle: 'bold',
        })
        .setOrigin(0.5);

      // Create a container for the tile and letter
      const container = this.add.container(x, 370, [
        tileBackground,
        letterText,
      ]);
      container.setSize(tileWidth, tileWidth);
      container.setInteractive({ useHandCursor: true });

      // Store the letter in the container data
      container.setData('letter', letter);

      // Add to letter tiles array (store the container)
      this.letterTiles.push(container);

      // Add event handler
      container.on('pointerdown', () => {
        if (container.visible) {
          this.selectLetter(container);
          // Play sound
          this.sound.play('select');
        }
      });
    });

    // Create answer tiles (empty placeholders)
    this.createAnswerTiles(word.length);
  }

  private createAnswerTiles(length: number) {
    const centerX = this.scale.width / 2;
    const tileWidth = 50;
    const spacing = 10;
    const totalWidth = length * (tileWidth + spacing) - spacing;
    const startX = centerX - totalWidth / 2 + tileWidth / 2;

    // Clear previous answer tiles if any
    this.answerTiles = [];

    for (let i = 0; i < length; i++) {
      const x = startX + i * (tileWidth + spacing);

      // Create tile background with transparency for empty slots
      const tileBackground = this.add
        .image(0, 0, 'tile')
        .setDisplaySize(tileWidth, tileWidth)
        .setAlpha(0.5);

      // Create empty text object
      const letterText = this.add
        .text(0, 0, '', {
          fontFamily: 'Arial',
          fontSize: '24px',
          color: '#ffffff',
          fontStyle: 'bold',
        })
        .setOrigin(0.5);

      // Create a container for the tile and letter
      const container = this.add.container(x, 300, [
        tileBackground,
        letterText,
      ]);
      container.setSize(tileWidth, tileWidth);
      container.setInteractive({ useHandCursor: true });

      // Add to answer tiles array
      this.answerTiles.push(container);

      // Add event handler to remove letter
      container.on('pointerdown', () => {
        // Get the letter text component
        const text = container.getAt(1) as Phaser.GameObjects.Text;
        if (text && text.text !== '') {
          this.removeLetter(container);
        }
      });
    }
  }

  private selectLetter(container: Phaser.GameObjects.Container) {
    // Find the first empty answer tile
    const emptyTileIndex = this.answerTiles.findIndex(answerContainer => {
      const text = answerContainer.getAt(1) as Phaser.GameObjects.Text;
      return text && text.text === '';
    });

    if (emptyTileIndex >= 0) {
      // Get the answer container
      const answerContainer = this.answerTiles[emptyTileIndex];

      // Get the letter from the source container
      const letter = container.getData('letter');

      // Get the text component from the answer container
      const answerText = answerContainer.getAt(1) as Phaser.GameObjects.Text;
      if (answerText) {
        answerText.setText(letter.toUpperCase());
      }

      // Get the background from the answer container
      const answerBackground = answerContainer.getAt(
        0
      ) as Phaser.GameObjects.Image;
      if (answerBackground) {
        answerBackground.setAlpha(1);
      }

      // Store the source container in the answer container's data
      answerContainer.setData('sourceContainer', container);

      // Hide the source container
      container.setVisible(false);
    }
  }

  private removeLetter(container: Phaser.GameObjects.Container) {
    // Get the source container
    const sourceContainer = container.getData(
      'sourceContainer'
    ) as Phaser.GameObjects.Container;
    if (!sourceContainer) return;

    // Get the text component from the answer container
    const answerText = container.getAt(1) as Phaser.GameObjects.Text;
    if (answerText) {
      answerText.setText('');
    }

    // Get the background from the answer container
    const answerBackground = container.getAt(0) as Phaser.GameObjects.Image;
    if (answerBackground) {
      answerBackground.setAlpha(0.5);
    }

    // Show the source container
    sourceContainer.setVisible(true);

    // Clear the source container reference
    container.setData('sourceContainer', null);
  }

  private checkAnswer() {
    // Get the answer from the tiles
    const answer = this.answerTiles
      .map(container => {
        const text = container.getAt(1) as Phaser.GameObjects.Text;
        return text ? text.text : '';
      })
      .join('')
      .toLowerCase();

    const correct = this.currentWord?.word.toLowerCase() || '';

    if (answer === correct) {
      // Correct answer
      this.score += 10;
      this.correctAnswers++;
      this.scoreText?.setText(`Score: ${this.score}`);
      this.feedbackText?.setText('Correct!').setColor('#10b981');

      // Play sound
      this.sound.play('correct');

      // Show next word after a delay
      this.time.delayedCall(1500, this.startNextRound, [], this);
    } else {
      // Wrong answer
      this.feedbackText?.setText('Try again!').setColor('#f43f5e');

      // Play sound
      this.sound.play('wrong');

      // Shake the answer area
      this.cameras.main.shake(250, 0.01);
    }
  }

  private skipWord() {
    this.feedbackText
      ?.setText(`The word was: ${this.currentWord?.word.toUpperCase()}`)
      .setColor('#f59e0b');

    // Show next word after a delay
    this.time.delayedCall(1500, this.startNextRound, [], this);
  }

  private updateTimer() {
    this.timeRemaining--;
    this.timeText?.setText(`Time: ${this.timeRemaining}`);

    // Change color when time is running out
    if (this.timeRemaining <= 10) {
      this.timeText?.setColor('#f43f5e');
    }

    // End game if time runs out
    if (this.timeRemaining <= 0) {
      this.endGame();
    }
  }

  private endGame() {
    // Stop the timer
    this.timer?.remove();

    // Call the complete callback with just the score
    this.onComplete(this.score);

    // Dispatch custom event for React component
    const event = new CustomEvent('game-complete', {
      detail: {
        score: this.score,
      },
    });
    window.dispatchEvent(event);

    // Show game over screen
    this.showGameOverScreen();
  }

  private showGameOverScreen() {
    // Clear the screen
    this.clearLetterTiles();
    this.clearAnswerTiles();

    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    // Game over text
    this.add
      .text(centerX, centerY - 100, 'Game Over!', {
        fontFamily: 'Arial',
        fontSize: '48px',
        color: '#1e293b',
      })
      .setOrigin(0.5);

    // Final score
    this.add
      .text(centerX, centerY, `Final Score: ${this.score}`, {
        fontFamily: 'Arial',
        fontSize: '32px',
        color: '#1e293b',
      })
      .setOrigin(0.5);

    // Correct answers
    this.add
      .text(
        centerX,
        centerY + 50,
        `You got ${this.correctAnswers} out of ${this.words.length} words correct!`,
        {
          fontFamily: 'Arial',
          fontSize: '24px',
          color: '#64748b',
        }
      )
      .setOrigin(0.5);

    // Play again button
    const playAgainBg = this.add
      .image(centerX, centerY + 150, 'button')
      .setDisplaySize(200, 60)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.scene.restart();
      })
      .on('pointerover', () => playAgainBg.setTint(0x8890fa))
      .on('pointerout', () => playAgainBg.clearTint());

    this.add
      .text(centerX, centerY + 150, 'Play Again', {
        fontFamily: 'Arial',
        fontSize: '24px',
        color: '#ffffff',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);
  }

  private clearLetterTiles() {
    this.letterTiles.forEach(container => container.destroy());
    this.letterTiles = [];
  }

  private clearAnswerTiles() {
    this.answerTiles.forEach(container => container.destroy());
    this.answerTiles = [];
  }

  private scrambleWord(word: string): string {
    // Simple scrambling by shuffling the letters
    const letters = word.split('');

    // Keep shuffling until the scrambled word is different from the original
    let scrambled: string;
    do {
      Phaser.Utils.Array.Shuffle(letters);
      scrambled = letters.join('');
    } while (scrambled === word);

    return scrambled;
  }
}
