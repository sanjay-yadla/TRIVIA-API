# TRIVIA-API

User Flow and Features:

Player Setup:

Players input their names and start the game.

Category Selection:

Both players choose a common category from a list.
The selected category fetches 6 questions (2 easy, 2 medium, 2 hard) from The Trivia API.

Question and Answer:

Players take turns answering questions:
Player 1 answers the first easy question.
Player 2 answers the second easy question.
Repeat for medium and hard questions.

Scores:

Scores are updated based on the correctness of the answers:
Easy question: 10 points
Medium question: 15 points
Hard question: 20 points

Post-Question Options:

After all questions in a category are answered, players can choose to:
Select another category (previously selected categories cannot be chosen again).
End the game.

Game End and Results:

The game ends when players either choose to end it or all categories are exhausted.
The final scores are displayed, and the player with the higher score is declared the winner.
