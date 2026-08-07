function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
}

export function randomizeQuestion(q: any): any {
  if (!q) return q;
  const clone = { ...q };

  // 1. Multiple Choice / Boolean / Standard Options
  if (
    (clone.type === 'multiple-choice' || clone.type === 'boolean' || !clone.type) &&
    clone.options &&
    Array.isArray(clone.options) &&
    clone.options.length > 1
  ) {
    let correctText: string | undefined = undefined;

    if (typeof clone.correctAnswer === 'number' && clone.options[clone.correctAnswer] !== undefined) {
      correctText = clone.options[clone.correctAnswer];
    } else if (typeof clone.correctOptionIndex === 'number' && clone.options[clone.correctOptionIndex] !== undefined) {
      correctText = clone.options[clone.correctOptionIndex];
    } else if (typeof clone.correctAnswer === 'string' && clone.options.includes(clone.correctAnswer)) {
      correctText = clone.correctAnswer;
    } else if (
      clone.correctAnswer !== undefined &&
      !isNaN(Number(clone.correctAnswer)) &&
      clone.options[Number(clone.correctAnswer)] !== undefined
    ) {
      correctText = clone.options[Number(clone.correctAnswer)];
    } else {
      correctText = clone.options[0];
    }

    const shuffledOptions = shuffleArray(clone.options);
    const newIndex = shuffledOptions.indexOf(correctText);

    clone.options = shuffledOptions;
    if (newIndex >= 0) {
      clone.correctAnswer = newIndex;
      if (clone.correctOptionIndex !== undefined) {
        clone.correctOptionIndex = newIndex;
      }
    }
  }

  // 2. Drag Drop (shuffle dragOptions)
  if (clone.type === 'drag-drop' && clone.dragOptions && Array.isArray(clone.dragOptions)) {
    clone.dragOptions = shuffleArray(clone.dragOptions);
  }

  // 3. Match Following (shuffle both leftItems and rightItems, guarantee non-parallel placement)
  if (
    clone.type === 'match-following' &&
    clone.leftItems &&
    Array.isArray(clone.leftItems) &&
    clone.rightItems &&
    Array.isArray(clone.rightItems)
  ) {
    // Build explicit answer map based on direct alignment of leftItems and rightItems indices
    const answerMap: Record<string, string> = {};

    clone.leftItems.forEach((leftVal: string, idx: number) => {
      if (clone.rightItems[idx] !== undefined) {
        answerMap[leftVal] = clone.rightItems[idx];
      }
    });

    clone.correctAnswer = answerMap;

    let shuffledLeft = shuffleArray(clone.leftItems);
    let shuffledRight = shuffleArray(clone.rightItems);

    // Ensure rightItems are not sitting directly in parallel matching positions on screen
    let attempts = 0;
    while (
      shuffledRight.length > 1 &&
      shuffledRight.every((item, idx) => {
        const leftKey = String(shuffledLeft[idx] || '');
        return item === answerMap[leftKey];
      }) &&
      attempts < 20
    ) {
      shuffledRight = shuffleArray(clone.rightItems);
      attempts++;
    }

    clone.leftItems = shuffledLeft;
    clone.rightItems = shuffledRight;
  }

  // 4. Fill in the blank / Bucket options if any
  if (
    (clone.type === 'fill-in-the-blank' || clone.type === 'bucket') &&
    clone.options &&
    Array.isArray(clone.options)
  ) {
    clone.options = shuffleArray(clone.options);
  }

  return clone;
}

export function randomizeQuestions(questions: any[]): any[] {
  if (!Array.isArray(questions)) return [];
  return questions.map((q) => randomizeQuestion(q));
}

